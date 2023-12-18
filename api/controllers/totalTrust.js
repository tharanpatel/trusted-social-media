import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getTotalTrusts = (req, res) => {
    const q = "SELECT userId FROM totalTrusts WHERE postId = ?";

    db.query(q, [req.query.postId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data.map(totalTrust => totalTrust.userId));
    });
}

export const getAllTotalTrusts = (req, res) => {
    const q = "SELECT * FROM totalTrusts WHERE postId = ?";

    db.query(q, [req.query.postId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data.map(totalTrust => totalTrust.userId));
    });
}

export const addTotalTrust = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const q = "INSERT INTO totalTrusts (`userId`,`postId`, `totalTrust`) VALUES (?)";
        const values = [
            userInfo.id,
            req.body.postId,
            req.body.totalTrust
        ];

        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Post has been recognised as untrustworthy.");
        });
    });
};

export const updateTotalTrust = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not authenticated!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(402).json("Token is invalid!")

        const q = "UPDATE totalTrusts SET `totalTrust`=? WHERE postId=?" // SQL query

        db.query(q, [
            req.body.totalTrust,
            req.body.postId
        ], (err, data) => {
            if (err) res.status(500).json(err);
            if (data.affectedRows > 0) return res.json("Updated!") // This will only trigger if rows in sql are changed, meaning the update was successful
            return res.status(403).json("you can only update your own tust.");
        });
    })
};

export const deleteTotalTrust = (req, res) => {

    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const q = "DELETE FROM totalTrusts WHERE `userId` = ? AND `postId` = ?";

        db.query(q, [userInfo.id, req.query.postId], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Untrustworthy status has been removed from post.");
        });
    });
};