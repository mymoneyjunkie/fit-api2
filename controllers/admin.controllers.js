import io from "../config/socket.js";

import { body, param, validationResult } from "express-validator";

import moment from "moment-timezone";

import dbConnectionPromise from "../config/db.js";

export const home_get = async (req, res, next) => {
  try {
    async function main() {
      let error1 = "";

      const dbConnection = await dbConnectionPromise;

      const [response1, response2, response3] = await Promise.allSettled([
        await dbConnection.query("SELECT COUNT(*) as cat_count from category"),
        await dbConnection.query(
          "SELECT COUNT(*) as module_count from modules"
        ),
        await dbConnection.query(
          "SELECT COUNT(*) as lesson_count from lessons"
        ),
      ]);

      // console.log(response1[0]);

      if (response1[0] == "" && response2[0] == "" && response3[0] == "") {
        // return res.json({
        //   isSuccess: false,
        //   message: "Failed try again",
        // });
        error1 = new Error("Failed try again");
        error1.statusCode = 400;
        throw error1;
      } 

      else {
        return res.status(200).json({
          isSuccess: true,
          cat_count: response1[0][0]?.cat_count || 0,
          module_count: response2[0][0]?.module_count || 0,
          lesson_count: response3[0][0]?.lesson_count || 0,
        });
      }
    }

    await main();
  } 

  catch (error) {
    console.log("get home error: ", error);

    next(error);
  }
};

export const categories_get = async (req, res, next) => {
  try {
    async function main() {
      let error1 = "";

      const dbConnection = await dbConnectionPromise; // Wait for the promise to resolve

      // Now you can use dbConnection to execute queries
      const [response] = await dbConnection.query("SELECT * FROM category");
      // console.log(response);

      if (response == "") {
        // return res.json({
        //   isSuccess: false,
        //   data: [],
        // });

        error1 = new Error("Failed try again...");
        error1.statusCode = 400;
        throw error1;;
      } 

      else {
        return res.status(200).json({
          isSuccess: true,
          data: response,
        });
      }
    }

    await main();
  } 

  catch (error) {
    console.log("get category error: ", error);

    next(error);
  }
};

export const categories_post = async (req, res, next) => {
  try {
    // console.log(req.body);

    const { name } = req.body;

    const error = validationResult(req);

    let error1 = "";

    if (!error.isEmpty()) {
      const messages = error.array().map(err => err.msg).join(', '); // Join all error messages
      const validationError = new Error(messages);
      validationError.name = "ValidationError";
      validationError.statusCode = 400;
      validationError.oldInput = { name: name }; // Attach oldInput to the error
      throw validationError;
    } 

    else {
      async function main() {
        const dbConnection = await dbConnectionPromise; // Wait for the promise to resolve

        // Now you can use dbConnection to execute queries
        const [response] = await dbConnection.query(
          "SELECT * FROM category WHERE name = ?",
          [name]
        );
        // console.log(response);

        if (response != "") {
          // return res.json({
          //   isSuccess: false,
          //   message: "Category already found. Please insert a new one...",
          // });
          error1 = new Error("Category already found. Please insert a new one...");
          error1.statusCode = 400;
          throw error1;
        } 

        else {
          const insertQuery = "INSERT INTO category (name) VALUES (?)";

          const response1 = await dbConnection.query(insertQuery, [name]);

          if (!response1) {
            // return res.json({
            //   isSuccess: false,
            //   message: "Insert operation failed.",
            // });
            error1 = new Error("Insert operation failed.");
            error1.statusCode = 400;
            throw error1;
          } 

          else {
            const data = {
              id: response1[0].insertId, // The ID of the newly inserted category
              name: name, // The actual category name
            };
            // console.log("Emitting category:", { action: 'update', data: data });
            io.getIO().emit("category", { action: "create", data: data });
            return res.status(200).json({
              isSuccess: true,
              message: "Inserted successfully!",
              catId: response1[0].insertId, // Optionally return the new user's ID
            });
          }
        }
      }

      await main();
    }
  } catch (error) {
    console.log("post category error: ", error);

    next(error);
  }
};

