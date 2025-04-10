import moment from 'moment-timezone';

import { body, param, validationResult } from "express-validator";

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

export const categories_get = async (req, res, next) => {
  try {
    const error = validationResult(req);

    let error1 = "";

	  if (!error.isEmpty()) {
      const messages = error.array().map(err => err.msg).join(', '); // Join all error messages
	    const validationError = new Error(messages);
	    validationError.name = "ValidationError";
	    validationError.statusCode = 400;
	    validationError.oldInput = ""; // Attach oldInput to the error
	    throw validationError;
    }
    
    else {
      async function main() {
        const dbConnection = await dbConnectionPromise; // Wait for the promise to resolve

        // Now you can use dbConnection to execute queries
        const [response] = await dbConnection.query("SELECT * FROM category");
        // console.log(response);

        if (response == "") {
        	error1 = new Error("No data found...");
		    error1.statusCode = 400;
		    throw error1;
        } else {
          return res.status(200).json({
            isSuccess: true,
            data: response,
          });
        }
      }

      await main();
    }
  } 
  
  catch (error) {
    console.log("get category error: ", error);
    next(error);
    // return res.status(500).json({
    //   isSuccess: false,
    //   message: "Failed try Again...",
    // });
  }
};

export const get_trending = async (req, res, next) => {
  try {
    const error = validationResult(req);

    let error1 = "";

	if (!error.isEmpty()) {
        const messages = error.array().map(err => err.msg).join(', '); // Join all error messages
	    const validationError = new Error(messages);
	    validationError.name = "ValidationError";
	    validationError.statusCode = 400;
	    validationError.oldInput = ""; // Attach oldInput to the error
	    throw validationError;
    }
    
    else {
      async function main() {
        const dbConnection = await dbConnectionPromise; // Wait for the promise to resolve

        // Now you can use dbConnection to execute queries
        const [response] = await dbConnection.query(
          `SELECT m.id, m.title, m.description, m.image, m.video, m.duration, c.name as category FROM trending as t 
          LEFT JOIN modules as m ON t.module_id = m.id LEFT JOIN tags ON tags.module_id = m.id 
          LEFT JOIN category as c ON c.id = tags.cat_id`
        );
        // console.log(response);

        if (response == "") {
          	error1 = new Error("No data found...");
		    error1.statusCode = 400;
		    throw error1;
        } else {
          	return res.status(200).json({
            	isSuccess: true,
            	data: response,
          	});
        }
      }

      await main()
    }
  } 
  
  catch (error) {
    console.log("get trending error: ", error);
    next(error);
    // return res.status(500).json({
    //   isSuccess: false,
    //   message: "Failed try Again...",
    // });
  }
};

export const get_latest_module = async (req, res, next) => {
  try {
    const error = validationResult(req);

    let error1 = "";

	if (!error.isEmpty()) {
        const messages = error.array().map(err => err.msg).join(', '); // Join all error messages
	    const validationError = new Error(messages);
	    validationError.name = "ValidationError";
	    validationError.statusCode = 400;
	    validationError.oldInput = ""; // Attach oldInput to the error
	    throw validationError;
    }
    
    else {
      async function main() {
        const dbConnection = await dbConnectionPromise; // Wait for the promise to resolve

        // Now you can use dbConnection to execute queries
        const [response] = await dbConnection.query(
          `SELECT m.id AS module_id, m.title AS module_title, m.description AS module_description, m.image AS module_image, m.video AS module_video, 
          m.duration AS module_duration, c.name as category FROM modules as m
          LEFT JOIN tags ON tags.module_id = m.id
          LEFT JOIN category as c ON c.id = tags.cat_id ORDER BY m.id DESC LIMIT 5 OFFSET 0`
        );
        // console.log(response);

        if (response == "") {
          	error1 = new Error("No Data Found...");
		    error1.statusCode = 400;
		    throw error1;
        } else {
          return res.status(200).json({
            isSuccess: true,
            data: response,
          });
        }
      }

      await main();
    }
  } 
  
  catch (error) {
    console.log("get trending error: ", error);
    next(error);
    // return res.status(500).json({
    //   isSuccess: false,
    //   message: "Failed try Again...",
    // });
  }
};

export const get_all_modules = async (req, res, next) => {
  try {
    const error = validationResult(req);

    let error1 = "";

	  if (!error.isEmpty()) {
      const messages = error.array().map(err => err.msg).join(', '); // Join all error messages
	    const validationError = new Error(messages);
	    validationError.name = "ValidationError";
	    validationError.statusCode = 400;
	    validationError.oldInput = ""; // Attach oldInput to the error
	    throw validationError;
    }
    
    else {
      let itemsPerPage = parseInt(req.query.items) || 10;

      const page = parseInt(req.query.page) || 1;
      const offset = page > 1 ? (page - 1) * itemsPerPage : 0;

      // console.log(page, offset);

      async function main() {
        const dbConnection = await dbConnectionPromise; // Wait for the promise to resolve

        // Now you can use dbConnection to execute queries
        const [response] = await dbConnection.query(
          `SELECT m.id AS module_id, m.title AS module_title, m.description AS module_description, m.image AS module_image, m.video AS module_video, 
          m.duration AS module_duration, c.name as category 
          FROM modules as m LEFT JOIN tags ON tags.module_id = m.id 
          LEFT JOIN category as c ON c.id = tags.cat_id ORDER 
          BY m.id ASC LIMIT 10 OFFSET ${offset}`
        );
        
        // const [response] = await dbConnection.query(
        //   `SELECT * from modules LIMIT 10 OFFSET ${offset}`
        // );
        // console.log(response);

        if (response == "") {
          	error1 = new Error("No Data Found...");
		    error1.statusCode = 400;
		    throw error1;
        } else {
          return res.status(200).json({
            isSuccess: true,
            data: response,
          });
        }
      }

      await main();
    }
  } catch (error) {
    console.log("get all modules error: ", error);

    next(error);

    // return res.status(500).json({
    //   isSuccess: false,
    //   message: "Failed try Again...",
    // });
  }
};

