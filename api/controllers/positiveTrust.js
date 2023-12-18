import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getPositiveTrusts = (req, res) => {
  const q = "SELECT userId FROM positiveTrusts WHERE postId = ?";

  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.map(positiveTrust => positiveTrust.userId));
  });
}

export const getAllPositiveTrusts = (req, res) => {
  const q = "SELECT * FROM positiveTrusts WHERE postId = ?";

  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.map(positiveTrust => positiveTrust.userId));
  });
}

export const addPositiveTrust = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "INSERT INTO positiveTrusts (`userId`,`postId`) VALUES (?)";
    const values = [
      userInfo.id,
      req.body.postId
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been recognised as trusted.");
    });
  });
};

export const deletePositiveTrust = (req, res) => {

  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM positiveTrusts WHERE `userId` = ? AND `postId` = ?";

    db.query(q, [userInfo.id, req.query.postId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Trust has been removed from post.");
    });
  });
};