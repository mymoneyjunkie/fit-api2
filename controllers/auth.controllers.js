import { body, validationResult } from "express-validator";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import dbConnectionPromise from "../config/db.js";

import { 
	NODE_ENV, 
	ACCESS_TOKEN_SECRET, 
	REFRESH_TOKEN_SECRET, 
	ACCESS_EXPIRES_IN, 
	REFRESH_EXPIRES_IN, 
  	STRIPE_SECRET_KEY,
  	BASE_URL,
  	ENDPOINT_SECRET 
} from "../config/env.js";

import Stripe from "stripe";

const stripe = new Stripe(STRIPE_SECRET_KEY);

export const signIn = async (req, res, next) => {
	try {
		const { password } = req.body;

		const email = req.body.email ? req.body.email.toLowerCase() : req.body.email;

		const error = validationResult(req);

		let error1 = "";

		if (!error.isEmpty()) {
            const messages = error.array().map(err => err.msg).join(', '); // Join all error messages
		    const validationError = new Error(messages);
		    validationError.name = "ValidationError";
		    validationError.statusCode = 400;
		    validationError.oldInput = { email: email }; // Attach oldInput to the error
		    throw validationError;
        }

        else {
        	async function main() {
	        	const dbConnection = await dbConnectionPromise;
	        
		        const [users] = await dbConnection.query(
		            "SELECT * FROM users WHERE email = ?",
		            [email]
		        );

		        // console.log(users);

		        if (users == "") {
		        	error1 = new Error("User not found. Please Register...");
		        	error1.statusCode = 400;
		        	throw error1;
		        }

		        else {
		        	// const user = users[0];
			        const isMatch = await bcrypt.compare(password, users[0].password);
			        
			        if (!isMatch) {
			        	error1 = new Error("Invalid credentials");
			        	error1.statusCode = 400;
			        	throw error1;
			        }
			        
			        // Generate tokens
			        const accessToken = jwt.sign(
			            { id: users[0].id },
			            ACCESS_TOKEN_SECRET,
			            { expiresIn: ACCESS_EXPIRES_IN }
			        );
			        
			        const refreshToken = jwt.sign(
			            { id: users[0].id },
			            REFRESH_TOKEN_SECRET,
			            { expiresIn: REFRESH_EXPIRES_IN }
			        );
			      
			        // console.log("rt api", refreshToken);
			        
			        // Store refresh token in database
			        await dbConnection.query(
			            "UPDATE users SET rem_token = ? WHERE id = ?",
			            [refreshToken, users[0].id]
			        );
			      
			        res.cookie('MXDSAW', 
			            refreshToken, 
			            { 
			                httpOnly: true, 
			                sameSite: 'None', 
			                secure: true, 
			                maxAge: 24 * 60 * 60 * 1000 
			            }
			        );
			        
			        // Send response with appropriate status code
			        return res.status(200).json({
			            isSuccess: true,
			            message: "Login successful!",
			            token: accessToken
			        });
		        }
		    }

		    await main();
        }
	}

	catch (error) {
		console.log("login error: ", error);
		next(error);
	}
}

export const signUp = async (req, res, next) => {
	try {
		const { password, cpassword, name, image } = req.body;

		const email = req.body.email ? req.body.email.toLowerCase() : req.body.email;

    	const error = validationResult(req);

    	let error1 = "";

	    if (!error.isEmpty()) {
	    	const messages = error.array().map(err => err.msg).join(', '); // Join all error messages
		    const validationError = new Error(messages);
		    validationError.name = "ValidationError";
		    validationError.statusCode = 400;
		    validationError.oldInput = { email: email, name: name, image: image }; // Attach oldInput to the error
		    throw validationError;
	    }

	    else {
	    	async function main() {
		        const dbConnection = await dbConnectionPromise; // Wait for the promise to resolve

		        // Now you can use dbConnection to execute queries
		        const [response] = await dbConnection.query(
		          "SELECT * FROM users WHERE email = ?",
		          [email]
		        );
		        // console.log(response);

		        if (response != "") {
		        	error1 = new Error("Email already found. Please Login to continue...");
		        	error1.statusCode = 400;
		        	throw error1;
		        } 

		        else {
		          const hashedPassword = await bcrypt.hash(password, 10);

		          // console.log(hashedPassword);

		          const createdAt = new Date(); // January is month 0 in JavaScript
		          const formattedDate = createdAt.toISOString().split("T")[0];

		          // Prepare the insert query
		          const insertQuery =
		            "INSERT INTO users(email, password, name, image, role, created_at) VALUES (?, ?, ?, ?, ?, ?)";
		          const newUserData = [
		            email,
		            hashedPassword,
		            name,
		            image,
		            "user",
		            formattedDate,
		          ]; // Make sure to hash the password

		          const response1 = await dbConnection.query(insertQuery, newUserData);

		          	const customer = await stripe.customers.create({
						email: email,
						name: name
					}) 

					// console.log(customer);

		          // console.log(response1, !response1, response1[0].insertId);

		          if (response1 == "") {
		            error1.statusCode =  400;
		            error1 = new Error("Failed to register. Try Again...");
		            throw error1;
		          } 

		          else if (!customer && customer.length >= 0) {
		          	const [response3] = await dbConnection.query(
				        "DELETE FROM users WHERE email = ?",
				        [email]
				    );
		          	error1.statusCode =  400;
		            error1 = new Error("Failed to register. Try Again...");
		            throw error1;
		          }

		          else {
		            const accessToken = jwt.sign(
		              { id: response1[0].insertId },
		              ACCESS_TOKEN_SECRET,
		              { expiresIn: ACCESS_EXPIRES_IN }
		            );

		            const refreshToken = jwt.sign(
		              { id: response1[0].insertId },
		              REFRESH_TOKEN_SECRET,
		              { expiresIn: REFRESH_EXPIRES_IN }
		            );

		            const [response2] = await dbConnection.query(
		              "UPDATE `users` SET `rem_token` = ? WHERE id = ?",
		              [refreshToken, response1[0].insertId]
		            );

		            res.cookie("MXDSAW", refreshToken, {
		              sameSite: "None",
		              httpOnly: true, // Prevents JavaScript access to the cookie
		              secure: NODE_ENV === "production", // Use secure cookies in production
		              maxAge: 24 * 60 * 60 * 1000, // Cookie expiration time in milliseconds
		            });

		            // res.cookie('__prod__session', token, {
		            // 	httpOnly: true, // Prevents JavaScript access to the cookie
		            // 	secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
		            // 	maxAge: 1*24*3600 // Cookie expiration time in milliseconds
		            // });

		            return res.status(200).json({
		              isSuccess: true,
		              message: "Registration successful!",
		              token: accessToken,
		            });
		          }
		        }
	    	}

	    	await main();
	    }
	}

	catch (error) {
		console.log("register error: ", error);
		next(error);
	}
}