export const get_modules_by_id = async (req, res, next) => {
  try {
    const error = validationResult(req);

    let error1 = "";

	if (!error.isEmpty()) {
        const messages = error.array().map(err => err.msg).join(', '); // Join all error messages
		const validationError = new Error(messages);
		validationError.name = "ValidationError";
		validationError.statusCode = 400;
		validationError.oldInput = ""; // Attach oldInput to the error
		throw validationError;
    }
    
    else {
      const { id } = req.params;
      const { name } = req.query;

      let itemsPerPage = parseInt(req.query.items) || 10;

      const page = parseInt(req.query.page) || 1;
      const offset = page > 1 ? (page - 1) * itemsPerPage : 0;

      // console.log(id, name, page, offset);

      async function main() {
        const dbConnection = await dbConnectionPromise; // Wait for the promise to resolve

          // query = `SELECT m.id, m.title, m.image AS module_image, m.video AS module_video,
          // 	m.duration AS module_duration, c.name AS category,
          // 	GROUP_CONCAT(l.title SEPARATOR ', ') AS lesson_titles,
          // 	GROUP_CONCAT(l.description SEPARATOR '; ') AS lesson_descriptions,
          // 	GROUP_CONCAT(l.image SEPARATOR ', ') AS lesson_images,
          // 	GROUP_CONCAT(l.video SEPARATOR ', ') AS lesson_videos,
          // 	GROUP_CONCAT(l.video_length SEPARATOR ', ') AS lesson_durations
          // 	FROM modules AS m LEFT JOIN category AS c ON c.id = m.category_id
          // 	LEFT JOIN lessons AS l ON l.module_id = m.id WHERE m.id = ${id}
          // 	GROUP BY m.id ORDER BY m.id ASC LIMIT 10 OFFSET ${offset}`;
          
          let query1 = `SELECT m.id AS module_id, m.title AS module_title, m.description AS module_description, m.image AS module_image, m.video AS module_video, 
            m.duration AS module_duration, c.name as category FROM modules as m 
            LEFT JOIN tags ON tags.module_id = m.id LEFT JOIN category as c ON c.id = tags.cat_id 
            WHERE m.id = ${id}`;

          let query2 = `SELECT id AS lesson_id, title AS lesson_title, 
                description AS lesson_description, image AS lesson_image, video AS lesson_video, 
                video_length AS lesson_video_length FROM lessons 
            WHERE module_id = ${id} LIMIT 10 OFFSET ${offset}`;
        
          let query3 = `SELECT COUNT(*) AS c FROM lessons WHERE module_id = ${id}`;

          const [response1, response2, response3] = await Promise.all([
            dbConnection.query(query1),
            dbConnection.query(query2),
            dbConnection.query(query3)
          ]);

          // console.log(response1[0], response2[0]);

          if (response1[0] == "" && response2[0] == "" && response3[0] == "") {
            // return res.json({
            //   isSuccess: false,
            //   module: [],
            //   lessons: [],
            //   lesson_count: '',
            //   id: id,
            //   name: name,
            //   message: "No Data Found...",
            // });

            error1 = new Error("No Data Found...");
		    error1.statusCode = 400;
		    error1.id = id;
		    error1.name = name;
		    error1.module = [];
		    error1.lessons = [];
		    error1.lesson_count = "";
		    throw error1;
          } 

          else {
            return res.status(200).json({
              isSuccess: true,
              data: {
                ...response1[0][0],
                lessons: response2[0],
                lesson_count: response3[0][0]?.c,
              },
              id: id,
              name: name
            });
          }
      }

      await main();
    }
  } 
  
  catch (error) {
    console.log("get modules by id error: ", error);

    next(error);

    // return res.status(500).json({
    //   isSuccess: false,
    //   message: "Failed try Again...",
    // });
  }
};

export const get_lesson_by_id = async (req, res, next) => {
  try {
    const error = validationResult(req);

    let error1 = "";

	if (!error.isEmpty()) {
        const messages = error.array().map(err => err.msg).join(', '); // Join all error messages
		const validationError = new Error(messages);
		validationError.name = "ValidationError";
		validationError.statusCode = 400;
		validationError.oldInput = ""; // Attach oldInput to the error
		throw validationError;
    }
    
    else {
      const { id } = req.params;
      const { name } = req.query;
      
      let itemsPerPage = parseInt(req.query.items) || 10;

      const page = parseInt(req.query.page) || 1;
      const offset = page > 1 ? (page - 1) * itemsPerPage : 0;
      
      async function main() {
        const dbConnection = await dbConnectionPromise;
        
        const [response] = await dbConnection.query(`SELECT id AS lesson_id, module_id, title AS lesson_title, 
                description AS lesson_description, image AS lesson_image, video AS lesson_video, 
                video_length AS lesson_video_length, created_at AS lesson_created_at
                FROM lessons WHERE id = ?`, [id]
        );
        
        if (response == "") {
          // return res.json({
          //     isSuccess: false,
          //     data: [],
          //     upNext: [],
          //     id: id,
          //     name: name,
          //     message: "No Data Found...",
          // });
          	error1 = new Error("No Data Found...");
		    error1.statusCode = 400;
		    error1.id = id;
		    error1.name = name;
		    error1.data = [];
		    error1.upNext = [];
		    throw error1;
        }
        
        else {
          // console.log(response[0]);
          const [response1] = await dbConnection.query(`SELECT id AS lesson_id, module_id, title AS lesson_title, 
                description AS lesson_description, image AS lesson_image, video AS lesson_video, 
                video_length AS lesson_video_length, created_at AS lesson_created_at
                FROM lessons WHERE module_id = ? AND id > ? LIMIT 10 OFFSET ?`, 
                [response[0].module_id, response[0].lesson_id, offset]);
          
          if (response1 == "") {
            return res.status(200).json({
              isSuccess: true,
              data: {
                ...response[0],
                upNext: [],
              },
              id: id,
              name: name
            });
          }
          
          else {
            return res.status(200).json({
              isSuccess: true,
              data: {
                ...response[0],
                upNext: response1
              },
              id: id,
              name: name
            });
          }
        }
      }
      
      await main();
    }
  }
  
  catch (error) {
    console.log("get lesson by id error: ", error);
    next(error);

    // return res.status(500).json({
    //   isSuccess: false,
    //   message: "Failed try Again...",
    // });
  }
}

