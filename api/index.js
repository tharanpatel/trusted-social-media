import express from "express";
const app = express();
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import likeRoutes from "./routes/likes.js";
import commentRoutes from "./routes/comments.js";
import relationshipRoutes from "./routes/relationships.js";
import positiveTrustRoutes from "./routes/positiveTrusts.js";
import negativeTrustRoutes from "./routes/negativeTrusts.js";
import totalTrustRoutes from "./routes/totalTrusts.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";

//middleware, middleware is adding using app.use
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true)
  next()
})
app.use(express.json()); // Parses incoming request bodies in JSON formate
app.use(
  cors({
    origin: "http://localhost:3000", // Cross-Origin Resource Sharing, allows requests from http://localhosts:3000
  })
);
app.use(cookieParser()) // Parses cookies in incoming requests

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "../client/public/upload");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname); // creates a unique filename so there arent conflicts when uploading files with the same name
    },
  });

  const upload = multer({ storage: storage })

app.post("/api/upload", upload.single("file"), (req,res)=>{
    const file = req.file;
    res.status(200).json(file.filename)
})

// Mounting router handlers using app.use()
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/likes", likeRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/relationships", relationshipRoutes)
app.use("/api/positiveTrusts", positiveTrustRoutes)
app.use("/api/negativeTrusts", negativeTrustRoutes)
app.use("/api/totalTrusts", totalTrustRoutes)


// Starts server on port 8800 using app.listen()
app.listen(3001, () => {
  console.log("Server running")
});

