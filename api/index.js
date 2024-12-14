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
import { WebSocket, WebSocketServer } from "ws";
import http from "http"
import { v4 as uuidv4 } from 'uuid';


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


// Starts server on port 3001 using app.listen()
app.listen(3001, () => {
  console.log("Express Server is running on port 3001.")
});


// Create an HTTP server and a WebSocket server
const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const port = 8000;

// Start the WebSocket server
server.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}.`);
});

const clients = {};
const users = {};
let editorContent = null;
let userActivity = [];

// Handle new client connections
wsServer.on("connection", function handleNewConnection(connection) {
  const userId = uuidv4();
  console.log("Received a new connection");

  clients[userId] = connection;
  console.log(`${userId} connected.`);

  connection.on("message", (message) =>
    processReceivedMessage(message, userId),
  );
  connection.on("close", () => handleClientDisconnection(userId));
});

function handleClientDisconnection(userId) {
  console.log(`${userId} disconnected.`);
  const json = { type: eventTypes.USER_EVENT };
  const username = users[userId]?.username || userId;
  userActivity.push(`${username} left the editor`);
  json.data = { users, userActivity };
  delete clients[userId];
  delete users[userId];
  sendMessageToAllClients(json);
}