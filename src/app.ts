// @ts-nocheck
import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import path from "path"; // Added for safer pathing
import { connectDB } from "./db";
import authRoutes from "./routes/authRoutes";
import pageRoutes from "./routes/pageRoutes";

// Manually define process for the compiler if the ghost persists
declare var process: any;

const app = express();

// Important behind Render proxy
app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");

// Use absolute paths to avoid the "Project Ghost" issue
// Look for views in the src folder, not dist
app.set("views", path.join(__dirname, "..", "src", "views"));

app.use(authRoutes);
app.use(pageRoutes);

const PORT = Number(process.env.PORT || 3000);

async function main() {
  // Use a fallback string to prevent the "!" operator from crashing if URI is missing
  const uri = process.env.MONGODB_URI || "";
  await connectDB(uri);
  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
}

main().catch((err) => {
  console.error("❌ Startup error:", err);
  process.exit(1);
});
