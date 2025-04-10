import { Router } from "express";

// import { getHome } from "../controllers/user.controllers.js";

import { body, param, query, validationResult } from "express-validator";

import {
  categories_get,
  get_trending,
  get_latest_module,
  get_all_modules,
  get_modules_by_id,
  get_lesson_by_id,
  get_search_data,
  get_home_data,
  post_comment,
  comment_like_dislike,
  get_lesson_comments,
  post_reply,
  reply_like_dislike,
  get_users_details,
  post_subscription_home,
  post_subscription_plan,
  post_subscription,
  post_customer_billing_session,
  get_user_subscriptions,
  cancel_subscription,
  resume_subscription,
  get_subscription_status
} from "../controllers/user.controllers.js";

const userRouter = Router();

// get all category
userRouter.get("/category", categories_get);

// get all trending data
userRouter.get("/trending", get_trending);

// get the latest module
userRouter.get("/latest", get_latest_module);

// get all modules
userRouter.get(
  "/modules",
  [
    query("page").optional().isInt().withMessage("Page must be a number"),
    query("items").optional().isInt().withMessage("Items must be a number"),
  ],
  get_all_modules
);

// get module by id
userRouter.get(
  "/modules/:id",
  [
    param("id")
      .trim()
      .notEmpty()
      .withMessage("Module ID is required")
      .isInt()
      .withMessage("Module ID must be a number"),
    query("name").optional().isString().withMessage("Name is required"),
    query("items").optional().isInt().withMessage("Items must be a number"),
    query("page").optional().isInt().withMessage("Page must be a number"),
  ],
  get_modules_by_id
);

userRouter.get("/lesson/:id",
  [
    param("id")
      .trim()
      .notEmpty()
      .withMessage("Module ID is required")
      .isInt()
      .withMessage("Module ID must be a number"),
    query("name").optional().isString().withMessage("Name is required"),
    query("items").optional().isInt().withMessage("Items must be a number"),
    query("page").optional().isInt().withMessage("Page must be a number"),
  ],
  get_lesson_by_id
);

// get search data by term and date
userRouter.get(
  "/search",
  [
    query("term")
      .optional()
      .isString()
      .withMessage("Search Term is required")
      .matches(/^[^<>]*$/) // Regex to ensure no < or > characters
      .withMessage("Invalid search term"),
    query("year").optional().isNumeric().withMessage("Year must be numeric"),
    query("month").optional().isNumeric().withMessage("Month must be numeric"),
    query("items").optional().isInt().withMessage("Items must be a number"),
    query("page").optional().isInt().withMessage("Page must be a number"),
  ],
  get_search_data
);

userRouter.get("/home",
  [
    query("items").optional().isInt().withMessage("Items must be a number"),
    query("page").optional().isInt().withMessage("Page must be a number")
  ],
  get_home_data
);

userRouter.post("/comment", 
  [
    body("text")
      .trim()
      .notEmpty()
      .withMessage("Comment is required")
      .matches(/^[^<>]*$/) // Regex to ensure no < or > characters
      .withMessage("Invalid comment found..."),
    body("user_id").trim().notEmpty().withMessage("User is required").isInt().withMessage("User must be numeric"),
    body("lesson_id").trim().notEmpty().withMessage("Lesson is required").isInt().withMessage("Lesson must be numeric"),
  ], 
  post_comment
);

userRouter.post("/commentlikedislike", 
  [
    body("value").trim().notEmpty().withMessage("Value is required").isInt({ min: 0, max: 5 }).withMessage("Invalid value found..."),
    body("user_id").trim().notEmpty().withMessage("User is required").isInt().withMessage("User must be numeric"),
    body("comment_id").trim().notEmpty().withMessage("Comment is required").isInt().withMessage("Comment must be numeric"),
  ], 
  comment_like_dislike
);

userRouter.get("/comment/:lesson_id",
  [
    param("lesson_id").trim().notEmpty().withMessage("Lesson is required").isInt().withMessage("Lesson must be numeric"),
    query("items").optional().isInt().withMessage("Items must be a number"),
    query("page").optional().isInt().withMessage("Page must be a number"),
    query("items2").optional().isInt().withMessage("Item second must be a number"),
    query("page2").optional().isInt().withMessage("Page second must be a number")
  ],
  get_lesson_comments
);

userRouter.post("/reply", 
  [
    body("text").trim().notEmpty().withMessage("Reply is required").matches(/^[^<>]*$/).withMessage("Invalid reply found..."),
    body("user_id").trim().notEmpty().withMessage("User is required").isInt().withMessage("User must be numeric"),
    body("comment_id").trim().notEmpty().withMessage("Comment is required").isInt().withMessage("Comment must be numeric"),
  ],
  post_reply
);

userRouter.post("/replylikedislike",
  [
    body("value").trim().notEmpty().withMessage("Value is required").isInt({ min: 0, max: 5 }).withMessage("Invalid value found..."),
    body("user_id").trim().notEmpty().withMessage("User is required").isInt().withMessage("User must be numeric"),
    body("comment_id").trim().notEmpty().withMessage("Comment is required").isInt().withMessage("Comment must be numeric"),
  ],
  reply_like_dislike
);

userRouter.get("/user-details/:rem_token",
  [
    param("rem_token").trim().notEmpty().withMessage("User is required").matches(/^[^<>]*$/).withMessage("User must be valid"),
  ],
  get_users_details
);

userRouter.post("/subscription-home", 
  [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email Address required")
      .normalizeEmail()
      .isEmail()
      .withMessage("Invalid email")
  ],
  post_subscription_home
);

userRouter.post("/subscription-plan", 
  [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email Address required")
      .normalizeEmail()
      .isEmail()
      .withMessage("Invalid email")
  ],
  post_subscription_plan
);

userRouter.post("/subscribe", 
  [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email Address required")
      .normalizeEmail()
      .isEmail()
      .withMessage("Invalid email"),
    body("plan")
      .trim()
      .notEmpty()
      .withMessage("Plan Required")
      .custom(value => {
        if (!['starter', 'pro', 'premium'].includes(value.toLowerCase())) {
          throw new Error('Invalid plan found...');
        }
        return true;
      })
  ],
  post_subscription
);

userRouter.post("/customer",
  [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email Address required")
      .normalizeEmail()
      .isEmail()
      .withMessage("Invalid email")
  ],
  post_customer_billing_session
);

userRouter.post("/subscriptions",
  [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email Address required")
      .normalizeEmail()
      .isEmail()
      .withMessage("Invalid email")
  ], 
  get_user_subscriptions
);

userRouter.post("/subscription-cancel",
  [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email Address required")
      .normalizeEmail()
      .isEmail()
      .withMessage("Invalid email"),
    body("subscription_id")
      .trim()
      .notEmpty()
      .withMessage("Subscription required")
      .matches(/^[^<>]*$/)
      .withMessage("Invalid Subscription found...")
  ], 
  cancel_subscription
);

userRouter.post("/subscription-resume",
  [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email Address required")
      .normalizeEmail()
      .isEmail()
      .withMessage("Invalid email")
  ], 
  resume_subscription
);

userRouter.post("/subscriptions-status",
  [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email Address required")
      .normalizeEmail()
      .isEmail()
      .withMessage("Invalid email")
  ], 
  get_subscription_status
);

// userRouter.get("/success", (req, res, next) => {
//   return res.send("success");
// })

// userRouter.get("/cancel", (req, res, next) => {
//   return res.send("cancel");
// })

export default userRouter;