export const get_search_data = async (req, res, next) => {
  try {
    const error = validationResult(req);

    let error1 = "";

	if (!error.isEmpty()) {
        const messages = error.array().map(err => err.msg).join(', '); // Join all error messages
	    const validationError = new Error(messages);
	    validationError.name = "ValidationError";
	    validationError.statusCode = 400;
	    validationError.oldInput = ""; // Attach oldInput to the error
	    throw validationError;
    } 
    
    else {
      let itemsPerPage = parseInt(req.query.items) || 10;

      const page = parseInt(req.query.page) || 1;
      const offset = page > 1 ? (page - 1) * itemsPerPage : 0;

      const term = req.query.term ? req.query.term : "null";
      const year = req.query.year ? req.query.year : "null";
      const month = req.query.month ? req.query.month : "null";

      // console.log("term: ", term, " year: ", year, " month: ", month);

      async function main() {
        const dbConnection = await dbConnectionPromise;
        
        const query1 = `SELECT m.id AS module_id, m.title AS module_title, m.description AS module_description, m.image AS module_image, m.video AS module_video, 
            m.duration AS module_duration FROM modules as m WHERE m.title LIKE '%${term}%' LIMIT 10 OFFSET ${offset}`;
        
        const query2 = `SELECT id AS lesson_id, title AS lesson_title, 
                description AS lesson_description, image AS lesson_image, video AS lesson_video, 
                video_length AS lesson_video_length FROM lessons WHERE title LIKE '%${term}%' UNION 
          SELECT id AS lesson_id, title AS lesson_title, 
                description AS lesson_description, image AS lesson_image, video AS lesson_video, 
                video_length AS lesson_video_length FROM lessons WHERE description LIKE '%${term}%' UNION 
          SELECT id AS lesson_id, title AS lesson_title, 
                description AS lesson_description, image AS lesson_image, video AS lesson_video, 
                video_length AS lesson_video_length FROM lessons WHERE YEAR(created_at) = ${year} UNION 
          SELECT id AS lesson_id, title AS lesson_title, 
                description AS lesson_description, image AS lesson_image, video AS lesson_video, 
                video_length AS lesson_video_length FROM lessons WHERE MONTH(created_at) = ${month} 
          LIMIT 10 OFFSET ${offset}`;

        // console.log(query);

        const [response1, response2] = await Promise.all([
          dbConnection.query(query1),
          dbConnection.query(query2)
        ])

        // console.log(response1[0], response2[0]);

        if (response1[0] == "" && response2[0] == "") {
          // return res.json({
          //   isSuccess: false,
          //   module: "",
          //   lesson: "",
          //   dataModule: [],
          //   dataLesson: [],
          //   term: term,
          //   year: year,
          //   month: month,
          //   message: "No Data Found...",
          // });
          	error1 = new Error("No Data Found...");
		    error1.statusCode = 400;
		    error1.module = "";
		    error1.lesson = "";
		    error1.dataModule = [];
		    error1.dataLesson = [];
		    error1.term = term;
		    error1.year = year;
		    error1.month = month;
		    throw error1;
        } 
        
        else if (response1[0] !== "" && response2[0] !== "") {
          return res.status(200).json({
            isSuccess: true,
            module: response1[0].length > 0,
            lesson: response2[0].length > 0,
            dataModule: response1[0].length > 0 ? response1[0] : [],
            dataLesson: response2[0].length > 0 ? response2[0] : [],
            term: term,
            year: year,
            month: month
          })
        }
        
        else {
          return res.status(200).json({
            isSuccess: true,
            module: response1[0].length > 0,
            lesson: response2[0].length > 0,
            dataModule: response1[0].length > 0 ? response1[0] : [],
            dataLesson: response2[0].length > 0 ? response2[0] : [],
            term: term,
            year: year,
            month: month
          });
        }
      }

      await main();
    }
  } 
  
  catch (error) {
    console.log("get search data: ", error);

    next(error);

    // return res.status(500).json({
    //   isSuccess: false,
    //   message: "Failed try Again...",
    // });
  }
};

