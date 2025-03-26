import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email().min(1).max(255),
  password: z.string().min(6).max(255),
})

export default loginSchema