export const categories_edit = async (req, res, next) => {
  try {
    const { id } = req.params;

    // console.log(req.params);

    const error = validationResult(req);

    let error1 = "";

    if (!error.isEmpty()) {
      const messages = error.array().map(err => err.msg).join(', '); // Join all error messages
      const validationError = new Error(messages);
      validationError.name = "ValidationError";
      validationError.statusCode = 400;
      validationError.id = id;
      validationError.oldInput = ""; // Attach oldInput to the error
      throw validationError;
    } 

    else {
      async function main() {
        const dbConnection = await dbConnectionPromise; // Wait for the promise to resolve

        // Now you can use dbConnection to execute queries
        const [response] = await dbConnection.query(
          "SELECT * FROM category WHERE id = ?",
          [id]
        );
        // console.log(response);

        if (response == "") {
          // return res.json({
          //   isSuccess: false,
          //   message: "Category not found...",
          //   data: [],
          // });
          error1 = new Error("Category not found...");
          error1.statusCode = 400;
          throw error1;
        } 

        else {
          return res.status(200).json({
            isSuccess: true,
            message: "",
            data: response,
          });
        }
      }

      await main();
    }
  } catch (error) {
    console.log("edit category error: ", error);

    next(error);
  }
};

export const categories_update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // console.log(id, name);

    const error = validationResult(req);

    let error1 = "";

    if (!error.isEmpty()) {
      const messages = error.array().map(err => err.msg).join(', '); // Join all error messages
      const validationError = new Error(messages);
      validationError.name = "ValidationError";
      validationError.statusCode = 400;
      validationError.id = id;
      validationError.oldInput = { name: name }; // Attach oldInput to the error
      throw validationError;
    } 

    else {
      async function main() {
        const dbConnection = await dbConnectionPromise; // Wait for the promise to resolve

        // Now you can use dbConnection to execute queries
        const [response] = await dbConnection.query(
          "SELECT * FROM category WHERE id = ?",
          [id]
        );
        // console.log(response);

        if (response == "") {
          // return res.json({
          //   isSuccess: false,
          //   message: "Category not found...",
          // });

          error1 = new Error("Category not found...");
          error1.statusCode = 400;
          throw error1;
        } 

        else {
          const [response2] = await dbConnection.query(
            "UPDATE category SET name = ? WHERE id = ?",
            [name, id]
          );
          // console.log(response2);

          if (!response2) {
            // return res.json({
            //   isSuccess: false,
            //   message: "Update operation failed...",
            // });

            error1 = new Error("Update operation failed...");
            error1.statusCode = 400;
            throw error1;
          } 

          else {
            const data = {
              id: id, // The ID of the newly inserted category
              name: name, // The actual category name
            };
            // console.log("Emitting category:", { action: 'update', data: data });
            io.getIO().emit("category", { action: "update", data: data });

            return res.status(200).json({
              isSuccess: true,
              message: "Updated successfully!",
            });
          }
        }
      }

      await main();
    }
  } catch (error) {
    console.log("update category error: ", error);

    next(error);
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

      // console.log(page);

      async function main() {
        const dbConnection = await dbConnectionPromise; // Wait for the promise to resolve

        const [response1, response2] = await Promise.allSettled([ 
          dbConnection.query("SELECT count(*) as c FROM modules"),
          dbConnection.query(
            "SELECT m.*, GROUP_CONCAT(c.name ORDER BY c.name SEPARATOR ', ') AS categories FROM modules AS m INNER JOIN tags AS t ON t.module_id = m.id INNER JOIN category AS c ON c.id = t.cat_id GROUP BY m.id limit 10 offset ?",
            [offset])
        ]);
        // console.log(response);

        if (response2 == "" || response1 == "") {
          // return res.json({
          //   isSuccess: false,
          //   message: "No data found...",
          //   data: [],
          // });

          error1 = new Error("No data found...");
          error1.statusCode = 400;
          throw error1;
        } 

        else {
          return res.status(200).json({
            isSuccess: true,
            totalCount: response1[0]["c"],
            data: response2,
          });
        }
      }

      await main();
    }
  } 

  catch (error) {
    console.log("get modules error: ", error);

    next(error);
  }
};

export const modules_filter = async (req, res, next) => {
  try {
    const searchTerm =
      req.query.searchTerm != "" ? req.query.searchTerm.trim() : null;

    console.log(searchTerm);

    // SELECT m.*, c.name as category FROM `modules` as m JOIN category as c ON m.category_id = c.id where m.category_id = 2;
  } catch (error) {
    console.log("get all modules error: ", error);
  }
};