export const get_home_data = async (req, res, next) => {
  try {
    const error = validationResult(req);

    let error1 = "";

	  if (!error.isEmpty()) {
      const messages = error.array().map(err => err.msg).join(', '); // Join all error messages
	    const validationError = new Error(messages);
	    validationError.name = "ValidationError";
	    validationError.statusCode = 400;
	    validationError.oldInput = ""; // Attach oldInput to the error
	    throw validationError;
    } 
    
    else {
      let itemsPerPage = parseInt(req.query.items) || 10;

      const page = parseInt(req.query.page) || 1;
      const offset = page > 1 ? (page - 1) * itemsPerPage : 0;

      async function main() {
        const dbConnection = await dbConnectionPromise;

        const [response] = await dbConnection.query(`SELECT m.id AS module_id, m.title AS module_title, m.description AS module_description, m.image AS module_image 
          FROM modules AS m ORDER BY m.id LIMIT 10 OFFSET ${offset}`);

        // console.log(response[0], response1[0]);
        
        if (response[0] == "") {
          	error1 = new Error("No Data Found...");
		    error1.statusCode = 400;
		    throw error1;
        } 
        
        else {          
          const lessons_data = await Promise.all(response.map(async (i) => {
              const [rows] = await dbConnection.query(`
                  SELECT 
                      id AS lesson_id, 
                      module_id AS mid, 
                      image AS lesson_image,
                      COUNT(*) OVER() AS lesson_count 
                  FROM lessons 
                  WHERE module_id = ? 
                  LIMIT 10 OFFSET 0
              `, [i.module_id]);  // Destructure rows from the result

              return rows; // Return the actual data (rows)
          }));
          
          // console.log(lessons_data);
          
          const mergedData = response.map(module => {
            // Find the reply data corresponding to the comment_id
            const lessons = lessons_data.find((lessonGroup) => {
                if (lessonGroup.length > 0) {
                    return lessonGroup[0].mid === module.module_id;
                }
                return false;
            }) || [];

            return {
              ...module,
              lessons: lessons.map(lesson => {
                const { lesson_id, mid, lesson_image } = lesson; // Exclude lesson_count
                return {
                  lesson_id, mid, lesson_image
                }; // Return the lesson without lesson_count
              }),
              lesson_count: lessons[0]?.lesson_count
            };
          });

          // console.log(mergedData);
          
          if (mergedData == "") {
            error1 = new Error("No Data Found...");
		    error1.statusCode = 400;
		    throw error1;
          }
          
          else {
            return res.status(200).json({
              isSuccess: true,
              data: mergedData
            });
          }
        }
      }
      
      await main();
    }
  }
  
  catch (error) {
    console.log("get home data: ", error);
    next(error);

    // return res.status(500).json({
    //   isSuccess: false,
    //   message: "Failed try Again...",
    // });
  }
}

export const post_comment = async (req, res, next) => {
  try {
    const error = validationResult(req);
    
    const { user_id, lesson_id, text } = req.body;

    let error1 = "";

	if (!error.isEmpty()) {
        const messages = error.array().map(err => err.msg).join(', '); // Join all error messages
	    const validationError = new Error(messages);
	    validationError.name = "ValidationError";
	    validationError.statusCode = 400;
	    validationError.oldInput = { text: text }; // Attach oldInput to the error
	    throw validationError;
    }
    
    else {      
      let itemsPerPage = parseInt(req.query.items) || 10;

      const page = parseInt(req.query.page) || 1;
      const offset = page > 1 ? (page - 1) * itemsPerPage : 0;
      
      const createdAt = moment.tz('Europe/Madrid').format('YY-MM-DD HH-mm-ss');
      
      async function main() {
        const dbConnection = await dbConnectionPromise;
        
        const [response] = await dbConnection.query(`INSERT INTO comments (user_id, lesson_id, title, likes, dislikes, date) VALUES (?,?,?,?,?,?)`, 
          [user_id, lesson_id, text, 0, 0, createdAt]);
        
        if (response == "") {
          	error1 = new Error("Failed to add comment...");
		    error1.statusCode = 400;
		    throw error1;
        }
        
        else {
          return res.status(200).json({
            isSuccess: true,
            comment_id: response.insertId
          });
        }
      }
      
      await main();
    }
  }
  
  catch (error) {
    console.log("post comment error: ", error);

    next(error);
  }
}

export const comment_like_dislike = async (req, res, next) => {
  try {
    const error = validationResult(req);

    let error1 = "";

	if (!error.isEmpty()) {
        const messages = error.array().map(err => err.msg).join(', '); // Join all error messages
	    const validationError = new Error(messages);
	    validationError.name = "ValidationError";
	    validationError.statusCode = 400;
	    validationError.oldInput = ""; // Attach oldInput to the error
	    throw validationError;
    }
    
    else {
      const { user_id, comment_id } = req.body;
      const value = parseInt(req.body.value);
      
      // console.log(req.body);
      
      async function main() {
        const dbConnection = await dbConnectionPromise;
        
        let query = "";
        
        if (value == 0) { // +1 like
          query = "update comments set likes=likes+1 where user_id = ? AND id = ?";
        }
        
        else if (value == 1) { // -1 like
          query = "update comments set likes=likes-1 where user_id = ? AND id = ?";
        }

        else if (value == 2) { // +1 dislike
          query = "update comments set dislikes=dislikes+1 where user_id = ? AND id = ?";
        }

        else if (value == 3) { // -1 dislike
          query = "update comments set dislikes=dislikes-1 where user_id = ? AND id = ?";
        }

        else if (value == 4) { // +1 like, -1 dislike
          query = "update comments set likes=likes+1, dislikes=dislikes-1 where user_id = ? AND id = ?";
        }

        else if (value == 5) { // -1 like, +1 dislike
          query = "update comments set dislikes=dislikes+1, likes=likes-1 where user_id = ? AND id = ?";
        }

        else {
          	error1 = new Error("Failed try Again...");
			error1.statusCode = 500;
			throw error1;
        }
        
        const [response] = await dbConnection.query(query, [user_id, comment_id]);
        
        if (response == "") {
          	error1 = new Error("Failed");
			error1.statusCode = 400;
			error1.user_id = user_id;
			error1.comment_id = comment_id;
			throw error1;
        }
        
        else {
          return res.status(200).json({
              isSuccess: true,
              message: "success",
              user_id, 
              comment_id
          });
        }
      }
      
      await main();
    }
  }
  
  catch (error) {
    console.log("post comment error: ", error);

    next(error);

    // return res.status(500).json({
    //   isSuccess: false,
    //   message: "Failed try Again...",
    // });
  }
}

