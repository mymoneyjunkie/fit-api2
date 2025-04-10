// import jwt from "jsonwebtoken";

import dbConnectionPromise from "../config/db.js";

// import { NODE_ENV, ACCESS_TOKEN_SECRET, ACCESS_EXPIRES_IN } from "../config/env.js";

export const signOut = async (req, res, next) => {
	try {
		const cookies = req.cookies;

		let error1 = '';
  
  		if (!cookies?.MXDSAW) {
  		 	error1 = new Error("Access Denied / Unauthorized user");
  		 	error1.statusCode = 401;
  		 	throw error1;
  		}
  
		  // console.log(cookies?.AWSALBTG);
		  
		  const refreshToken = cookies?.MXDSAW;
		  
		  const dbConnection = await dbConnectionPromise; 
		  
		  const [response1] = await dbConnection.query("UPDATE `users` set rem_token = null WHERE rem_token = ?", [refreshToken]);
			// console.log(response1);
		  
		  if (!response1) {
		    res.clearCookie("MXDSAW", {
		      sameSite: "None",
		      httpOnly: true, // Prevents JavaScript access to the cookie
		      secure: true // Use secure cookies in production
		    });
		    
		    error1 = new Error("Failed");
  		 	error1.statusCode = 401;
  		 	throw error1;
		  }
  
		  // delete refreshToken from db   
		  
		    res.clearCookie("MXDSAW", {
		      sameSite: "None",
		      httpOnly: true, // Prevents JavaScript access to the cookie
		      secure: true // Use secure cookies in production
		    });
		    
		    return res.status(204).send("Success");
	}

	catch (error) {
		next(error);
	}
}