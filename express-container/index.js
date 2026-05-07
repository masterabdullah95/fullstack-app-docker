import express from "express";
import { mongoose } from "mongoose";
import cors from "cors";
import "dotenv/config";
const app = express();
app.use(express.json());

// Add this middleware (already built into Express, no install needed)
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://mern-app-via-docker-frontend.up.railway.app",
    ],
    // methods: ["GET", "POST", "PUT", "DELETE"], // allowed HTTP methods
    // allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // allow cookies / auth headers
  }),
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

// Simple Schema
const ItemSchema = new mongoose.Schema({
  name: String,
  createdAt: { type: Date, default: Date.now },
});
const Item = mongoose.model("Item", ItemSchema);

// GET - fetch all items
app.get("/items", async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

// POST - add an item
app.post("/items", async (req, res) => {
  const item = new Item({ name: req.body.name });
  await item.save();
  res.json(item);
});

app.get("/", (req, res) => {
  res.json({ msg: "Hi from express server" });
});

const port = process.env.PORT || 4000;

app.listen(port, () =>
  console.log(`Server started at http://localhost:${port}`),
);