export const get_lesson_comments = async (req, res, next) => {
  try {
    const error = validationResult(req);

    let error1 = "";

	if (!error.isEmpty()) {
        const messages = error.array().map(err => err.msg).join(', '); // Join all error messages
	    const validationError = new Error(messages);
	    validationError.name = "ValidationError";
	    validationError.statusCode = 400;
	    validationError.oldInput = ""; // Attach oldInput to the error
	    throw validationError;
    }
    
    else {
      const { lesson_id } = req.params;
      let itemsPerPage = parseInt(req.query.items) || 10;
      let itemsPerPage2 = parseInt(req.query.items2) || 10;

      const page = parseInt(req.query.page) || 1;
      const page2 = parseInt(req.query.page2) || 1;
      
      const offset = page > 1 ? (page - 1) * itemsPerPage : 0;
      const offset2 = page2 > 1 ? (page2 - 1) * itemsPerPage2 : 0;
      
      async function main() {
        const dbConnection = await dbConnectionPromise;
        
        const [response] = await dbConnection.query(`SELECT comments.id AS comment_id, comments.title, comments.likes, comments.dislikes, 
          comments.date, users.name, users.image, comments.lesson_id FROM comments INNER JOIN users ON users.id = comments.user_id 
          WHERE comments.lesson_id = ? ORDER BY comments.date DESC LIMIT 10 OFFSET ?`, [lesson_id, offset]);
        
        if (response == "") {
          	error1 = new Error("No comment found...");
		   	error1.statusCode = 400;
		   	error1.comment = [];
		    throw error1;
        } 
        
        else {          
          // console.log(response, response[0].comment_id);
          
          const reply_data = await Promise.all(response.map(async (i) => {
              const [rows] = await dbConnection.query(`
                  SELECT r.id, r.comment_id, r.title, u.name, u.image FROM replies AS r 
                  INNER JOIN users AS u ON u.id = r.user_id WHERE comment_id = ? LIMIT 10 OFFSET ?
              `, [i.comment_id, offset2]);  // Destructure rows from the result

              return rows; // Return the actual data (rows)
          }));
          
          // console.log(reply_data);
          
          const mergedData = response.map(comment => {
            // Find the reply data corresponding to the comment_id
            const reply = reply_data.find((replyGroup) => {
                if (replyGroup.length > 0) {
                    return replyGroup[0].comment_id === comment.comment_id;
                }
                return false;
            }) || [];

            return {
                ...comment,
                reply: reply
            };
        });
          
          // console.log(mergedData);
          
          if (mergedData == "") {
            error1 = new Error("No reply found...");
		   	error1.statusCode = 400;
		   	error1.comment = [];
		    throw error1;
          }
          
          else {
            return res.status(200).json({
              isSuccess: true,
              comment: mergedData
            });
          }
        }
      }
      
      await main();
    }
  }
  
  catch (error) {
    console.log("get lesson comments data: ", error);

    next(error);

    // return res.status(500).json({
    //   isSuccess: false,
    //   message: "Failed try Again...",
    // });
  }
}

export const post_reply = async (req, res, next) => {
  try {
    const error = validationResult(req);
    
    const { user_id, comment_id, text } = req.body;

    let error1 = "";

	  if (!error.isEmpty()) {
      const messages = error.array().map(err => err.msg).join(', '); // Join all error messages
  		const validationError = new Error(messages);
  		validationError.name = "ValidationError";
  		validationError.statusCode = 400;
  		validationError.oldInput = { text: text }; // Attach oldInput to the error
  		throw validationError;
    }
    
    else {      
      let itemsPerPage = parseInt(req.query.items) || 10;

      const page = parseInt(req.query.page) || 1;
      const offset = page > 1 ? (page - 1) * itemsPerPage : 0;
      
      const createdAt = moment.tz('Europe/Madrid').format('YY-MM-DD HH-mm-ss');
      
      async function main() {
        const dbConnection = await dbConnectionPromise;
        
        const [response] = await dbConnection.query(`INSERT INTO replies (user_id, comment_id, title, likes, dislikes, date) VALUES (?,?,?,?,?,?)`, 
          [user_id, comment_id, text, 0, 0, createdAt]);
        
        if (response == "") {
          	error1 = new Error("Failed to add reply...");
		    error1.statusCode = 400;
		    throw error1;
        }
        
        else {
          return res.status(200).json({
            isSuccess: true,
            reply_id: response.insertId
          });
        }
      }
      
      await main();
    }
  }
  
  catch (error) {
    console.log("post reply error: ", error);

    next(error);
    
    // return res.status(500).json({
    //   isSuccess: false,
    //   message: "Failed try Again...",
    // });
  }
}

export const reply_like_dislike = async (req, res, next) => {
  try {
    const error = validationResult(req);

    let error1 = "";

	  if (!error.isEmpty()) {
        const messages = error.array().map(err => err.msg).join(', '); // Join all error messages
	    const validationError = new Error(messages);
	    validationError.name = "ValidationError";
	    validationError.statusCode = 400;
	    validationError.oldInput = ""; // Attach oldInput to the error
	    throw validationError;
    }
    
    else {
      const { user_id, comment_id } = req.body;
      const value = parseInt(req.body.value);
      
      // console.log(req.body);
      
      async function main() {
        const dbConnection = await dbConnectionPromise;
        
        let query = "";
        
        if (value == 0) { // +1 like
          query = "update replies set likes=likes+1 where user_id = ? AND comment_id = ?";
        }
        
        else if (value == 1) { // -1 like
          query = "update replies set likes=likes-1 where user_id = ? AND comment_id = ?";
        }

        else if (value == 2) { // +1 dislike
          query = "update replies set dislikes=dislikes+1 where user_id = ? AND comment_id = ?";
        }

        else if (value == 3) { // -1 dislike
          query = "update replies set dislikes=dislikes-1 where user_id = ? AND comment_id = ?";
        }

        else if (value == 4) { // +1 like, -1 dislike
          query = "update replies set likes=likes+1, dislikes=dislikes-1 where user_id = ? AND comment_id = ?";
        }

        else if (value == 5) { // -1 like, +1 dislike
          query = "update replies set dislikes=dislikes+1, likes=likes-1 where user_id = ? AND comment_id = ?";
        }

        else {
          	error1 = new Error("Failed try Again...");
		    error1.statusCode = 500;
		    throw error1;
        }
        
        const [response] = await dbConnection.query(query, [user_id, comment_id]);
        
        if (response == "") {
          	error1 = new Error("Failed");
		    error1.statusCode = 400;
		    error1.user_id = user_id;
		    error1.comment_id = comment_id;
		    throw error1;
        }
        
        else {
          return res.status(200).json({
              isSuccess: true,
              message: "success",
              user_id, 
              comment_id
          });
        }
      }
      
      await main();
    }
  }
  
  catch (error) {
    console.log("reply like dislike error: ", error);

    next(error);

    // return res.status(500).json({
    //   isSuccess: false,
    //   message: "Failed try Again...",
    // });
  }
}

