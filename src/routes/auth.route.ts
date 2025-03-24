import { Router } from "express";
import { registerHandler } from "../controllers/auth.controller";

const authRoutes = Router();

// prefix: /auth
authRoutes.post("/register", registerHandler);

authRoutes.post("/login", registerHandler);


export default authRoutes;
