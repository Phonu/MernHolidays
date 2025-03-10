import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User from "../models/users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";

const router = express.Router();

/*  /api/auth/login */
router.post(
  "/login",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password with min 6 or more characters").isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors.array() });
    }
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ message: "Invalid Credentails" });
      }
      const isMatch = await bcrypt.compare(password, user!.password);
      if (!isMatch) {
        res.status(400).json({ message: "Wrong password" });
      }

      const token = jwt.sign(
        { userId: user!.id },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "1d",
        }
      );

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      });
      res.status(200).json({ userId: user!._id });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
  res.status(200).send({ userId: req.userId });
});

// remove the auth-token
router.post("/logout", (req: Request, res: Response) => {
  console.log("logout api called...");

  res.cookie("auth_token", "", {
    expires: new Date(0),
  });
  res.send();
});

export default router;
