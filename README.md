# iron-curtain
Simple authentication middleware for an express server.

## Installation
```sh
$ npm install iron-curtain
```

## Quick-Start
```js
const express = require('express');
const app = express();

app.use(require('iron-curtain')({
	passwords: ['password1'],// required
	loginTimeout: 1000 * 60 * 60,// in milliseconds
	cookieName: 'auth_token'// make sure you're not using this somewhere else 
}));

app.get('/', (req, res) => {
	res.end('<h1>Hello World</h1>');
});

app.listen(80, () => console.log('Listening on port 80'));
```

## Reference
### Options
- passwords

	Either a single string for one password or an array of passwords used to log in.

- cookieName

	The name of the cookie where the auth token is stored. Make sure you're not using this for anything else in your project.

- hash

	A function to hash user submitted passwords. If this is used all passwords originally entered must be entered in a hashed form. Defaults to no hash.

- loginTimeout

	The amount of time in milliseconds that the user is authenticated for.

### express.Request
- authenticated

	A boolean of if the request has a valid token or not.

- token
	- expires

		The time when the token will expire.
	
	- sourcePassword

		The password index that was used to log in.