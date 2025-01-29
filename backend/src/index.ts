import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "../connect";

import userRoutes from "./routes/users";

const start = async () => {
  // const uri =
  //   "mongodb+srv://kunalpoddar41292:Ec90X7v2RKWfdhol@cluster0.yir5y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  await connectDB(process.env.MONGODB_CONNECTION_STRING as string);

  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  app.use("/api/users", userRoutes);

  // app.get("/api/test", async (req: Request, res: Response) => {
  //   res.json({ message: "hello from express endpoint!!!" });
  // });

  app.listen(3000, () => {
    console.log("server running on localhost:3000");
  });
};

start();
