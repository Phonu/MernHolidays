import express, { Request, Response } from "express";
import User from "../models/users";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";

const router = express.Router();

// api/users/register
router.post(
  "/register",
  [
    check("firstName", "First Name is required").isString(),
    check("lastName", "last Name is required").isString(),
    check("email", "Email is required").isEmail(),
    check("password", "password with 6 or more characters required").isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    console.log("checking...", errors);
    if (!errors.isEmpty()) {
      console.log("checking111...", errors);
      res.status(400).json({ error: errors.array() });
      return;
    }

    try {
      let user = await User.findOne({
        email: req.body.email,
      });

      if (user) {
        res.status(400).json({ message: "User already exits" });
        return;
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
      return;
    } catch (error) {
      console.log("error in Users", error);
      res.status(500).send({ message: "Something went wrong" });
      return;
    }
  }
);

export default router;