export const modules_post = async (req, res, next) => {
  try {
    // console.log(req.body);

    const { title, description, image, video, duration, category } = req.body;

    const cleanedTags = Array.isArray(category)
      ? category.filter((tag) => tag !== "").map(Number)
      : category
          .split(",")
          .map((tag) => parseInt(tag, 10))
          .filter((tag) => !isNaN(tag));

    // if (!error.isEmpty()) {
    //   // console.log(error.array());
    //   let msg1 = error.array()[0].msg;

    //   return res.json({
    //     isSuccess: false,
    //     message: msg1,
    //     oldInput: {
    //       title,
    //       description,
    //       image,
    //       video,
    //       duration,
    //       cleanedTags,
    //     },
    //   });
    // } 

    const error = validationResult(req);

    let error1 = "";

    if (!error.isEmpty()) {
      const messages = error.array().map(err => err.msg).join(', '); // Join all error messages
      const validationError = new Error(messages);
      validationError.name = "ValidationError";
      validationError.statusCode = 400;
      validationError.oldInput = { title: title, description: description, image: image, video: video, duration: duration, cleanedTags: cleanedTags }; // Attach oldInput to the error
      throw validationError;
    }

    else {
      async function main() {
        const dbConnection = await dbConnectionPromise; // Wait for the promise to resolve

        // Now you can use dbConnection to execute queries
        const [response] = await dbConnection.query(
          "INSERT INTO `modules`(`title`, `description`, `image`, `video`, `duration`) VALUES(?,?,?,?,?)",
          [title, description, image, video, duration]
        );
        // console.log(response, !response, response.insertId);

        if (!response) {
          // return res.json({
          //   isSuccess: false,
          //   message: "Failed to insert. Try Again...",
          // });
          error1 = new Error("Failed to insert. Try Again...");
          error1.statusCode = 400;
          throw error1;
        } 

        else {
          const createdAt = new Date(); // January is month 0 in JavaScript
          const formattedDate = createdAt.toISOString().split("T")[0];

          const [response1] = await dbConnection.query(
            "INSERT INTO `lessons`(`module_id`, `created_at`) VALUES(?, ?)",
            [response.insertId, formattedDate]
          );

          // console.log("response1", response1);

          if (!response1) {
            // return res.json({
            //   isSuccess: false,
            //   message: "Failed to insert. Try Again...",
            // });
            error1 = new Error("Failed to insert. Try Again...");
            error1.statusCode = 400;
            throw error1;
          } 

          else {
            // 				    	const data = {
            // 				    		id: response.insertId,
            // 				    		title: title,
            // 				    		category_id: category,
            // 				    		image: image,
            // 				    		video: video,
            // 				    		duration: duration,
            // 				    		category: category_name
            // 				    	};

            // 						io.getIO().emit('modules', { action: 'create', data: data });

            for (const i of cleanedTags) {
              await dbConnection.query(
                "INSERT INTO tags (module_id, cat_id) values(?,?)",
                [response.insertId, i]
              );
            }

            return res.status(200).json({
              isSuccess: true,
              message: "Inserted successfully!",
              moduleId: response.insertId, // Optionally return the new module's ID
            });
          }
        }
      }

      await main();
    }
  } 

  catch (error) {
    console.log("modules post error: ", error);

    next(error);
  }
};

export const modules_edit = async (req, res, next) => {
  try {
    const { id } = req.params;

    // console.log(req.params);

    // if (!error.isEmpty()) {
    //   // console.log(error.array());
    //   let msg1 = error.array()[0].msg;

    //   return res.json({
    //     isSuccess: false,
    //     message: msg1,
    //     id: id,
    //   });
    // }

    const error = validationResult(req);

    let error1 = "";

    if (!error.isEmpty()) {
      const messages = error.array().map(err => err.msg).join(', '); // Join all error messages
      const validationError = new Error(messages);
      validationError.name = "ValidationError";
      validationError.statusCode = 400;
      validationError.id = id
      validationError.oldInput = ""; // Attach oldInput to the error
      throw validationError;
    } 

    else {
      async function main() {
        const dbConnection = await dbConnectionPromise; // Wait for the promise to resolve

        // Now you can use dbConnection to execute queries
        const [response, response1] = await Promise.allSettled([
          dbConnection.query("SELECT * FROM modules WHERE id = ?", [id]),
          dbConnection.query(
            "SELECT cat_id as id FROM tags WHERE module_id = ?",
            [id]
          ),
        ]);

        // console.log(response[0] == "" || response1[0] == "");

        if (response[0] == "" && response1[0] == "") {
          // return res.json({
          //   isSuccess: false,
          //   message: "Module not found..."
          // });
          error1 = new Error("Module not found...");
          error1.statusCode = 400;
          throw error1;
        } 

        else {
          return res.status(200).json({
            isSuccess: true,
            message: "",
            data: response[0],
            tags: response1[0],
          });
        }
      }

      await main();
    }
  } catch (error) {
    console.log("modules edit error: ", error);

    next(error);
  }
};

