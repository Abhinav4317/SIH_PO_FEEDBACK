import express from "express";
import dotenv from "dotenv";
import connectDb from "./database/db.js";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { Feedback } from "./models/Feedback.js";
import { isValidPostalID } from "./util/validate-pincode.js";
import { Target } from "./models/Target.js";
dotenv.config();
const app = express();

// using middleware
app.use(express.json());
app.use(cors());

// Custom middleware to extract the role and attach it to req object
app.use((req, res, next) => {
  if (req.body?.role) {
    req.role = req.body.role; // Attach the role to the req object
  }
  next();
});

// Rate limiter
const userFeedbackLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: (req) => (req.role === "employee" ? 10 : 5), // Use the role from req
  message: "Rate limit exceeded. Please try again later.",
});

app.post("/api/post-feedback", userFeedbackLimiter, async (req, res) => {
  try {
    const { pincode, schemes, suggestion, weight, role } = req.body;
    const postalIDExists = await isValidPostalID(pincode);
    if (!postalIDExists) {
      return res.status(400).json({
        message: "Invalid Postal ID. Please enter a valid Postal ID.",
      });
    }
    const fb = await Feedback.create({
      pincode,
      schemes,
      suggestion,
      weight,
    });
    res.status(200).json({ message: "Feedback submitted successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
});
app.get("/api/get-feedback/:pincode", async (req, res) => {
  const { pincode } = req.params;
  try {
    const feedbackByPincode = await Feedback.find({ pincode });
    res.json(feedbackByPincode);
  } catch (error) {
    res.status(500).send({ message: "An error occurred", error });
  }
});
app.post("/api/saveTarget", async (req, res) => {
  try {
    const { place, targets } = req.body;
    const targetDoc = await Target.create({ place, targets });
    res.json(targetDoc);
  } catch (error) {
    res.status(500).send({ message: "An error occurred", error });
  }
});
app.get("/api/getTarget/:place", async (req, res) => {
  const { place } = req.params;
  try {
    const targetDoc = await Target.find({ place });
    res.json(targetDoc);
  } catch (error) {
    res.status(500).send({ message: "An error occurred", error });
  }
});
app.listen(process.env.PORT || 3001, () => {
  console.log(`server is working on port ${process.env.PORT}`);
  connectDb();
});
