# Authentication APIs

[[TOC]]

## **POST: Authenticate by Password**

**Endpoint:** 

```
POST {{url}}/oauth/token
```

**Headers**

  | Key           | Value                          |
  | ------------- | -------------------------------|
  | Content-Type  | application/json               |
  | Authorization | Basic `base64ClientIdSecret`   |

**Note on `base64ClientIdSecret`**
- The `base64ClientIdSecret` is a Base64-encoded string created by concatenating the `clientId` and `clientSecret` in the format `clientId:clientSecret`. 
- This encoded value is used in the Authorization header for Basic Authentication.

**Request Body Example:**

```json
{
    "username": "{{username}}",
    "password": "{{password}}",
    "grant_type": "password"
}
```

**Response :**

```json
  {
    "token_type": "Bearer",
    "expires_in": 3600,
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5ZDIxYmUwYS01MzE5LTRkZDAtOTQ4Mi0zOTM5Njg0YzY3ODIiLCJqdGkiOiIyMTE0MTFlYWExZGU1YTRlNzcxOGRmODk1N2M2YWQyNzAzZTk0YzBhMjJjNDZlNTM4NWZmMTM0N2FjNDhiYzFkNjRlOTU2ODE0OWZjZmQ3NiIsImlhdCI6MTcyNzc1OTEzOS44MzI2NjEsIm5iZiI6MTcyNzc1OTEzOS44MzI2NjQsImV4cCI6MTcyNzc2MjczOS44MDQwMDYsInN1YiI6IjEiLCJzY29wZXMiOltdfQ.YTbSjKgZg4v8D2n11Az9TqjiJVvTyQPl-8BoqqkdfGhUlkMZ4DZ-JT49m7KPh-Y6slX8qzr_ZMryeKhbN_avR0lRxRt-xPkuXUbvGld-TpWHbsJ6eR7QK2UGyzMhM_CRQQH9MYNx8tIcNTON_mmp6DcqV9GcHzP20rUfkUIByvwaZF36l1rx3RosRjttvG1Jff9SeFcaHAwpy8uk9iu0nplOS-Se88Se8Ir8TU_kEZfUudwPw-7GEsQ2Bz9Z_AuZheVvBt8uPjlCGGjfGl7dcG_wy4JYkb3fyKe8IqTcTb6vsjC24pvtijkjaJljUaePzaPp5k5EdGXxLtYkAhxDBSmaxSicVesh-EHbqJHQmwc_CPN9K6tiuSv6YmGEfau4Mn6ryULDyjngvvN_gvAj7-F2cwk76pZWfcVMPazG40CfSyrfWG8xv7kuYNiZLQ48k8oahDdqoYK9a0MhBXmdq4AO6OKKPhp9_rS86ecB1vWNqKOJg3pnDq9cgsR26vXADrpJiL4ETDl3djR4sBGpBaqUstSC79H91yGApxfOvUWVxyA7ou_dEoryMaW6iVzwEv5-hZG9c3CoNEupvd_YeFjFSby-eBQ8AjubZm_B_NUbcJq7G4XoV2K1Gzpvfcvywb9F5cFANX-aoBLESauW8kPi7MA3n2QrXpadtmgBSD4",
    "refresh_token": "def50200b3b5e3ec4f608279263600e4041189dccaabe3e16ad487e72c26b80a128fcfe6232d21c4c9441ee258b8f03964f4685643865677e2e2613a7ed7251849f13934028f84dc33cbf589a6ce0c37e98066e561fbe16997751a831dd9df294a690c3ac43beab27cb86e64fa7eb1fe572c514fb5487d929dfc6b415f34803ce7168cd468fbc9a0f30b460244a8b9da559ec5dfe1b7b01f52219150e02d75a001007fed26a1fd66f2086fed15e4961f9481fdbdac032b3c055e5d6509e615e831fa6b395195cc561b14be95d9f16bf73a77bedcf20b9348e11d1a2a8bab3abaa62f585f1aa804e53b7f8e297b295a18b146eea8ada82ee4ea8d4e6cfdd563f1f06947b5b84ad1e02551674d302a77d1f0949f10324e37ed7c55620c0271a871555784b3d256ca7a48d261ca7afcac50235ae75066a73b7dd99034549a0c9cefb98685527f32b05f13cb681432919644766bc56fb1ad3412c43e96037cd1511d175460ee6f0d5e12a7e2ab90b2ae6e12be2e1a1f62f40ffe80457cd96f850adb5e3c4d23"
  }
```

#### Explanations

