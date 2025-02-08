import express, { Request, Response } from "express";
import multer from "multer";

import { v2 as cloudinary } from "cloudinary";
import Hotel, { HotelType } from "../models/hotel";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

router.post(
  "/",
  verifyToken,
  [body("name").notEmpty().withMessage("Name is required")],
  [body("city").notEmpty().withMessage("city is required")],
  [body("country").notEmpty().withMessage("country is required")],
  [body("description").notEmpty().withMessage("description is required")],
  [body("type").notEmpty().withMessage("Hotel type is required")],
  [body("pricePerNight").notEmpty().withMessage("Name is required")],
  [
    body("type")
      .notEmpty()
      .isNumeric()
      .withMessage("Price per night is required and must be a number"),
  ],
  [
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("Facilities are required"),
  ],

  upload.array("imageFiles", 6),
  async (request: Request, response: Response) => {
    try {
      console.log("2222");

      const imageFiles = request.files as Express.Multer.File[];
      console.log("KUNAL! request in backend router", request.body);
      const newHotel: HotelType = request.body;

      // 1. upload the images to cloudinary
      const uploadPromises = imageFiles.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString("base64");
        let dataURI = "data:" + image.mimetype + ";base64," + b64;
        const res = await cloudinary.uploader.upload(dataURI);
        return res.url;
      });

      // 2. if upload was successful, add the URLs to the new Hotel.
      const imageURLs = await Promise.all(uploadPromises);
      newHotel.imageUrls = imageURLs;
      newHotel.lastUpdated = new Date();
      newHotel.userId = request.userId;

      // 3. save the new hotel in our database.
      const hotel = new Hotel(newHotel);
      await hotel.save();

      // 4.return a 201 status
      response.status(201).send(hotel);
      return;
    } catch (error) {
      console.log("error creating on my-hotels api: ", error);
      response.status(500).json({ message: "Something went wrong" });
    }
  }
);

export default router;