export const modules_update = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const { title, description, image, video, duration, category } = req.body;

    const cleanedTags = Array.isArray(category)
      ? category.filter((tag) => tag !== "").map(Number)
      : category
          .split(",")
          .map((tag) => parseInt(tag, 10))
          .filter((tag) => !isNaN(tag));

    // console.log(req.params, req.body);

    // if (!error.isEmpty()) {
    //   // console.log(error.array());
    //   let msg1 = error.array()[0].msg;

    //   return res.json({
    //     isSuccess: false,
    //     message: msg1,
    //     id: id,
    //     oldInput: {
          // title,
          // description,
          // image,
          // video,
          // duration,
          // cleanedTags,
    //     },
    //   });
    // } 
    const error = validationResult(req);

    let error1 = "";

    if (!error.isEmpty()) {
      const messages = error.array().map(err => err.msg).join(', '); // Join all error messages
      const validationError = new Error(messages);
      validationError.name = "ValidationError";
      validationError.statusCode = 400;
      validationError.id = id
      validationError.oldInput = { title, description, image, video, duration, cleanedTags }; // Attach oldInput to the error
      throw validationError;
    }

    else {
      async function main() {
        const dbConnection = await dbConnectionPromise; // Wait for the promise to resolve

        // Now you can use dbConnection to execute queries
        const [response] = await dbConnection.query(
          "SELECT * FROM modules WHERE id = ?",
          [id]
        );
        // console.log(response);

        if (response == "") {
          // return res.json({
          //   isSuccess: false,
          //   message: "Module not found...",
          // });

          error1 = new Error("Module not found...");
          error1.statusCode = 400;
          throw error1;
        } 

        else {
          const [response1] = await dbConnection.query(
            "UPDATE `modules` SET `title`=?, `description`=?, `image`=?,`video`=?,`duration`=? WHERE id=?",
            [title, description, image, video, duration, id]
          );
          // console.log(!response1);

          if (!response1) {
            // return res.json({
            //   isSuccess: false,
            //   message: "Failed to update. Try Again...",
            // });

            error1 = new Error("Failed to update. Try Again...");
            error1.statusCode = 400;
            throw error1;
          } 

          else {
            const [response2] = await dbConnection.query(
              `DELETE FROM tags WHERE module_id = ?`,
              [id]
            );

            for (const i of cleanedTags) {
              await dbConnection.query(
                "INSERT INTO tags (module_id, cat_id) values(?,?)",
                [id, i]
              );
            }
            return res.status(200).json({
              isSuccess: true,
              message: "Success",
            });
          }
        }
      }

      await main();
    }
  } catch (error) {
    console.log("modules update error: ", error);

    next(error);
  }
};

