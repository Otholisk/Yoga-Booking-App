
// index.js
import express from "express";
import session from "express-session"
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mustacheExpress from "mustache-express";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from './routes/auth.js';
import courseRoutes from "./routes/courses.js";
import sessionRoutes from "./routes/sessions.js";
import organiserRoutes from "./routes/organiser.js";
import bookingRoutes from "./routes/bookings.js";
import viewRoutes from "./routes/views.js";
import { attachUser } from "./middlewares/demoUser.js";
import { initDb } from "./models/_db.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

// View engine (Mustache)
app.engine(
  "mustache",
  mustacheExpress(path.join(__dirname, "views", "partials"), ".mustache")
);
app.set("view engine", "mustache");
app.set("views", path.join(__dirname, "views"));

// Body parsing
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(session({ secret: "dance-secret-key", resave: false, saveUninitialized: false }));

// Static
app.use("/static", express.static(path.join(__dirname, "public")));

// attach user from session
app.use(attachUser);

// Health
app.get("/health", (req, res) => res.json({ ok: true }));

// JSON API routes
app.use("/", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/bookings", bookingRoutes);

// SSR view routes
app.use("/organiser", organiserRoutes);
app.use("/", viewRoutes);

// Errors
export const not_found = (req, res) =>
  res.status(404).type("text/plain").send("404 Not found.");
export const server_error = (err, req, res, next) => {
  next(err);
  res.status(500).type("text/plain").send("Internal Server Error.");
};
app.use(not_found);
app.use(server_error);

// Only start the server outside tests
if (process.env.NODE_ENV !== "test") {
  await initDb();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`Yoga booking running on http://localhost:${PORT}`)
  );
}