export const get_users_details = async (req, res, next) => {
  try {
    const error = validationResult(req);
    
    // console.log(req.params.rem_token);

    let error1 = "";

	  if (!error.isEmpty()) {
      const messages = error.array().map(err => err.msg).join(', '); // Join all error messages
  		const validationError = new Error(messages);
  		validationError.name = "ValidationError";
  		validationError.statusCode = 400;
  		validationError.oldInput = ""; // Attach oldInput to the error
  		throw validationError;
    }
    
    else {
      const { rem_token } = req.params;
      
      async function main() {
        const dbConnection = await dbConnectionPromise; // Wait for the promise to resolve

        // Now you can use dbConnection to execute queries
        const [response] = await dbConnection.query(
          "SELECT id, email, name, image, created_at FROM users WHERE rem_token = ?", [rem_token]
        );
        // console.log(response);

        if (response == "") {
          error1 = new Error("No data found...");
  		    error1.statusCode = 400;
  		    throw error1;
        } else {
          return res.status(200).json({
            isSuccess: true,
            data: response[0],
          });
        }
      }

      await main();
    }
  } 
  
  catch (error) {
    console.log("get user by id error: ", error);
    next(error);
    // return res.status(500).json({
    //   isSuccess: false,
    //   message: "Failed try Again...",
    // });
  }
}

// subscriptions api

export const post_subscription_home = async (req, res, next) => {
  try {
    const error = validationResult(req);
    
    const email = req.body.email !== '' ? req.body.email.toLowerCase() : req.body.email;

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
      const customer = await stripe.customers.list({
        email: email
      });
      const customerId = customer.data[0]?.id;
      // console.log(customerId, !customerId);

      if (!customerId) {
        error1 = new Error("No customer found with this email");
        error1.statusCode = 400;
        throw error1;
      } 

      else {
        const subscriptions = await stripe.subscriptions.list({
          customer: customerId,
          status: "all",
        });
        
        const cancelPromises = subscriptions.data
          .filter(
            (i) => i.status !== "canceled" && i.status !== "active" && i.status !== "paused"
          )
          .map((i) =>
            stripe.subscriptions.cancel(i.id)
              .then(() => {
                console.log(`Subscription ${i.id} with status ${i.status} has been canceled.`);
                return true; // Return a value to track success
              })
              .catch((error) => {
                console.error(`Failed to cancel subscription ${i.id}:`, error.message);
                return false; // Return a value to track failure
              })
          );

        const results = await Promise.allSettled(cancelPromises);

        return res.status(200).json({
          isSuccess: true
        });

        // Handle results
        // results.forEach((result, index) => {
        //   if (result.status === 'fulfilled' && result.value === true) {
        //     console.log(`Subscription ${subscriptions.data[index].id} canceled successfully.`);
        //   } else if (result.status === 'rejected') {
        //     console.error(`Failed to cancel subscription ${subscriptions.data[index].id}:`, result.reason);
        //   } else if (result.status === 'fulfilled' && result.value === false) {
        //     console.error(`Failed to cancel subscription ${subscriptions.data[index].id}.`);
        //   }
        // });

      }
    }
  }

  catch (error) {
    console.log("get subscriptions home error: ", error);

    next(error);
  }
}

export const post_subscription_plan = async (req, res, next) => {
  try {
    const error = validationResult(req);
    
    const email = req.body.email !== '' ? req.body.email.toLowerCase() : req.body.email;

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
      const customer = await stripe.customers.list({
        email: email
      });
      const customerId = customer.data[0]?.id;

      if (!customerId) {
        error1 = new Error("No customer found with this email")
        error1.statusCode = 400;
        throw error1;
      }

      else {
        const products = await stripe.products.list({
          active: true,
        });

        // console.log(products.data);

        const prices = await stripe.prices.list({
          active: true,
        });

        // console.log(prices.data);

        const plans = products.data
          .map((product, index) => {
            const matchingPrice = prices.data.find(
              (price) => price.id === product.default_price
            );
            return {
              // product_id: product.id,
              // price_id: matchingPrice.id,
              id: index + 1,
              name: product?.name,
              description: product?.description,
              amount: matchingPrice?.unit_amount_decimal,
              interval: matchingPrice?.recurring.interval,
              interval_count: matchingPrice?.recurring.interval_count,
            };
          })
          .reverse();

        if (!plans) {
          error1 = new Error("Sorry there has been a issue....... Kindly refresh the page");
          error1.statusCode = 400;
          throw error1;
        }

        else {
          return res.status(200).json({
            isSuccess: true,
            plans
          });
        }
      }
    }
  }

  catch (error) {
    console.log("get subscription plans error...");

    next(error);
  }
}

