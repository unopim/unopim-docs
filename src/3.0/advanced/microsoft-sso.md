# Microsoft SSO (Entra ID)

UnoPim can authenticate admin users against **Microsoft Entra ID** (formerly Azure Active Directory) using the OAuth 2.0 authorization code flow with PKCE. Once configured, a **Sign in with Microsoft** button appears on the admin login page alongside the normal email and password form.

This guide assumes no prior Azure experience. It walks through creating a directory, registering the application, collecting the three credentials UnoPim needs, creating a test user, and troubleshooting the errors you are most likely to hit.

---

## How it works

Understanding the flow makes the configuration steps and the error messages far easier to reason about.

1. The admin clicks **Sign in with Microsoft**.
2. UnoPim generates a random `state`, a PKCE `code_verifier`, and a `nonce`, stores all three in the session, and redirects the browser to Microsoft's authorize endpoint.
3. The user authenticates with Microsoft. UnoPim never sees their password.
4. Microsoft redirects the browser back to UnoPim's **redirect URI** with an authorization code.
5. UnoPim verifies the `state`, then exchanges the code for tokens server-to-server, sending the `code_verifier` and the client secret. The secret never touches the browser.
6. UnoPim validates the `nonce` and the `tid` (tenant) claim on the returned `id_token`.
7. UnoPim calls Microsoft Graph to read the user's object id, email, and display name.
8. UnoPim looks for a **matching admin account that already exists** and logs them in.

