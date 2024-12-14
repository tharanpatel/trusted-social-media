import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getPosts = (req, res) => {
  const userId = req.query.userId;
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  // checking if token has expired
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    /* By ordering by post id (in descending order) we can ensure the most recent posts are shown.
       Tertiary operation allows us to remove our own posts from other users profiles
    */
    const q =
      userId !== "undefined"
        ? `SELECT p.*, u.id AS userId, name, profilePic
        FROM posts AS p
        JOIN users AS u ON (u.id = p.userId)
        WHERE p.userId = ? ORDER BY p.id DESC`
        :
        `SELECT p.*, u.id AS userId, name, profilePic
        FROM posts AS p
        JOIN users AS u ON (u.id = p.userId)
        LEFT JOIN relationships AS r ON (p.userId = r.followedUserId)
        WHERE r.followerUserId= ? OR p.userId =? ORDER BY p.id DESC`;

    const values =
      userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const getPost = (req, res) => {
  const postId = req.params.id;
  const q = "SELECT * FROM posts WHERE `id`=?"

  db.query(q, [postId], (err, data) => {
    if (err) return res.status(500).json(err)
    return res.status(200).json(data);
  });
};

export const addPost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  // Checking if token has expired
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO posts(`desc`, `img`, `userId`) VALUES (?)"; // need to use `` to wrap items to fix SQL syntax error
    const values = [
      req.body.desc,
      req.body.img,
      userInfo.id,
    ];

    // Telling the query, if there is a userId, only only the userId, otherwise use everything
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been created.");
    });
  });
};

export const updatePost = (req, res) => {


  const q = "UPDATE posts SET `postTrust`=? WHERE `id`=?" // SQL query

  db.query(q, [req.body.postTrust, req.body.id], (err, data) => {
    if (err) res.status(500).json(err);
    if (data.affectedRows > 0) return res.json("Updated!") // This will only trigger if rows in sql are changed, meaning the update was successful
    return res.status(403).json("you can only update your own posts.");
  });
};

export const deletePost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "DELETE FROM posts WHERE `id`=? AND `userId`=?"; // Verification using SQL so that we can only delete our own posts

    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0) return res.status(200).json("Post has been deleted.");
      return res.status(403).json("You can delete only your post")
    });
  });
};