export const post_subscription = async (req, res, next) => {
  try {
    const error = validationResult(req);
    
    const email = req.body.email !== '' ? req.body.email.toLowerCase() : req.body.email;
    const { plan } = req.body;

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
      const customer = await stripe.customers.list({
        email: email
      });
      const customerId = customer.data[0]?.id;

      // console.log(customerId, req.cookies._prod_email);

      if (!customerId) {
        error1 = new Error("No customer found with this email");
        error1.statusCode = 400;
        throw error1;
      } 

      else {
        let priceID;

        switch (plan.toLowerCase()) {
          case "starter":
            priceID = "price_1QfcQQFKDWRw6RCINFPnbZ5Y";
            break;
          case "pro":
            priceID = "price_1QfcRSFKDWRw6RCIljG1GDI5";
            break;
          case "premium":
            priceID = "price_1QfhR0FKDWRw6RCI0v9MXT25";
          break;
          default:
            error1 = new Error(`Invalid plan: ${plan}.`);
            error1.statusCode = 400;
            throw error1;
        }
      
        const subscriptions = await stripe.subscriptions.list({
          customer: customerId,
          status: 'active',
        });

        // const alreadySubscribed = subscriptions.data.some((sub) =>
        //   sub.items.data.some((item) => item.price.id == priceID)
        // )
        
        // console.log(subscriptions.data[0].items);
        // console.log("already subscribed: ", alreadySubscribed);
        
        if (subscriptions.data.length >= 1) {
          return res.status(200).json({
            isSuccess: true
          })
        }
      
        else {
          const session = await stripe.checkout.sessions.create({
              mode: "subscription",
              payment_method_types: ["card"],
              customer: customerId,
              line_items: [
                {
                  price: priceID,
                  quantity: 1,
                },
              ],
              // subscription_data: {
              //   trial_period_days: 7,
              // },
              success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
              cancel_url: `${process.env.BASE_URL}/cancel`,
          });

          // console.log(session?.url);

          return res.status(200).json({
            isSuccess: true,
            url: session?.url
          });

          // return res.redirect(session.url);
        }
      }
    }
  }

  catch (error) {
    console.log("post subscription error: ", error);

    next(error);
  }
}

export const post_customer_billing_session = async (req, res, next) => {
  try {
    const email = req.body.email !== '' ? req.body.email.toLowerCase() : req.body.email;

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
      const customer = await stripe.customers.list({
        email: email,
      });
      const customerId = customer.data[0]?.id;

      // console.log(customerId, req.cookies._prod_email);

      if (!customerId) {
        error1 = new Error("No customer found with this email");
        error1.statusCode = 400;
        throw error1;
      } 

      else {
        const portalSession = await stripe.billingPortal.sessions.create({
          customer: customerId,
          return_url: `${process.env.BASE_URL}/success`,
        });

        // console.log(portalSession?.url);

        return res.status(200).json({
          isSuccess: true,
          url: portalSession?.url
        });
      }
    }
  }

  catch (error) {
    console.log("get customer billing portal error: ", error);

    next(error);
  }
}

export const get_user_subscriptions = async (req, res, next) => {
  try {
    const email = req.body.email !== '' ? req.body.email.toLowerCase() : req.body.email;

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
      const customer = await stripe.customers.list({
        email: email
      });
      const customerId = customer.data[0]?.id;

      // console.log(customerId, email);

      if (!customerId) {
        error1 = new Error("No customer found with this email");
        error1.statusCode = 400;
        throw error1;
      } 

      else {
        const subscriptions = await stripe.subscriptions.list({
          customer: customerId,
          status: "all",
        });

        // console.log(subscriptions);

        if (subscriptions?.data.length >= 1) {
          const subscriptionDetailsPromises = subscriptions.data.map(
            async (subscription) => {
              // console.log(subscription.status);
              // Check if the subscription status is not 'canceled'
              if (subscription.status !== "canceled" 
                  && subscription.status !== "incomplete" 
                  && subscription.status !== "incomplete_expired"
              ) {
                  // Process the items of the subscription if it's not canceled
                  const itemDetailsPromises = subscription.items.data.map(
                    async (item) => {
                      const productId = item.plan.product;

                      // Fetch the product and its associated prices concurrently
                      const [product, prices] = await Promise.allSettled([
                        stripe.products.retrieve(productId),
                        stripe.prices.list({ product: productId }), // Get all prices for the product
                      ]);

                      // Step 4: Find the matching price by comparing with the product's default price
                      const matchingPrice = prices.data.find(
                        (price) => price.id === product.default_price
                      );

                      // Step 5: Return the details for the subscription item if a match is found
                      if (matchingPrice) {
                        return {
                          subscription_id: subscription.id,
                          subscription_status: subscription.status,
                          product_name: product?.name,
                          product_description: product?.description,
                          amount: matchingPrice?.unit_amount_decimal, // Price in decimal format
                          interval: matchingPrice?.recurring?.interval, // Recurring billing interval (if applicable)
                          interval_count: matchingPrice?.recurring?.interval_count, // Interval count (if applicable)
                        };
                      } else {
                        return null; // Handle case where no matching price is found
                      }
                    }
                  );

                  // Filter out null values if no matching price is found for any item
                  const validItemDetails = (
                    await Promise.allSettled(itemDetailsPromises)
                  ).filter((item) => item !== null);

                  // console.log(validItemDetails);

                  return {
                    subscription_id: subscription.id,
                    subscription_status: subscription.status,
                    product_name: validItemDetails[0].product_name,
                    product_description: validItemDetails[0].product_description,
                    amount: validItemDetails[0].amount,
                    interval: validItemDetails[0].interval,
                    interval_count: validItemDetails[0].interval_count,
                  };
                } 
              else {
                // Return null or an empty object if subscription is canceled
                return null;
              }
            }
          );

          // Step 6: Wait for all subscription details to resolve
          const allSubscriptionDetails = (
            await Promise.allSettled(subscriptionDetailsPromises)
          ).filter((subscription) => subscription !== null);

          // Flatten the array (because we have an array of arrays)
          const flatSubscriptionDetails = allSubscriptionDetails.flat();

          // console.log(flatSubscriptionDetails);

          // Step 7: Log the subscription details or process further
          // flatSubscriptionDetails.forEach(details => {
          //   console.log('Subscription Item Details:', details);
          // });

          if (flatSubscriptionDetails.length >= 1) {
            return res.status(200).json({
              isSuccess: true,
              plans: flatSubscriptionDetails
            })
          } else {
            error1 = new Error("No Active Plan found. Please buy some plan to continue enjoy watching...");
            error1.statusCode = 400;
            throw error1;
          }
        } else {
          error1 = new Error("No Active Plan found. Please buy some plan to continue enjoy watching...");
          error1.statusCode = 400;
          throw error1;
        }
      }
    }
  }

  catch (error) {
    console.log("post user subscriptions error: ", error);

    next(error);
  }
}

