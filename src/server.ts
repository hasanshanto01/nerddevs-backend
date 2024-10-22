import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

import supportRoute from "./routes/supportRoute";
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();

const app = express();
const port = 5000;

//middleware
app.use(cors());
app.use(express.json());

// use all routes
app.use("/api/v1/support", supportRoute);

// custome middlewares
app.use(errorHandler);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is running..." });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
