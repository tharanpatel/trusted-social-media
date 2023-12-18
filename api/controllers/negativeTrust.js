import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getNegativeTrusts = (req, res) => {
  const q = "SELECT userId FROM negativeTrusts WHERE postId = ?";

  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.map(negativeTrust => negativeTrust.userId));
  });
}

export const getAllNegativeTrusts = (req, res) => {
  const q = "SELECT * FROM negativeTrusts WHERE postId = ?";

  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.map(negativeTrust => negativeTrust.userId));
  });
}

export const addNegativeTrust = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "INSERT INTO negativeTrusts (`userId`,`postId`) VALUES (?)";
    const values = [
      userInfo.id,
      req.body.postId
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been recognised as untrustworthy.");
    });
  });
};

export const deleteNegativeTrust = (req, res) => {

  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM negativeTrusts WHERE `userId` = ? AND `postId` = ?";

    db.query(q, [userInfo.id, req.query.postId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Untrustworthy status has been removed from post.");
    });
  });
};