import "dotenv/config";
import express from "express";
import cors from "cors";
import connectToDatabase from "./config/db";
import { APP_ORIGIN, NODE_ENV, PORT } from "./constants/env";
import errorHandler from './middlewares/errorHandler'
import cookieParser from "cookie-parser";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send(200).json({
    status: "healthy",
  });
});

app.use(errorHandler)

app.listen(PORT, async () => {
  console.log(
    `Server is running on port ${PORT} in ${NODE_ENV} environment...`
  );
  await connectToDatabase();
});
