# JSON Web Token (JWT) Management - Detailed Usage Guide


## Usage

### 1. Importing the Modules

```javascript
  
const { Auth } = require("@knfs-tech/bamimi-auth");

const auth = Auth.init(config);
		
const jwt = auth.getJWT()

```
### 2. Generating a Refresh Token

To generate a refresh token, use the `generateRefreshToken` method:

```javascript
const refreshToken = await jwt.generateRefreshToken(data);
```

### 3. Generating an Access Token

To generate an access token, use the `generateAccessToken` method:

```javascript
const accessToken = await jwt.generateAccessToken(data);
```

### 4. Verifying a Token

To verify a token, use the `verify` method:

```javascript
const verifiedPayload = await jwt.verify(token);
```

### 5. Setting a Token to Blacklist

To set a token to the blacklist, use the `setBlacklist` method:

```javascript
await jwt.setBlacklist(token);
```

### 6. Checking Token Blacklist

To check if a token is blacklisted, use the `checkBlacklist` method:

```javascript
const isBlacklisted = await jwt.checkBlacklist(token);
```

### 7. Closing Connection (if using Redis)

If you're using Redis for storage, close the connection when done:

```javascript
await jwt.closeConnection();
```

## Configuration

You can customize the JWT configuration using the `configType` object. Modify the `configType` object according to your requirements before initializing the JWT instance.

## Function Details

### `generateRefreshToken(data)`

Generates a refresh token using the provided data.

- **Parameters:**
  - `data`: The data to be encoded into the token.
- **Returns:** 
  - A refresh token string.

### `generateAccessToken(data)`

Generates an access token using the provided data.

- **Parameters:**
  - `data`: The data to be encoded into the token.
- **Returns:** 
  - An access token string.

### `verify(token)`

Verifies the authenticity of a token.

- **Parameters:**
  - `token`: The token to be verified.
- **Returns:** 
  - A Promise that resolves to the decoded payload of the token.

### `setBlacklist(token)`

Sets a token to the blacklist.

- **Parameters:**
  - `token`: The token to be blacklisted.

### `checkBlacklist(token)`

Checks if a token is blacklisted.

- **Parameters:**
  - `token`: The token to be checked.
- **Returns:** 
  - A boolean indicating whether the token is blacklisted or not.

### `closeConnection()`

Closes the connection if using Redis as the storage.

## Notes

- Ensure that the required configuration options are provided before initializing the JWT instance.
- Handle errors appropriately when using the JWT management module.
- Implement additional security measures as per your application's requirements.