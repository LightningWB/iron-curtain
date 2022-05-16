const express = require('express');

const app = express();
app.use(require('../')({
	passwords: 'password1',
	loginTimeout: 1000 * 25 * 60 * 24// in milliseconds
}));

app.get('/', (req, res) => {
	res.end('<h1>Hello World</h1>');
});

app.listen(80, () => console.log('Listening on port 80'));