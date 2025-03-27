import "dotenv/config";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import connectToDatabase from "./config/db";
import { APP_ORIGIN, NODE_ENV, PORT } from "./constants/env";
import errorHandler from "./middlewares/errorHandler";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route";
import * as swaggerDocument from '../swagger-output.json';

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

app.get("/", (req, res, next) => {
  res.json({
    status: "healthy",
  });
});

app.use("/auth", authRoutes);

app.use(errorHandler);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, async () => {
  console.log(
    `Server is running on port ${PORT} in ${NODE_ENV} environment...`
  );
  await connectToDatabase();
});