export const modules_get_lessons = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    let itemsPerPage = parseInt(req.query.items) || 10;

    const page = parseInt(req.query.page) || 1;
    const offset = page > 1 ? (page - 1) * itemsPerPage : 0;

    // console.log(req.params);

    // const error = validationResult(req);

    // if (!error.isEmpty()) {
    //   // console.log(error.array());
    //   let msg1 = error.array()[0].msg;

    //   return res.json({
    //     isSuccess: false,
    //     message: msg1,
    //     id: id,
    //   });
    // } 

    const error = validationResult(req);
    
    let error1 = "";

    if (!error.isEmpty()) {
      const messages = error.array().map(err => err.msg).join(', '); // Join all error messages
      const validationError = new Error(messages);
      validationError.name = "ValidationError";
      validationError.statusCode = 400;
      validationError.id = id;
      validationError.oldInput = ""; // Attach oldInput to the error
      throw validationError;
    }

    else {
      async function main() {
        const dbConnection = await dbConnectionPromise; // Wait for the promise to resolve

        // Now you can use dbConnection to execute queries
        const [response] = await dbConnection.query(
          "SELECT * FROM modules WHERE id = ?",
          [id]
        );
        // console.log(response);

        if (response == "") {
          // return res.json({
          //   isSuccess: false,
          //   message: "Module not found...",
          // });

          error1 = new Error("Module not found...");
          error1.statusCode = 400;
          throw error1;
        } 

        else {
          const [response1, response2] = await Promise.all([
            dbConnection.query("SELECT COUNT(*) AS c FROM lessons WHERE module_id = ?", [id]),
            dbConnection.query("SELECT * FROM lessons WHERE module_id = ?", [id])
          ]);
          // console.log(response1[0], response1[0][0], response2[0]);
        
          // console.log(response1[0] == "", response1[0][0]?.c == 1, response2[0] == "");

          if (response1[0] == "" || response1[0][0]?.c == 1 || response2[0] == "") {
            // return res.json({
            //   isSuccess: false,
            //   message: "Lessons not found...",
            //   count: 0
            // });

            error1 = new Error("Lessons not found...");
            error1.statusCode = 400;
            error1.comment = 0;
            throw error1;
          } 

          else {
            return res.status(200).json({
              isSuccess: true,
              message: "",
              count: response1[0][0]?.c,
              lessons: response2[0],
            });
          }
        }
      }

      await main();
    }
  } catch (error) {
    console.log("get modules lessons error: ", error);

    next(error);
  }
};

export const modules_post_lessons = async (req, res, next) => {
  try {
    // console.log(req.body, req.params);

    const { id } = req.params;

    const { title, description, image, fileCode, duration } = req.body;

    // if (!error.isEmpty()) {
    //   // console.log(error.array());
    //   let msg1 = error.array()[0].msg;

    //   return res.json({
    //     isSuccess: false,
    //     message: msg1,
    //     id: id,
    //     oldInput: {
    //       title,
    //       description,
    //       image,
    //       fileCode,
    //       duration,
    //     },
    //   });
    // }

    const error = validationResult(req);
    
    let error1 = "";

    if (!error.isEmpty()) {
      const messages = error.array().map(err => err.msg).join(', '); // Join all error messages
      const validationError = new Error(messages);
      validationError.name = "ValidationError";
      validationError.statusCode = 400;
      validationError.id = id;
      validationError.oldInput = { title, description, image, fileCode, duration }; // Attach oldInput to the error
      throw validationError;
    } 

    else {
      async function main() {
        const dbConnection = await dbConnectionPromise; // Wait for the promise to resolve

        // Now you can use dbConnection to execute queries
        const [response] = await dbConnection.query(
          "SELECT * FROM modules WHERE id = ?",
          [id]
        );
        // console.log(response);

        if (response == "") {
          // return res.json({
          //   isSuccess: false,
          //   message: "Module not found...",
          // });

          error1 = new Error("Module not found...");
          error1.statusCode = 400;
          throw error1;
        } 

        else {
          const [response1] = await dbConnection.query(
            "DELETE FROM `lessons` WHERE module_id = ?",
            [id]
          );
          // console.log(response1);

          // if (!response1) {
          //   return res.json({
          //     isSuccess: false,
          //     message: "Failed to update. Try Again...",
          //   });
          // } else {
            const cleanedTitle =
              typeof title == "object"
                ? title.map((i) => i.trim())
                : [title.trim()];
            const cleanedDescription =
              typeof description == "object"
                ? description.map((i) => i.trim())
                : [description.trim()];

            const pi = typeof image == "object" ? image.map(i => i.trim()) : [image];
            const fc = typeof fileCode == "object" ? fileCode.map(i => i.trim()) : [fileCode];
            const vl = typeof duration == "object" ? duration.map(i => i.trim()) : [duration];
          
            // console.log("hii...", cleanedTitle, cleanedDescription, pi, fc, vl);

            // const createdAt = moment.tz('Europe/Madrid').format();
            // console.log(madridTime);

            // const formattedDate = createdAt.toISOString().split('T')[0];

            const createdAt = moment
              .tz("Europe/Madrid")
              .format("YY-MM-DD HH-mm-ss");

            const results = await Promise.all(
              cleanedTitle.map((i, index) => {
                return dbConnection.query(
                  "INSERT INTO `lessons`(`module_id`, `title`, `description`, `image`, `video`, `video_length`, `created_at`) VALUES(?,?,?,?,?,?,?)",
                  [
                    id,
                    i,
                    cleanedDescription[index],
                    pi[index] || null,
                    fc[index] || null,
                    vl[index] || null,
                    createdAt,
                  ]
                );
              })
            );

            // console.log(results);

            if (results == "") {
              // return res.json({
              //   isSuccess: false,
              //   message: "Failed to update lessons. Try Again...",
              // });

              error1 = new Error("Failed to update lessons. Try Again...");
              error1.statusCode = 400;
              throw error1;
            } 

            else {
              return res.status(200).json({
                isSuccess: true,
                message: "Success",
              });
            }
          // }
        }
      }

      await main();
    }
  } catch (error) {
    console.log("post modules lessons error: ", error);

    next(error);
  }
};

