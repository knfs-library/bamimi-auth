# Password-based Authentication Function - Usage Guide

## Usage

1. **Import the `passwordBasesAuth` function**: 

     ```javascript
  	const { Auth } = require("@knfs-tech/bamimi-auth");

	const auth = Auth.init(config);
		
	const passwordBasedAuth = auth.getPasswordBasedAuth()
    ```

2. **Authenticate the user**: 

    Use the `check` function to authenticate the user based on the provided credentials and the comparison data:

    ```javascript
    const isAuthenticated = await passwordBasedAuth.check(originalData, comparisonData, { idFields, pinField });
    ```

3. **Handle authentication result**:

    Depending on the value of `isAuthenticated`, you can proceed with the appropriate action. For example:

    ```javascript
    if (isAuthenticated) {
        // Authentication successful
        console.log("Authentication successful");
    } else {
        // Authentication failed
        console.log("Authentication failed");
    }
    ```

## Function Details

### `check(originalData, comparisonData, { idFields = ['username'], pinField = 'password' })`

- **Parameters**:
    - `originalData`: An object containing the user's data from the database.
    - `comparisonData`: An object containing the credentials provided by the user.
    - `idFields`: An array of strings specifying the fields to be used for user identification (default is `['username']`).
    - `pinField`: A string specifying the field name for the password (default is `'password'`).
- **Returns**: 
    - `true` if authentication is successful, `false` otherwise.

### `hashPin(pin, saltRounds = 10)`

- **Parameters**:
    - `pin`: The password to be hashed.
    - `saltRounds`: The number of salt rounds for hashing (default is `10`).
- **Returns**: 
    - The hashed password.

## Notes

- Ensure that the provided `originalData` and `comparisonData` objects contain the necessary fields for authentication.
- Use strong and unique passwords for better security.
- Implement additional security measures such as rate limiting and account lockout to prevent brute force attacks.
