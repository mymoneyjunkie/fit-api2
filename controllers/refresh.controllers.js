import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import dbConnectionPromise from "../config/db.js";

import { NODE_ENV, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, ACCESS_EXPIRES_IN } from "../config/env.js";

export const handleRefreshToken = async (req, res, next) => {
	try {
		let refreshToken =
    		req.headers.authorization != undefined
      		? req.headers.authorization.startsWith("MXDSAW")
      		: "";

      	let error1 = '';

  		if (!refreshToken) {
    		error1 = new Error("Access Denied / Unauthorized request");
    		error1.statusCode = 401;
    		throw error1;
  		}

		try {
		    // console.log(req.headers.authorization);

		    if (req.headers.authorization.startsWith("MXDSAW")) {
		      refreshToken = req.headers.authorization?.split(" ")[1]; // Get token from "Bearer <token>"
		    }

		    // console.log("refresh api", refreshToken);

		    // const refreshToken = cookies?.AWSALBTG;

		    const dbConnection = await dbConnectionPromise;

		    const [foundUser] = await dbConnection.query(
		      "SELECT * FROM users WHERE rem_token = ?",
		      [refreshToken]
		    );
		    // console.log(foundUser);

		    if (!foundUser) {
		      	error1 = new Error("Access Denied / Unauthorized user"); // forbidden
		      	error1.statusCode = 401;
		      	throw error1;
		    }

		    // evaluate jwt
		    const verifiedUser = await jwt.verify(
		      refreshToken,
		      REFRESH_TOKEN_SECRET
		    );

		    if (Number(verifiedUser.id) != Number(foundUser[0]?.id)) {
		    	error1 = new Error("Access Denied / Unauthorized user");
		    	error1.statusCode = 401;
		    	throw error1;
		    }

		    else {
		      const accessToken = jwt.sign(
		        { id: foundUser[0]?.id },
		        ACCESS_TOKEN_SECRET,
		        { expiresIn: ACCESS_EXPIRES_IN }
		      );

		      // res.header("Authorization", accessToken);

		      return res.json({
		        isSuccess: true,
		        message: "successful!",
		        token: accessToken,
		      });
		    }
		} 

		catch (error) {
		    error1 = new Error("Invalid Token");
		    error1.statusCode = 401;
		    throw error1;
		}
	}

	catch (error) {
		next(error);
	}
}