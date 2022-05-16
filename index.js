const cookie = require('cookie');
const fs = require('fs');
const crypto = require('crypto');

module.exports = function(ops) {
	// default options
	/**
	 * @type {import('./').options}
	 */
	const options = {
		passwords: ops.passwords,
		loginTimeout: ops.loginTimeout || 1000 * 60 * 60,
		cookieName: ops.cookieName || 'auth_token',
		hash: ops.hash || (_=>_),
	};

	if(typeof options.passwords === 'string') {
		options.passwords = [options.passwords];
	} else if(!Array.isArray(options.passwords)) {
		throw new Error('Passwords must be a string or an array of strings');
	}

	if(options.passwords.length === 0) {
		throw new Error('At least one password is required');
	}
	
	const tokens = {};

	// clear expired tokens every so often
	setInterval(() => {
		for(let token in tokens) {
			if(tokens[token].expires < Date.now()) {
				delete tokens[token];
			}
		}
	}, 1000 * 60);

	/**
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 * @param {import('express').NextFunction} next
	 */
	return function(req, res, next) {
		const parsed = cookie.parse(req.headers.cookie || '');
		const token = parsed[options.cookieName];
		if(typeof token === 'string' && tokens[token] && tokens[token].expires > Date.now()) {
			req.authenticated = true;
			req.token = tokens[token];
			next();
		} else if(typeof req.query.password === 'string' && options.passwords.includes(options.hash(req.query.password))) {
			// generate token
			const token = crypto.randomBytes(32).toString('base64');
			tokens[token] = {
				expires: Date.now() + options.loginTimeout,
				sourcePassword: options.passwords.indexOf(options.hash(req.query.password))
			};

			// apply token
			res.setHeader('Set-Cookie', cookie.serialize(options.cookieName, token, {
				expires: new Date(tokens[token].expires),
				httpOnly: true,
				path: '/',
			}));

			req.authenticated = true;
			// clear out the query string
			res.redirect(req.path);
		} else {
			req.authenticated = false;
			res.sendFile('./login.html', {root: __dirname});
		}
	}
}