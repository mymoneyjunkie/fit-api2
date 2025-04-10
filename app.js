import express from "express";

import cookieParser from "cookie-parser";

import cors from "cors";

import { PORT } from "./config/env.js";

import authRouter from "./routes/auth.routes.js";

import refreshRouter from "./routes/refresh.routes.js";

import logoutRouter from "./routes/logout.routes.js";

import userRouter from "./routes/user.routes.js";

import adminRouter from "./routes/admin.routes.js";

import errorMiddleware from "./middleware/error.middleware.js";

import authMiddleware from "./middleware/auth.middleware.js";

const app = express();

// app.set('trust proxy', 1);

app.use(cors({
    origin: "*", // Your frontend URL
    methods: ["GET", "POST"],
    credentials: true
}));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use("/api/v1/auth", authRouter);

app.use("/api/v1/refresh", refreshRouter);

app.use("/api/v1/logout", logoutRouter);

app.use("/api/v1/admin", adminRouter);

// app.use("/api/v1/users", authMiddleware, userRouter);
app.use("/api/v1/users", userRouter);

app.use("*", (req, res, next) => {
    const error = new Error("Page Not Found");
    error.statusCode = 404;
    next(error);
})

app.use(errorMiddleware);

app.listen(PORT, () => {
	console.log(`Listening to localhost PORT ${PORT}`);
})

export default app;