export const modules_delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    // console.log(req.params);

    const error = validationResult(req);
    
    let error1 = "";

    if (!error.isEmpty()) {
      const messages = error.array().map(err => err.msg).join(', '); // Join all error messages
      const validationError = new Error(messages);
      validationError.name = "ValidationError";
      validationError.statusCode = 400;
      validationError.id = id;
      validationError.oldInput = ""; // Attach oldInput to the error
      throw validationError;
    }

    else {
      async function main() {
        const dbConnection = await dbConnectionPromise; // Wait for the promise to resolve

        // Now you can use dbConnection to execute queries
        const [response] = await dbConnection.query(
          "SELECT * FROM `modules` WHERE id = ?",
          [id]
        );
        // console.log(response);

        if (response[0] == "") {
          // return res.json({
          //   isSuccess: false,
          //   message: "Module not found...",
          // });

          error1 = new Error("Module not found...");
          error1.statusCode = 400;
          throw error1;
        } 

        else {
          const [response1, response2, response3] = await Promise.all([
            dbConnection.query("DELETE FROM `modules` WHERE id = ?", [id]),
            dbConnection.query("DELETE FROM `lessons` WHERE module_id = ?", [
              id,
            ]),
            dbConnection.query("DELETE FROM `tags` WHERE module_id = ?", [id]),
          ]);
          // console.log(response1);

          if (response1[0] == "" || response2[0] == "" || response3[0] == "") {
            // return res.json({
            //   isSuccess: false,
            //   message: "Failed to delete. Try Again...",
            // });

            error1 = new Error("Failed to delete. Try Again...");
            error1.statusCode = 400;
            throw error1;
          } 

          else {
            return res.status(200).json({
              isSuccess: true,
              message: "",
            });
          }
        }
      }

      await main();
    }
  } catch (error) {
    console.log("delete modules error: ", error);

    next(error);
  }
};

export const category_delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    // console.log(req.params);

    const error = validationResult(req);
    
    let error1 = "";

    if (!error.isEmpty()) {
      const messages = error.array().map(err => err.msg).join(', '); // Join all error messages
      const validationError = new Error(messages);
      validationError.name = "ValidationError";
      validationError.statusCode = 400;
      validationError.id = id;
      validationError.oldInput = ""; // Attach oldInput to the error
      throw validationError;
    } 

    else {
      async function main() {
        const dbConnection = await dbConnectionPromise; // Wait for the promise to resolve

        // Now you can use dbConnection to execute queries
        const [response] = await dbConnection.query(
          "SELECT * FROM `category` WHERE id = ?",
          [id]
        );
        // console.log(response);

        if (response == "") {
          // return res.json({
          //   isSuccess: false,
          //   message: "Category not found...",
          // });

          error1 = new Error("Category not found...");
          error1.statusCode = 400;
          throw error1;
        } 

        else {
          const [response1] = await dbConnection.query(
            "DELETE FROM `category` WHERE id = ?",
            [id]
          );
          // console.log(response1);

          if (!response1) {
            // return res.json({
            //   isSuccess: false,
            //   message: "Failed to delete. Try Again...",
            // });

            error1 = new Error("Failed to delete. Try Again...");
            error1.statusCode = 400;
            throw error1;
          } 

          else {
            io.getIO().emit("category", { action: "delete", data: id });
            return res.status(200).json({
              isSuccess: true,
              message: "",
            });
          }
        }
      }

      await main();
    }
  } catch (error) {
    console.log("delete category error: ", error);

    next(error);
  }
};

