# Creating a New User in UnoPIM via the Command Line



Use the following command structure to create a new user in UnoPIM:

**`
php artisan unopim:user:create --name="username" --email="useremail" --password="userpassword" --ui_locale="locale_code" --timezone="timezone" --admin
`**

## Command Parameters Explained

- **`--name`**: Full name of the user, displayed across the UnoPIM interface.
- **`--email`**: User's email address, used for login and notifications.
- **`--password`**: A strong password for the account. Follow secure password practices.
- **`--ui_locale`**: User interface language code (e.g., `en_US` for English, `fr_FR` for French).
- **`--timezone`**: User's timezone (e.g., `UTC`, `America/New_York`, `Asia/Kolkata`) for accurate timestamps.
- **`--admin`** *(optional)*:  Optional. This flag, if included, grants the user admin privileges. Admin users have full access to all features and settings in UnoPim, making it crucial to assign this role carefully. If this flag is not added, a custom role is assigned by default (if anyone exists). Otherwise, a default custom role with dashboard-only permissions is created and assigned to the user.

## Example Usage

To create a user with the following details:

- **Name**: John Doe  
- **Email**: johndoe@example.com  
- **Password**: securepassword123  
- **Locale**: English (`en_US`)  
- **Timezone**: America/New_York  
- **Admin Privileges**: -- admin

Run the command:

```bash
php artisan unopim:user:create --name="John Doe" --email="johndoe@example.com" --password="securepassword123" --ui_locale="en_US" --timezone="America/New_York" --admin
```

This will create a new user with the specified details and assign admin privileges.

## Best Practices

1. **Secure Credentials**:  
   Ensure strong, unique passwords for each user to prevent unauthorized access.

2. **Admin Access**:  
   Only assign admin privileges to trusted individuals as they have unrestricted access to the system.

3. **Locale and Timezone**:  
   Setting the appropriate locale and timezone helps improve user experience and ensures accurate logging.