export const cancel_subscription = async (req, res, next) => {
  try {
    const { subscription_id } = req.body;

    const email = req.body.email !== '' ? req.body.email.toLowerCase() : req.body.email;

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
      const customer = await stripe.customers.list({
        email: email,
      });
      const customerId = customer.data[0]?.id;

      // console.log(customerId, req.cookies._prod_email, s_id);

      if (!customerId && !subscription_id) {
        error1 = new Error("No customer found with this email");
        error1.statusCode = 400;
        throw error1;
      } 

      else {
        const subscription = await stripe.subscriptions.cancel(subscription_id);

        // console.log(subscription);

        if (!subscription) {
          error1 = new Error("Failed to cancel subscription. Try Again...");
          error1.statusCode = 400;
          throw error1;
        }

        else {
          return res.status(200).json({
            isSuccess: true
          })
        }
      }
    }
  }

  catch (error) {
    console.log("get cancel subscription error: ", error);

    next(error);
  }
}

export const resume_subscription = async (req, res, next) => {
  try {
    const email = req.body.email !== '' ? req.body.email.toLowerCase() : req.body.email;

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
      const customer = await stripe.customers.list({
        email: email
      });
      const customerId = customer.data[0]?.id;
      // console.log(m, customerId);

      if (!customerId) {
        error1 = new Error("No customer found with this email");
        error1.statusCode = 400;
        throw error1;
      } 

      else {
        const subscriptions = await stripe.subscriptions.list({
          customer: customerId,
          status: "all",
        });
        
        const avaiableSubscriptions = subscriptions.data ? subscriptions.data
                  .filter(i => i.status !== "canceled" && i.status !== "unpaid" && i.status !== "incomplete" && i.status !== "incomplete_expired" && i.status !== "trialing")
                  .map(i => i) : '';
        // console.log(avaiableSubscriptions);
        
        if (avaiableSubscriptions.length >= 1) {
          const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${process.env.BASE_URL}/api/v1/users/subscriptions`,
          });

          return res.status(200).json({
            isSuccess: true,
            url: session?.url
          });
        }
        else {
          error1 = new Error("No Subscription found...");
          error1.statusCode = 400;
          throw error1;
        }
      }
    }
  }

  catch (error) {
    console.log("get resume subscription error: ", error);

    next(error);
  }
}

export const get_subscription_status = async (req, res, next) => {
  try {
    const email = req.body.email !== '' ? req.body.email.toLowerCase() : req.body.email;

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
      const customer = await stripe.customers.list({
        email: email
      });
      const customerId = customer.data[0]?.id;

      // console.log(customerId, req.cookies._prod_email);

      if (!customerId) {
        error1 = new Error("No customer found with this email");
        error1.statusCode = 400;
        throw error1;
      } 

      else {
        const subscriptions = await stripe.subscriptions.list({
          customer: customerId,
          status: "all",
        });

        // console.log(subscriptions?.data);

        if (subscriptions?.data && subscriptions?.data.length >= 1) {
            const isTrial = subscriptions?.data
              .filter((i) => i.status === "trialing" || i.status === "active" 
                    || i.status === "canceled" || i.status === "past_due"
                      || i.status === "incomplete" || i.status === "incomplete_expired"
                    || i.status === "unpaid" || i.status === "paused")
              .map((i) => ({ status: i.status, id: i.id, data: i.items.data}));

            // console.log(isTrial);

            if (isTrial) {
              const activeOrTrialing = isTrial.some(sub => sub.status === 'active' || sub.status === 'trialing');

              // Find the first active or trialing subscription to get its details
              const activeSub = isTrial.find(sub => sub.status === 'active' || sub.status === 'trialing');

              // console.log(activeOrTrialing, activeSub);
              return res.status(200).json({
                "isCustomerExist": true,
                "isSubActive": activeOrTrialing,
                "start_date": activeSub.data[0].current_period_start,
                "end_date": activeSub.data[0].current_period_end,
                "subId": activeSub.id
              })
            }

            else {
              return res.status(200).json({
                "isCustomerExist": true,
                "isSubActive": false
              })
            }
        }

        else {
          return res.status(200).json({
            "isCustomerExist": true,
            "isSubActive": false
          })
        }
      }
    }
  }

  catch (error) {
    console.log("get subscription status error: ", error);

    next(error);
  }
}

// const createdAt = moment.tz('Europe/Madrid').format('YY-MM-DD HH-mm-ss');
        
        // console.log(createdAt);

	    	// const endDate = moment(createdAt, "YY-MM-DD HH-mm-ss");
	    	// const startDate = moment("25-02-16 07-50-48", "YY-MM-DD HH-mm-ss");

        // Calculate the difference in milliseconds
        // const diffInMilliseconds = endDate.diff(startDate);

        // const diffInHours = endDate.diff(startDate, 'hours');

        // Calculate the difference in minutes
        // const diffInMinutes = endDate.diff(startDate, 'minutes');

        // Calculate the difference in seconds
        // const diffInSeconds = endDate.diff(startDate, 'seconds');

        // console.log("Difference in milliseconds: " + diffInMilliseconds);
        // console.log("Difference in hours: " + diffInHours);
        // console.log("Difference in minutes: " + diffInMinutes);
        // console.log("Difference in seconds: " + diffInSeconds);
        
//         const days = Math.floor(diffInSeconds / (3600 * 24));
//         const hours = Math.floor(diffInSeconds / 3600);
//         const minutes = Math.floor(diffInSeconds / 60);
//         const seconds = diffInSeconds % 60;

//         console.log("Time difference: " + days + " days and " + hours + " hours and " + minutes 
//                     + " minutes and " + seconds + " seconds");