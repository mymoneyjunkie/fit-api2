import { Router } from "express";

import { body, param, query, validationResult } from "express-validator";

import {
  home_get,
  get_trending,
  post_trending,
  trending_delete,
	categories_get, 
	categories_post, 
	categories_edit, 
	categories_update, 
	modules_post, 
	modules_edit,
	modules_update,
	modules_get_lessons,
	modules_post_lessons,
	modules_delete,
  category_delete,
	get_all_modules 
} from "../controllers/admin.controllers.js";

const adminRouter = Router();

// get home
adminRouter.get("/home", home_get);

// get all category
adminRouter.get("/category", categories_get);

// post category
adminRouter.post("/category",
	[
		body("name")
	      .trim()
	      .notEmpty()
	      .withMessage("Category required")
	      .matches(/^[^<>]*$/)
	      .withMessage("Invalid category found")
	],
	categories_post
);

// get category by id
adminRouter.get("/category/:id",
	[
		param("id")
	      .trim()
          .notEmpty()
          .withMessage("ID is required")
          .isInt()
          .withMessage("ID must be a number")
	],
	categories_edit
);

// update category
adminRouter.post("/category/:id",
	[
		param("id")
	      .trim()
          .notEmpty()
          .withMessage("ID is required")
          .isInt()
          .withMessage("ID must be a number"),
        body("name")
	      .trim()
	      .notEmpty()
	      .withMessage("Category required")
	      .matches(/^[^<>]*$/)
	      .withMessage("Invalid category found")
	],
	categories_update
);

// get all modules
adminRouter.get("/modulesAll",
	[
    query("page").optional().isInt().withMessage("Page must be a number"),
    query("items").optional().isInt().withMessage("Items must be a number"),
  ], 
	get_all_modules
);

// post module
adminRouter.post("/modules",
	[
	    body("title")
	      .trim()
	      .notEmpty()
	      .withMessage("Module Title is required.")
	      .matches(/^[^<>]*$/)
	      .withMessage("Invalid Module Title..."),
      body("description")
	      .trim()
	      .notEmpty()
	      .withMessage("Module Description is required.")
	      .matches(/^[^<>]*$/)
	      .withMessage("Invalid Module Description..."),
	    body("image").trim().notEmpty().withMessage("Module Image is required").escape(),
	    body("video").trim().notEmpty().withMessage("Module Video is required").escape(),
	    body("duration").trim().notEmpty().withMessage("Module Video is required"),
	    body("category").trim().notEmpty().withMessage("Category is required"),
  	],
 	modules_post
);

// get module by id
adminRouter.get("/modules/:id",
	[
		param("id")
	      .trim()
          .notEmpty()
          .withMessage("ID is required")
          .isInt()
          .withMessage("ID must be a number")
	], 
	modules_edit
);

// update module
adminRouter.post("/modules/:id",
	[
		param("id")
	      .trim()
          .notEmpty()
          .withMessage("ID is required")
          .isInt()
          .withMessage("ID must be a number"),
	    body("title")
	      .trim()
	      .notEmpty()
	      .withMessage("Module Title is required.")
	      .matches(/^[^<>]*$/)
	      .withMessage("Invalid Module Title..."),
      body("description")
	      .trim()
	      .notEmpty()
	      .withMessage("Module Description is required.")
	      .matches(/^[^<>]*$/)
	      .withMessage("Invalid Module Description..."),
	    body("image").trim().notEmpty().withMessage("Module Image is required").escape(),
	    body("video").trim().notEmpty().withMessage("Module Video is required").escape(),
	    body("duration").trim().notEmpty().withMessage("Module Video is required"),
	    body("category").trim().notEmpty().withMessage("Category is required"),
  	],
 	modules_update
);

// get lessons by id
adminRouter.get("/moduleLessons/:id",
	[
		param("id")
	      .trim()
          .notEmpty()
          .withMessage("ID is required")
          .isInt()
          .withMessage("ID must be a number")
	], 
	modules_get_lessons
);

