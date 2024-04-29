# Password-based Authentication Function - Usage Guide

## Usage

1. **Import the `basicAuth` function**: 

    ```javascript
  	const { Auth } = require("@knfs-tech/bamimi-auth");

	const auth = Auth.init(config);
		
	const basicAuth = auth.getBasicAuth()
    ```

2. **Receive the request and extract the Authorization header**: 

    Assume you receive a request object named `req` in your Node.js application. You can extract the Authorization header as follows:

    ```javascript
    const authorizationHeader = req.headers.authorization;
    ```

3. **Retrieve user data from the database**:

    You need to retrieve the user data corresponding to the provided credentials from your database. For example, if you are using MongoDB with Mongoose, you might do something like this:

    ```javascript
    const User = require('./models/User'); // Assuming you have a User model
    const userData = await User.findOne({ username });
    ```

4. **Authenticate the user**:

    Use the `check` function to authenticate the user based on the provided credentials and the retrieved user data:

    ```javascript
    const isAuthenticated = await basicAuth.check(userData, authorizationHeader);
    ```

5. **Handle authentication result**:

    Depending on the value of `isAuthenticated`, you can proceed with the appropriate action. For example:

    ```javascript
    if (isAuthenticated) {
        // Authentication successful
        res.status(200).send("Authentication successful");
    } else {
        // Authentication failed
        res.status(401).send("Authentication failed");
    }
    ```

## Notes

- Ensure that the Authorization header is properly formatted and contains valid credentials.
- Always hash passwords before storing them in the database and compare hashed passwords for authentication.
- Use HTTPS to encrypt communication between the client and server to protect sensitive information, including credentials.
```