::: warning SSO authenticates — it does not authorize
UnoPim never creates admin accounts from an SSO login. Microsoft proves *who* someone is; it says nothing about what they may do inside your PIM. An admin user with a matching email and a role must exist in UnoPim beforehand, or the login is refused. See [Creating the UnoPim admin](#step-8-create-the-matching-unopim-admin).
:::

---

## Architecture

Microsoft is not special-cased anywhere in the login flow. It is registered as the first driver of a general SSO registry, so everything below applies equally to any provider you add yourself.

### Class map

All classes live in the `Webkul\Admin` namespace unless noted.

| Class | Responsibility |
| --- | --- |
| `Contracts\SsoProvider` | The driver contract. Code, label, icon, enabled state, URLs, redirect, identity resolution, sort order. |
| `Sso\AbstractOAuthProvider` | Base implementation of the authorization code flow — generates and verifies the state, PKCE verifier, and nonce; leaves the provider-specific calls abstract. |
| `Sso\MicrosoftProvider` | The Entra ID driver. Builds the authorize URL, exchanges the code, validates `nonce` and `tid`, reads Graph. |
| `Sso\SsoManager` | Resolves and caches drivers from the `sso.providers` config. Exposes `all()`, `enabled()`, `get()`, `getEnabled()`, `has()`. |
| `Sso\SsoAuthenticator` | Provider-agnostic account resolution, validation, session establishment, and event dispatch. |
| `Sso\SsoIdentity` | Readonly DTO: `identifier`, `email`, `name`, `raw`. |
| `Sso\SsoToken` | Readonly DTO: `accessToken`, `idToken`. |
| `Exceptions\SsoAuthenticationException` | Carries a translated message, a flash type, and the email to echo back. |
| `Http\Controllers\User\SsoController` | Thin controller. Resolves the driver, delegates, translates exceptions into redirects. |
| `Traits\ResolvesLandingUrl` | Shared post-login landing resolution, also used by `SessionController`. |

`SsoManager` is bound with `$this->app->scoped()` rather than `singleton()` so it is reset per request under Octane. Resolved driver instances hold no request state — the handshake lives in the session.

### Request lifecycle

```
GET /admin/login/sso/{provider}
  SsoController::redirect()
    SsoManager::getEnabled($provider)          → 404-equivalent redirect if unknown or disabled
    AbstractOAuthProvider::redirect()
      generate state, verifier, nonce
      session()->put("sso_handshake.{code}", [...])
      → 302 to the provider's authorize endpoint

GET /admin/login/sso/{provider}/callback?code=…&state=…
  SsoController::callback()
    SsoManager::getEnabled($provider)
    AbstractOAuthProvider::resolveIdentity()
      session()->pull("sso_handshake.{code}")  → consumed, single use
      hash_equals(state)                       → null on mismatch
      exchangeCodeForToken($code, $verifier)   → server-to-server
      isTokenAcceptable($token, $nonce)        → nonce + tid assertions
      fetchIdentity($token)                    → SsoIdentity
    SsoAuthenticator::authenticate()
      dispatch unopim.admin.sso.identity.resolved
      resolveAdmin()                           → by subject id, then by email
      reject if missing / API user / inactive
      dispatch unopim.admin.sso.login.before
      Auth::guard('admin')->login()
      session regenerate + token regenerate
      dispatch unopim.admin.sso.login.after
    → redirect()->intended(firstAllowedUrl())
```

### Account resolution order

`SsoAuthenticator::resolveAdmin()` deliberately prefers the immutable subject id over the email:

1. Look up an admin by `(sso_provider, sso_identifier)`. If found, use it — the email is irrelevant at this point and may have changed in the directory.
2. Otherwise look up by lowercased email.
3. If that admin is already linked to **this** provider with a **different** identifier, refuse. The address was reassigned to someone else.
4. Otherwise persist `sso_provider` and `sso_identifier` on the admin, linking the account for future logins.

Email is a bootstrap mechanism only. Directories reassign addresses, and without step 3 a new joiner inheriting a departed colleague's address would inherit their admin account too.

### Session storage

The handshake is stored under `sso_handshake.{provider_code}` and holds `state`, `verifier`, and `nonce`. Namespacing by driver means two enabled providers cannot consume each other's handshake. The key is read with `pull()`, so it is destroyed on first use and a callback cannot be replayed.

### Configuration precedence

`MicrosoftProvider::config()` reads `core()->getConfigData('general.microsoft_sso.settings.*')` first and falls back to `config('services.microsoft_sso.*')`. Database values therefore win over environment values. `isEnabled()` requires the enabled flag plus non-empty tenant, client id, and client secret, which is why a partially filled configuration hides the button rather than rendering one that cannot work.

### Views

The login page renders `<x-admin::sso.buttons :providers="$ssoProviders" />`, where `$ssoProviders` is the `enabled()` collection passed from `SessionController::create()`. The component renders the divider only when at least one driver is enabled, and delegates each button to `<x-admin::sso.button>`, which pulls its label, URL, and optional icon view from the driver.

### Database

The migration `add_sso_identity_to_admins_table` adds two nullable columns to `admins`:

| Column | Purpose |
| --- | --- |
| `sso_provider` | Driver code the account is linked to, e.g. `microsoft` |
| `sso_identifier` | Provider-side immutable subject id |

They carry a composite unique index, `admins_sso_identity_unique`, so one directory identity cannot be linked to two admin accounts.

---

## Prerequisites

- A Microsoft Entra directory (tenant) that **you administer**. A personal Microsoft account on its own is not enough — see [Step 1](#step-1-get-a-directory-you-administer).
- UnoPim reachable over a URL you have configured in `APP_URL`.
- Global Administrator (or Application Administrator + User Administrator) rights in that directory.

---

## Step 1: Get a directory you administer

This is the step that blocks most first-time users, so it is worth getting right before touching anything else.

If you sign in to the Azure portal with a **personal** Microsoft account (outlook.com, hotmail.com, gmail.com, and so on), Microsoft may place you in a placeholder directory shown as **"Microsoft Services"**. That directory is owned by Microsoft. You are a consumer inside it, not an administrator, and you cannot create users or app registrations there. It is not a permission you can grant yourself.

You can recognise this situation by looking at **Microsoft Entra ID → Overview**:

| Field | Unusable placeholder directory | Usable directory |
| --- | --- | --- |
| Name | A GUID, or "Microsoft Services" | A real name, e.g. "Default Directory" |
| Primary domain | A GUID | `something.onmicrosoft.com` |
| Your role | User | Global Administrator |

If the **Primary domain** is a GUID rather than an `onmicrosoft.com` address, stop and get a real directory first.

### Getting a usable directory

**Option A — Sign up for Azure.** Go to [azure.microsoft.com/free](https://azure.microsoft.com/free) and complete the sign-up. This creates a **Default Directory** where you are Global Administrator. A card is required for identity verification; the directory itself and Entra ID Free are not paid products.

**Option B — Use a work or school account.** If your organisation already has a tenant, ask an administrator for app-registration rights. This is usually the fastest route.

::: tip Creating an extra tenant is often not possible any more
The **Manage tenants → Create** wizard in the portal now shows *"Customers must own a paid license to create Microsoft Entra Workforce tenant"*, with **Workforce (legacy)** greyed out and **Governed Workforce** in preview behind that licence.

You usually do not need it. If Azure sign-up already gave you a **Default Directory**, use that one.

Do not substitute the **External** tenant type. That is Microsoft Entra External ID (CIAM), a different product served from `*.ciamlogin.com`. UnoPim's Microsoft driver targets `login.microsoftonline.com` and will not work against it.
:::

---

## Step 2: Find your Redirect URI

UnoPim tells you the exact value. In the admin panel go to:

**Configuration → System Settings → Microsoft SSO**

The **Redirect URI** field at the top is read-only and shows the precise URL to register, with a copy icon beside it. Use that value verbatim.

It follows this shape:

```
{APP_URL}/{admin_url}/login/sso/microsoft/callback
```

For a default installation on `http://localhost:8000`:

```
http://localhost:8000/admin/login/sso/microsoft/callback
```

::: warning
The path depends on your `APP_URL` and on the `admin_url` config value. If you have renamed the admin route prefix, the URI changes with it. Always copy the value from the settings screen rather than typing it from memory — Entra requires a character-for-character match, including scheme, port, and the absence of a trailing slash.
:::

Microsoft exempts `http://localhost` from its HTTPS-only rule, so local development works without a tunnel or certificate. Every other host must use `https://`.

---

## Step 3: Register the application

1. Open the [Azure portal](https://portal.azure.com) and go to **Microsoft Entra ID → App registrations**.
2. Click **+ New registration**.
3. **Name**: anything recognisable, e.g. `UnoPim`.
4. **Supported account types**: choose **Accounts in this organizational directory only (Single tenant)**.
5. **Redirect URI**: set the platform dropdown to **Web** and paste the value from Step 2.
6. Click **Register**.

::: tip Prefer single tenant
Single tenant means only members of your own directory can complete the sign-in. This makes your directory the gate. Multi-tenant authorities are supported but require extra configuration — see [Multi-tenant setups](#multi-tenant-setups).
:::

---

## Step 4: Copy the Client ID and Tenant ID

The **Overview** page shown after registration lists both values:

| Portal label | UnoPim field |
| --- | --- |
| Application (client) ID | Client ID |
| Directory (tenant) ID | Tenant ID |

Both are GUIDs. Copy them somewhere temporary.

---

## Step 5: Create a client secret

1. In the app registration, open **Certificates & secrets**.
2. On the **Client secrets** tab, click **+ New client secret**.
3. Give it a description and an expiry, then click **Add**.
4. Copy the **Value** column immediately.

::: danger The secret is shown once
Copy the **Value**, not the **Secret ID**. Once you navigate away the value is masked permanently and you must generate a new secret. Note the expiry date — when a secret expires, SSO logins begin failing with no other warning.
:::

---

## Step 6: Grant the Graph permission

UnoPim requests the scopes `openid profile email User.Read`. `User.Read` is added by default on new registrations.

1. Open **API permissions**.
2. Confirm **Microsoft Graph → User.Read** (Delegated) is listed. If it is missing, click **+ Add a permission → Microsoft Graph → Delegated permissions**, tick `User.Read`, and confirm.
3. Click **Grant admin consent for &lt;your directory&gt;** and confirm.

Granting consent centrally means individual users are not prompted to approve the app on first sign-in.

---

## Step 7: Create a directory user to test with

Skip this if you already have a normal user account in the directory.

1. Go to **Microsoft Entra ID → Users → All users**.
2. Click **+ New user → Create new user**.
3. **User principal name**: enter the local part, e.g. `pimtest`, and pick your `.onmicrosoft.com` domain from the dropdown beside it. The full address becomes `pimtest@yourtenant.onmicrosoft.com`.
4. **Display name**: e.g. `PIM Test`.
5. Set or auto-generate a password and record it.
6. Click **Review + create → Create**.

No mailbox or licence is required. Entra forces this user to change their password at first sign-in; that happens inside Microsoft's flow and is expected.

---

## Step 8: Create the matching UnoPim admin

**This step is mandatory.** Without it, a perfectly configured SSO setup still fails.

1. In UnoPim go to **Settings → Users → Create**.
2. **Email**: must match the Microsoft account exactly, e.g. `pimtest@yourtenant.onmicrosoft.com`.
3. **Status**: Active.
4. **Role**: assign a role that grants at least one permission the user can reach.
5. Set any password — SSO logins bypass it entirely. It is only used if the same person also signs in with email and password.
6. Save.

::: warning A role with no reachable page locks the user out
If the assigned role is `custom` with no permissions, UnoPim authenticates the user, finds no page they are allowed to open, and immediately signs them out with a 403 message. Grant at least one usable permission. Note that a menu section's own permission is not enough on its own — the destination route is gated by its own ACL key, so grant both the section and the specific child page.
:::

---

## Step 9: Configure UnoPim

You can configure Microsoft SSO from the admin UI or from the environment. **Values stored in the admin UI take precedence over environment values.**

### From the admin panel

Go to **Configuration → System Settings → Microsoft SSO** and fill in:

| Field | Value |
| --- | --- |
| Enable Microsoft SSO | On |
| Tenant ID | Directory (tenant) ID from Step 4 |
| Client ID | Application (client) ID from Step 4 |
| Client Secret | Secret **Value** from Step 5 |

Save. The **Sign in with Microsoft** button appears on the login page as soon as all four are set.

### From the environment

```dotenv
MICROSOFT_SSO_ENABLED=true
MICROSOFT_SSO_TENANT=00000000-0000-0000-0000-000000000000
MICROSOFT_SSO_CLIENT_ID=00000000-0000-0000-0000-000000000000
MICROSOFT_SSO_CLIENT_SECRET=your-secret-value
```

Then clear the config cache:

```shell
php artisan config:clear
```

::: tip Docker
When running under Docker, run the command inside the application container, and remember that Compose interpolates environment values at container start. Changing `.env` may require `docker compose up -d --force-recreate` rather than a plain restart.
:::

The button is only rendered when SSO is **enabled and fully credentialed** — that is, enabled is on and tenant, client id, and client secret are all non-empty. A partially filled configuration hides the button rather than showing a broken one.

---

## Step 10: Test the login

1. Open your admin login page. **Use the same host as `APP_URL`** — browsing by IP when `APP_URL` says `localhost` triggers UnoPim's APP_URL mismatch guard.
2. Click **Sign in with Microsoft**.
3. Sign in as the directory user from Step 7 and complete the forced password change.
4. You land on the first page your UnoPim role permits.

---

## Troubleshooting

### "Please check your credentials and try again", with the email pre-filled

This is the most common outcome of a correct Azure setup, and it is good news: it means Microsoft authenticated the user and returned their email successfully. UnoPim then refused the login.

The email being echoed back into the form is the giveaway — UnoPim could only know that address if the whole OAuth exchange worked.

Causes, in order of likelihood:

1. **No UnoPim admin exists with that email.** See [Step 8](#step-8-create-the-matching-unopim-admin). Compare the address character by character — Microsoft may return a different address than you expect (see the `mail` vs `userPrincipalName` note below).
2. **The matching admin is an API user.** API-type accounts are non-interactive and cannot sign in.
3. **The email now belongs to a different directory account.** UnoPim links an admin to the Microsoft object id on first sign-in. If the address was later reassigned to a different person, the new person is refused rather than inheriting the previous holder's admin account.

::: tip Why the message is deliberately vague
A distinct "no such account" response would let an outsider discover which email addresses are UnoPim admins. Missing account, wrong account type, and reassigned address all produce the same message. The trade-off is that a correct configuration and a missing account look identical from the login page.

To see the resolved address while debugging, attach a listener to the `unopim.admin.sso.identity.resolved` event — it fires with the email before the account lookup runs.
:::

### "Your account is not activated"

The matching UnoPim admin exists but its status is inactive. Activate it under **Settings → Users**.

### AADSTS50020: "Selected user account does not exist in tenant …"

The account you signed in with is not a member of the tenant that owns the application.

- If the tenant named in the message is **Microsoft Services**, you were signing in to the Azure portal itself with a personal account. Revisit [Step 1](#step-1-get-a-directory-you-administer).
- If it names your own tenant, sign in with a user that belongs to that directory ([Step 7](#step-7-create-a-directory-user-to-test-with)), or invite the external account as a guest under **Users → New user → Invite external user**.

### The portal rejects your personal Microsoft account

Both `portal.azure.com` and `entra.microsoft.com` sign in through the `/organizations` authority, which does not accept personal Microsoft accounts. You need an account that belongs to a directory. Completing Azure sign-up ([Step 1](#step-1-get-a-directory-you-administer)) creates one for you.

### AADSTS50011: redirect URI mismatch

The registered redirect URI does not match what UnoPim sent. Copy the value from the settings screen again and compare scheme, host, port, path, and trailing slash. Changing `APP_URL` or the admin route prefix changes this URI and requires updating the app registration.

### The login loops back with no message

Usually an expired client secret. Check the expiry under **Certificates & secrets**, create a new secret, and update the configuration.

### The user signs in and is immediately signed out with a 403

The role assigned in UnoPim grants no reachable page. See the warning in [Step 8](#step-8-create-the-matching-unopim-admin).

### Graph returns an unexpected email address

UnoPim reads the `mail` attribute and falls back to `userPrincipalName` when `mail` is empty. For guest (B2B) accounts the UPN is mangled — `you_gmail.com#EXT#@tenant.onmicrosoft.com` — so if `mail` is not populated for a guest, the fallback will not match your UnoPim admin. Set the `mail` attribute on the directory user, or create the UnoPim admin with whichever address Graph actually returns.

---

## Multi-tenant setups

Setting the tenant to a shared authority — `common`, `organizations`, or `consumers` — lets accounts from any directory reach your callback. UnoPim therefore refuses to trust the returned tenant implicitly.

When the configured tenant is one of those shared values you **must** also supply an allow list of tenant ids:

```dotenv
MICROSOFT_SSO_TENANT=common
MICROSOFT_SSO_ALLOWED_TENANTS=00000000-0000-0000-0000-000000000000,11111111-1111-1111-1111-111111111111
```

UnoPim reads the `tid` claim from the `id_token` and rejects the login unless it appears in that list. With the list empty, **every** login on a shared authority is refused. This fails closed on purpose: without it, switching the tenant to `common` would silently allow any Microsoft account in the world to reach the account lookup, leaving only the email match between an outsider and an admin session.

When the tenant is a specific id, the allow list is ignored and the `tid` claim is compared directly against it.

A **verified domain** such as `contoso.onmicrosoft.com` is also accepted in the tenant field. Entra takes a domain anywhere it takes a tenant id, but tokens always carry the id, so UnoPim resolves the domain to its tenant id once through the provider's OpenID configuration document and caches the result for a day before comparing.

---

## Security model

What UnoPim implements, and what each control protects against:

| Control | Purpose |
| --- | --- |
| `state` parameter, compared with `hash_equals` | Blocks login CSRF |
| PKCE (S256) | Blocks authorization code interception and injection |
| `nonce` validated on the `id_token` | Blocks token replay |
| `tid` claim checked against the configured tenant | Blocks tenant confusion |
| Server-side code exchange | The client secret never reaches the browser |
| Session id and CSRF token regenerated on login | Blocks session fixation |
| Matching on the immutable object id | A reassigned email cannot inherit an admin account |
| No account provisioning | An SSO identity alone never grants PIM access |
| Uniform error messages | Prevents admin email enumeration |
| Handshake state namespaced per provider | Two enabled providers cannot consume each other's handshake |

The `state`, `code_verifier`, and `nonce` are stored in the session under a key scoped to the provider and are consumed on first use.

### Operational recommendations

- Prefer a single-tenant app registration.
- Track the client secret expiry; rotate before it lapses.
- Grant SSO users the narrowest role that lets them work.
- Serve the admin panel over HTTPS in production. Only `localhost` is exempt from Entra's HTTPS requirement.
- Deactivating a UnoPim admin blocks SSO login immediately, independent of the directory.

---

## Restricting which directory users may sign in

By default every member of your directory can complete the Microsoft half of the sign-in. In an organisation of 500 people where only 50 use the PIM, the other 450 authenticate successfully with Microsoft and are then refused by UnoPim because no admin account exists for them. That is safe, but the rejection happens late.

To make Entra the gate instead, turn on assignment enforcement:

1. Go to **Microsoft Entra ID → Enterprise applications** and open the app.
2. Open **Properties** and set **Assignment required?** to **Yes**.
3. Open **Users and groups** and assign only the people or groups who should have PIM access.

Unassigned users are now stopped by Microsoft before the browser returns to UnoPim, with `AADSTS50105: The signed in user is not assigned to a role for the application`.

::: danger Required before enabling automatic provisioning
Without assignment enforcement, provisioning would create a UnoPim admin for **every** directory member who signs in. Set **Assignment required?** to Yes and scope the assignment to a group first.
:::

Assigning a group rather than individuals is usually the better arrangement: membership becomes the single control your identity team already manages, and no PIM administrator has to be involved when someone joins or leaves.

---

## Automatic provisioning (optional)

UnoPim does not create accounts from SSO logins, but it emits events you can hook to build that behaviour yourself.

| Event | Fires | Payload |
| --- | --- | --- |
| `unopim.admin.sso.identity.resolved` | After the provider returns an identity, **before** the account lookup | `SsoIdentity`, `SsoProvider` |
| `unopim.admin.sso.login.before` | After a matching admin is found and validated, before login | `Admin`, `SsoProvider` |
| `unopim.admin.sso.login.after` | After the session is established | `Admin`, `SsoProvider` |

`identity.resolved` is the provisioning hook. A listener can create the admin account so the lookup that follows succeeds:

```php
use Illuminate\Support\Facades\Event;
use Webkul\Admin\Contracts\SsoProvider;
use Webkul\Admin\Sso\SsoIdentity;

Event::listen('unopim.admin.sso.identity.resolved', function (SsoIdentity $identity, SsoProvider $provider) {
    // Create the admin with a default role when none exists for $identity->email.
    // $identity->raw holds the full provider payload, useful for group-to-role mapping.
});
```

::: danger Only provision on a single-tenant registration
On a shared authority, automatic provisioning would hand an admin account to anyone with a Microsoft account. Restrict it to a pinned tenant, and prefer a minimal read-only default role that an administrator elevates deliberately.
:::

---

## Adding another identity provider

Microsoft is shipped as the first driver of a general SSO registry. Packages can register additional providers — Google, Okta, Keycloak — without overriding core views or controllers.

### 1. Implement the contract

Extend `AbstractOAuthProvider`, which handles the state, PKCE, and nonce handshake for the authorization code flow:

```php
namespace Acme\OktaSso;

use Webkul\Admin\Sso\AbstractOAuthProvider;
use Webkul\Admin\Sso\SsoIdentity;
use Webkul\Admin\Sso\SsoToken;

class OktaProvider extends AbstractOAuthProvider
{
    public function getCode(): string
    {
        return 'okta';
    }

    public function getLabel(): string
    {
        return trans('acme-okta::app.sign-in-with-okta');
    }

    public function isEnabled(): bool
    {
        return (bool) core()->getConfigData('general.okta_sso.settings.enabled');
    }

    protected function buildAuthorizationUrl(string $state, string $codeChallenge, string $nonce): string
    {
        // Return the provider's authorize URL with these values embedded.
    }

    protected function exchangeCodeForToken(string $authorizationCode, string $codeVerifier): ?SsoToken
    {
        // Exchange server-to-server, or null when the exchange fails.
    }

    protected function fetchIdentity(SsoToken $token): ?SsoIdentity
    {
        // Return an SsoIdentity with the provider's immutable subject id and email.
    }
}
```

Optionally override `getIconView()` to render a logo, `getSort()` to order the buttons, and `isTokenAcceptable()` to add issuer or audience assertions.

### 2. Register the driver

Merge into the `sso.providers` config from your service provider:

```php
public function register(): void
{
    $this->mergeConfigFrom(dirname(__DIR__).'/Config/sso.php', 'sso');
}
```

```php
// Config/sso.php
return [
    'providers' => [
        'okta' => \Acme\OktaSso\OktaProvider::class,
    ],
];
```

The driver's routes are then available automatically at `/{admin_url}/login/sso/okta` and `/{admin_url}/login/sso/okta/callback`, and its button renders on the login page whenever `isEnabled()` returns true. Account lookup, validation, session handling, and the events above are shared with every other driver.

### 3. Extend the login page

Two view render events wrap the SSO block if you need to inject markup around the buttons:

- `unopim.admin.sessions.create.sso.before`
- `unopim.admin.sessions.create.sso.after`

---

## Testing a driver

Drivers are testable without touching a real identity provider. Register a stub in `sso.providers` and drive the routes directly.

```php
use Webkul\Admin\Sso\AbstractOAuthProvider;
use Webkul\Admin\Sso\SsoIdentity;
use Webkul\Admin\Sso\SsoManager;
use Webkul\Admin\Sso\SsoToken;

class FakeSsoProvider extends AbstractOAuthProvider
{
    public function getCode(): string
    {
        return 'fake';
    }

    public function getLabel(): string
    {
        return 'Sign in with Fake';
    }

    public function isEnabled(): bool
    {
        return true;
    }

    protected function buildAuthorizationUrl(string $state, string $codeChallenge, string $nonce): string
    {
        return 'https://fake-idp.test/authorize?state='.$state;
    }

    protected function exchangeCodeForToken(string $authorizationCode, string $codeVerifier): ?SsoToken
    {
        return new SsoToken(accessToken: 'fake-access-token');
    }

    protected function fetchIdentity(SsoToken $token): ?SsoIdentity
    {
        return new SsoIdentity(identifier: 'fake-subject', email: 'user@example.com');
    }
}

beforeEach(function () {
    config()->set('sso.providers.fake', FakeSsoProvider::class);

    app()->forgetInstance(SsoManager::class);
});
```

Seed the handshake directly when exercising the callback:

```php
$this->withSession(['sso_handshake' => ['fake' => [
    'state'    => 'valid-state',
    'verifier' => 'v',
    'nonce'    => 'n',
]]])->get(route('admin.session.sso.callback', [
    'provider' => 'fake',
    'state'    => 'valid-state',
    'code'     => 'auth-code',
]));
```

For the Microsoft driver specifically, fake both HTTP endpoints with `Http::fake()`. The token response must include an `id_token` whose `nonce` and `tid` claims match the seeded handshake and the configured tenant, otherwise `isTokenAcceptable()` rejects it. An unsigned JWT is sufficient — UnoPim reads the claims without verifying the signature, which is safe because the token arrives directly from the token endpoint over TLS (OIDC Core §3.1.3.7).

Cases worth covering in your own driver: state mismatch, nonce mismatch, unknown email, inactive admin, API-type admin, first-time subject linking, and a reassigned email.

---

## Reference

### Routes

| Name | Path |
| --- | --- |
| `admin.session.sso.redirect` | `/{admin_url}/login/sso/{provider}` |
| `admin.session.sso.callback` | `/{admin_url}/login/sso/{provider}/callback` |

### Environment variables

| Variable | Default | Description |
| --- | --- | --- |
| `MICROSOFT_SSO_ENABLED` | `false` | Turns the driver on |
| `MICROSOFT_SSO_TENANT` | empty | Directory (tenant) id, a verified domain, or a shared authority |
| `MICROSOFT_SSO_CLIENT_ID` | empty | Application (client) id |
| `MICROSOFT_SSO_CLIENT_SECRET` | empty | Client secret value |
| `MICROSOFT_SSO_ALLOWED_TENANTS` | empty | Comma-separated tenant ids, required only on a shared authority |

### Configuration keys

Values saved in the admin UI live under `general.microsoft_sso.settings.*` and override the environment.

### Database columns

The `admins` table carries `sso_provider` and `sso_identifier`, populated when an account is first linked to a provider identity. They are unique together. Clearing them unlinks the account, after which the next SSO login re-links it by email.
