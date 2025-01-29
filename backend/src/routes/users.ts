import express, { Request, Response, Router } from "express";
import User from "../models/users";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";

const router = express.Router();

// api/users/register
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    let user = await User.findOne({
      email: req.body.email,
    });

    if (user) {
      res.status(400).json({ message: "User already exits" });
    }

    user = new User(req.body);
    await user.save();

    // Reference from here: https://randomkeygen.com/
    const token = jwt.sign(
      { userID: user.id },
      process.env.JWT_SECRET_KEY as string,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400000, // same as expires in seconds
    });
    res.status(200).send({ message: "User registered OK" });
  } catch (error) {
    console.log("error in Users", error);
    res.status(500).send({ message: "Something went wrong" });
  }
});

export default router;
