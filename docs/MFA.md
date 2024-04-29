# Multi-Factor Authentication (MFA) - Detailed Usage Guide

## Usage

### 1. Importing the Modules

```javascript
const { Auth } = require("@knfs-tech/bamimi-auth");

const auth = Auth.init(config);
		
const mfa = auth.getMFA()
```

### 2. Initializing the MFA Instance

```javascript
const mfa = new MFA(config);
```

### 3. Generating a Secret Key

To generate a secret key for MFA, use the `generateSecretKey` method:

```javascript
const secretKey = mfa.generateSecretKey();
```

### 4. Generating a Token

To generate a token using a secret key, use the `generateToken` method:

```javascript
const token = mfa.generateToken(secretKey);
```

### 5. Generating a URL with Secret

To generate a URL with a secret key, use the `generateUrlWithSecret` method:

```javascript
const url = mfa.generateUrlWithSecret(id, secretKey);
```

### 6. Checking a Token

To check the validity of a token, use the `check` method:

```javascript
const isValid = mfa.check(token, secretKey);
```

### 7. Generating a QR Code

To generate a QR code for MFA setup, use the `generateQRCode` method:

```javascript
const qrCode = await mfa.generateQRCode(url);
```

## Function Details

### `generateSecretKey()`

Generates a secret key for MFA.

- **Returns:** 
  - A secret key string.

### `generateToken(secret)`

Generates a token using the provided secret key.

- **Parameters:**
  - `secret`: The secret key for generating the token.
- **Returns:** 
  - A token string.

### `generateUrlWithSecret(id, secret)`

Generates a URL with a secret key for MFA setup.

- **Parameters:**
  - `id`: The ID associated with the user.
  - `secret`: The secret key for generating the URL.
- **Returns:** 
  - A URL string.

### `check(token, secret)`

Checks the validity of a token using the provided secret key.

- **Parameters:**
  - `token`: The token to be checked.
  - `secret`: The secret key used for generating the token.
- **Returns:** 
  - A boolean indicating whether the token is valid or not.

### `generateQRCode(url)`

Generates a QR code for MFA setup using the provided URL.

- **Parameters:**
  - `url`: The URL for MFA setup.
- **Returns:** 
  - An object containing base64 encoded data and an image tag for the QR code.

## Notes

- Ensure that you securely store and manage the generated secret keys.
- Implement additional security measures as per your application's requirements.
```
```