export const get_trending = async (req, res, next) => {
  try {
    async function main() {
      const dbConnection = await dbConnectionPromise; // Wait for the promise to resolve

      // Now you can use dbConnection to execute queries
      const [response] = await dbConnection.query(
        "SELECT t.id as trending_id, m.id as module_id, m.title, m.image, c.name as category FROM `trending` as t LEFT JOIN modules as m ON t.module_id = m.id LEFT JOIN category as c ON c.id = m.category_id"
      );
      // console.log(response);

      if (response == "") {
        return res.status(200).json({
          isSuccess: false,
          data: [],
        });
      } 

      else {
        return res.status(200).json({
          isSuccess: true,
          data: response,
        });
      }
    }

    await main();
  } catch (error) {
    console.log("get trending error: ", error);

    next(error);
  }
};

export const post_trending = async (req, res, next) => {
  try {
    const { module_id } = req.body;
    // console.log(module_id);

    const error = validationResult(req);
    
    let error1 = "";

    if (!error.isEmpty()) {
      const messages = error.array().map(err => err.msg).join(', '); // Join all error messages
      const validationError = new Error(messages);
      validationError.name = "ValidationError";
      validationError.statusCode = 400;
      validationError.oldInput = { module_id: module_id }; // Attach oldInput to the error
      throw validationError;
    }

    else {
      async function main() {
        const dbConnection = await dbConnectionPromise; // Wait for the promise to resolve

        // Now you can use dbConnection to execute queries
        const [response] = await dbConnection.query(
          "SELECT * FROM trending WHERE module_id = ?",
          [module_id]
        );
        // console.log("module not found: ", response);

        if (response != "") {
          // return res.json({
          //   isSuccess: false,
          //   message: "Module already found. Please add a new one...",
          // });

          error1 = new Error("Module already found. Please add a new one...");
          error1.statusCode = 400;
          throw error1;
        } 

        else {
          const insertQuery = "INSERT INTO trending (module_id) VALUES (?)";

          const response1 = await dbConnection.query(insertQuery, [module_id]);
          // console.log(response1);

          if (!response1) {
            // return res.json({
            //   isSuccess: false,
            //   message: "Insert operation failed.",
            // });

            error1 = new Error("Insert operation failed.");
            error1.statusCode = 400;
            throw error1;
          } 

          else {
            return res.status(200).json({
              isSuccess: true,
              message: "Inserted successfully!",
            });
          }
        }
      }

      await main();
    }
  } catch (error) {
    console.log("get trending error: ", error);

    next(error);
  }
};

export const trending_delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    // console.log(req.params);

    const error = validationResult(req);
    
    let error1 = "";

    if (!error.isEmpty()) {
      const messages = error.array().map(err => err.msg).join(', '); // Join all error messages
      const validationError = new Error(messages);
      validationError.name = "ValidationError";
      validationError.statusCode = 400;
      validationError.id = id;
      validationError.oldInput = ""; // Attach oldInput to the error
      throw validationError;
    }

    else {
      async function main() {
        const dbConnection = await dbConnectionPromise; // Wait for the promise to resolve

        // Now you can use dbConnection to execute queries
        const [response] = await dbConnection.query(
          "SELECT * FROM `trending` WHERE id = ?",
          [id]
        );
        // console.log(response);

        if (response == "") {
          // return res.json({
          //   isSuccess: false,
          //   message: "Item not found...",
          // });

          error1 = new Error("Item not found...");
          error1.statusCode = 400;
          throw error1;
        } 

        else {
          const [response1] = await dbConnection.query(
            "DELETE FROM `trending` WHERE id = ?",
            [id]
          );
          // console.log(response1);

          if (!response1) {
            // return res.json({
            //   isSuccess: false,
            //   message: "Failed to delete. Try Again...",
            // });

            error1 = new Error("Failed to delete. Try Again...");
            error1.statusCode = 400;
            throw error1;
          } 

          else {
            return res.status(200).json({
              isSuccess: true,
              message: "",
            });
          }
        }
      }

      await main();
    }
  } catch (error) {
    console.log("delete trending error: ", error);

    next(error);
  }
};