// post/update module
adminRouter.post("/moduleLessons/:id",
	[
		param("id")
	      .trim()
          .notEmpty()
          .withMessage("ID is required")
          .isInt()
          .withMessage("ID must be a number"),

        body('title')
		    .custom(value => {
		        // Check if the value is either a string or an array
		        if (typeof value === 'string') {
		          if (value.trim() === '') {
		            throw new Error('Lesson Title must not be empty.');
		          }
		        } else if (Array.isArray(value)) {
		          if (value.length === 0 || value.some(title => title.trim() === '')) {
		            throw new Error('Lesson Title must not be empty.');
		          }
		        } else {
		          throw new Error('Lesson Title must be a string or an array.');
		        }
		        return true;
		    }),

	    body('description')
		    .custom(value => {
		        if (typeof value === 'string') {
		          if (value.trim() === '') {
		            throw new Error('Lesson Description must not be empty.');
		          }
		        } else if (Array.isArray(value)) {
		          if (value.length === 0 || value.some(img => img.trim() === '')) {
		            throw new Error('Lesson Description must not be empty.');
		          }
		        } else {
		          throw new Error('Lesson Description must be a string or an array.');
		        }
		        return true;
		        // if (!Array.isArray(value) || value.length === 0 || value.every(img => img.trim() === '')) {
		        //   throw new Error('Episode Description must not be empty.');
		        // }
		        // return true;
		    }),

	    body('image')
		    .custom(value => {
		        if (typeof value === 'string') {
		          if (value.trim() === '') {
		            throw new Error('Lesson Image must not be empty.');
		          }
		        } else if (Array.isArray(value)) {
		          if (value.length === 0 || value.some(img => img.trim() === '')) {
		            throw new Error('Lesson Image must not be empty.');
		          }
		        } else {
		          throw new Error('Lesson Image must be a string or an array.');
		        }
		        return true;
		        // if (!Array.isArray(value) || value.length === 0 || value.every(img => img.trim() === '')) {
		        //   throw new Error('Episode Image must not be empty.');
		        // }
		        // return true;
		    }),

	    body('fileCode')
		    .custom(value => {
		        if (typeof value === 'string') {
		          if (value.trim() === '') {
		            throw new Error('Lesson Video must not be empty.');
		          }
		        } else if (Array.isArray(value)) {
		          if (value.length === 0 || value.some(img => img.trim() === '')) {
		            throw new Error('Lesson Video must not be empty.');
		          }
		        } else {
		          throw new Error('Lesson Video must be a string or an array.');
		        }
		        return true;
		        // if (!Array.isArray(value) || value.length === 0 || value.every(img => img.trim() === '')) {
		        //   throw new Error('Episode Video must not be empty.');
		        // }
		        // return true;
		   	}),

		body('duration')
		    .custom(value => {
          // console.log(typeof value, value);
          if (typeof value === 'string' && !isNaN(parseFloat(value))) {
            if (value <= 0) {
              throw new Error('Lesson duration must be a positive number.');
            }
          } else if (Array.isArray(value)) {
            // if (value.length === 0 || value.some(img => img.trim() === '')) {
            if (value.length === 0 || value.some(dur => {
              !isNaN(parseFloat(dur)) || dur <= 0 })) {
              throw new Error('All elements in Lesson duration array must be positive numbers.');
            }
          } else {
            throw new Error('Lesson duration must be a positive number or an array of positive numbers.');
          }
          return true;
		    }),
  	], 
	modules_post_lessons
);

// delete module
adminRouter.get("/moduleDelete/:id",
	[
		param("id")
	      .trim()
          .notEmpty()
          .withMessage("ID is required")
          .isInt()
          .withMessage("ID must be a number"),
    ], 
    modules_delete
);

// delete category
adminRouter.get("/categoryDelete/:id",
	[
		param("id")
	      .trim()
          .notEmpty()
          .withMessage("ID is required")
          .isInt()
          .withMessage("ID must be a number"),
    ], 
    category_delete
);

// get all trending data
adminRouter.get("/trending", get_trending);

// post trending
adminRouter.post("/trending",
  [
		body("module_id")
	      .trim()
        .notEmpty()
        .withMessage("Module Id is required")
        .isInt()
        .withMessage("Module Id must be a number"),
  ],
  post_trending
);

// delete trending
adminRouter.get("/trendingDelete/:id",
  [
		param("id")
	      .trim()
        .notEmpty()
        .withMessage("ID is required")
        .isInt()
        .withMessage("ID must be a number"),
  ],
  trending_delete
);

export default adminRouter;