- **token_type**: Indicates the type of token issued (e.g., "Bearer").
- **expires_in**: Lifetime of the access token in seconds (e.g., 3600 seconds = 1 hour).
- **access_token**: The token used for authenticating API requests.
- **refresh_token**: Token used to obtain a new access token when the current one expires.

---

## **POST: Authenticate by Refresh Token**

If the access token expires, use the refresh token to obtain a new access token.

**Endpoint:** 
```
POST {{url}}/oauth/token
```

**Headers**

  | Key           | Value                          |
  | ------------- | -------------------------------|
  | Content-Type  | application/json               |
  | Authorization | Basic `base64ClientIdSecret`   |

**Request Body Example:**

```json
{
    "refresh_token": "{{refreshToken}}",
    "grant_type": "refresh_token"
}
```

**Response Example:**

```json
  {
    "token_type": "Bearer",
    "expires_in": 3600,
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5ZDIxYmUwYS01MzE5LTRkZDAtOTQ4Mi0zOTM5Njg0YzY3ODIiLCJqdGkiOiIyMTE0MTFlYWExZGU1YTRlNzcxOGRmODk1N2M2YWQyNzAzZTk0YzBhMjJjNDZlNTM4NWZmMTM0N2FjNDhiYzFkNjRlOTU2ODE0OWZjZmQ3NiIsImlhdCI6MTcyNzc1OTEzOS44MzI2NjEsIm5iZiI6MTcyNzc1OTEzOS44MzI2NjQsImV4cCI6MTcyNzc2MjczOS44MDQwMDYsInN1YiI6IjEiLCJzY29wZXMiOltdfQ.YTbSjKgZg4v8D2n11Az9TqjiJVvTyQPl-8BoqqkdfGhUlkMZ4DZ-JT49m7KPh-Y6slX8qzr_ZMryeKhbN_avR0lRxRt-xPkuXUbvGld-TpWHbsJ6eR7QK2UGyzMhM_CRQQH9MYNx8tIcNTON_mmp6DcqV9GcHzP20rUfkUIByvwaZF36l1rx3RosRjttvG1Jff9SeFcaHAwpy8uk9iu0nplOS-Se88Se8Ir8TU_kEZfUudwPw-7GEsQ2Bz9Z_AuZheVvBt8uPjlCGGjfGl7dcG_wy4JYkb3fyKe8IqTcTb6vsjC24pvtijkjaJljUaePzaPp5k5EdGXxLtYkAhxDBSmaxSicVesh-EHbqJHQmwc_CPN9K6tiuSv6YmGEfau4Mn6ryULDyjngvvN_gvAj7-F2cwk76pZWfcVMPazG40CfSyrfWG8xv7kuYNiZLQ48k8oahDdqoYK9a0MhBXmdq4AO6OKKPhp9_rS86ecB1vWNqKOJg3pnDq9cgsR26vXADrpJiL4ETDl3djR4sBGpBaqUstSC79H91yGApxfOvUWVxyA7ou_dEoryMaW6iVzwEv5-hZG9c3CoNEupvd_YeFjFSby-eBQ8AjubZm_B_NUbcJq7G4XoV2K1Gzpvfcvywb9F5cFANX-aoBLESauW8kPi7MA3n2QrXpadtmgBSD4",
    "refresh_token": "def50200b3b5e3ec4f608279263600e4041189dccaabe3e16ad487e72c26b80a128fcfe6232d21c4c9441ee258b8f03964f4685643865677e2e2613a7ed7251849f13934028f84dc33cbf589a6ce0c37e98066e561fbe16997751a831dd9df294a690c3ac43beab27cb86e64fa7eb1fe572c514fb5487d929dfc6b415f34803ce7168cd468fbc9a0f30b460244a8b9da559ec5dfe1b7b01f52219150e02d75a001007fed26a1fd66f2086fed15e4961f9481fdbdac032b3c055e5d6509e615e831fa6b395195cc561b14be95d9f16bf73a77bedcf20b9348e11d1a2a8bab3abaa62f585f1aa804e53b7f8e297b295a18b146eea8ada82ee4ea8d4e6cfdd563f1f06947b5b84ad1e02551674d302a77d1f0949f10324e37ed7c55620c0271a871555784b3d256ca7a48d261ca7afcac50235ae75066a73b7dd99034549a0c9cefb98685527f32b05f13cb681432919644766bc56fb1ad3412c43e96037cd1511d175460ee6f0d5e12a7e2ab90b2ae6e12be2e1a1f62f40ffe80457cd96f850adb5e3c4d23"
  }
```
---
