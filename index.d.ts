import express from 'express';

declare module 'express' {
	interface Request {
		/**
		 * If the user is authenticated or not.
		 */
		authenticated?: boolean;
		/**
		 * The token that the user is authenticated with.
		 */
		token?: {
			/**
			 * The time when the token will expire.
			 */
			expires: number;
			/**
			 * The password id it was generated from. Ex: ['a', 'b'] would have 0 for a someone using a and 1 for b.
			 */
			sourcePassword: number;
		}
	}
}

export interface options {
	/**
	 * The valid password (or passwords) to use for authentication.
	 */
	passwords: string | string[];
	/**
	 * The time in milliseconds that each auth token is valid for. Default is one hour.
	 */
	loginTimeout?: number;
	/**
	 * The cookie where the auth token is stored. Default is "auth_token"
	 */
	cookieName?: string;
	/**
	 * The function to hash the passwords. Defaults to no hash. If you use this, all passwords must be entered hashed to begin with.
	 */
	hash?: (password: string) => string;
}

declare function ironCurtain(options: options): express.RequestHandler;

export = ironCurtain;