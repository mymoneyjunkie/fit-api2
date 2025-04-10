import { Router } from "express";

import { body } from "express-validator";

import { signIn, signUp } from "../controllers/auth.controllers.js";

const authRouter = Router();

authRouter.post("/login", 
	[
	    body("email")
	      .trim()
	      .notEmpty()
	      .withMessage("Email Address required")
	      .normalizeEmail()
	      .isEmail()
	      .withMessage("Invalid email"),
	    body("password")
	      .trim()
	      .notEmpty()
	      .withMessage("Password required")
	      .matches(/^[^<>]*$/)
	      .withMessage("Invalid password"),
  	],
  	signIn
);

authRouter.post("/register",
	[
	    body("name")
	      .trim()
	      .notEmpty()
	      .withMessage("Name required")
	      .matches(/^[^<>]*$/)
	      .withMessage("Invalid user name"),
	    body("email")
	      .trim()
	      .notEmpty()
	      .withMessage("Email Address required")
	      .normalizeEmail()
	      .isEmail()
	      .withMessage("Invalid email"),
	    body("password")
	      .trim()
	      .notEmpty()
	      .withMessage("Password required")
	      .matches(/^[^<>]*$/)
	      .withMessage("Invalid password"),
	    body("cpassword")
	      .notEmpty()
	      .withMessage("Confirm password is required")
	      .custom((value, { req }) => {
	        if (value !== req.body.password) {
	          throw new Error("Passwords do not match");
	        }
	        return true;
	      }),
  	], 
	signUp
);

export default authRouter;