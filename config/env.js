import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

// console.log(process.env.PORT, process.env.NODE_ENV);

export const { 
	PORT, 
	NODE_ENV, 
	ACCESS_TOKEN_SECRET, 
	REFRESH_TOKEN_SECRET, 
	ACCESS_EXPIRES_IN, 
	REFRESH_EXPIRES_IN,
	STRIPE_SECRET_KEY,
	BASE_URL,
	ENDPOINT_SECRET,
	HOST,
	USER,
	PASSWORD,
	DATABASE 
} = process.env; 