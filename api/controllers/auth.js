import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {

    // CHECK IF USER ALREADY EXISTS IN DB

    // Creating an SQL query here
    const q = "SELECT * FROM users WHERE username = ?"; // using the question mark provides security

    // Sending the query request, q, to the database, db (from connect.js), specifically the username row in the user table.
    // will either return an error or data that can be used
    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.status(500).json(err); // returning server error 500
        if (data.length) return res.status(409).json("User already exists!"); // returning server error 409, user already exists

        // CREATE A NEW USER
        // Hash the password using bcrypt
        const salt = bcrypt.genSaltSync(10); // generating a salt to hash password
        const hashedPassword = bcrypt.hashSync(req.body.password, salt); // passing a salt to help return encrypted password

        const q = "INSERT INTO users(`username`,`name`,`password`) VALUE (?)"; // Inserting into mysql database

        const values = [req.body.username, req.body.name, hashedPassword];

        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("User has been created.");
        });
    });
};

export const login = (req, res) => {

    const q = "SELECT * FROM users WHERE username = ?";

    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.status(500).json(err); // server error
        if (data.length === 0) return res.status(404).json("User not found!"); // if db query is able to be made but user does not exist, this will be returned

        // comparing user input password with the user password in database
        const checkPassword = bcrypt.compareSync(req.body.password, data[0].password) // data[0] as data is an array, but there is only one user so we select the first index (user) and check the password using .password

        if (!checkPassword) return res.status(400).json("Incorrect credentials!");

        // creating JWT token, by sending user ID
        const token = jwt.sign({ id: data[0].id }, "secretkey");

        const { password, ...others } = data[0]; // seperates password from other data (so that only username, email, name will be sent)

        res.cookie("accessToken", token, {
            httpOnly: true, // means we will send and taken our cookie through websites, thus a random script cannot use our cookie
        }).status(200).json(others);
    });
};

export const logout = (req, res) => {
    // Removes cookie, removing user access until they log in(which would generate a new cookie)
    res.clearCookie("accessToken", {
        secure: true,
        sameSite: "none" // This is because our api is on port 8800 but our frontend is on port 3000, this prevents our cookie requests from being blocked
    }).status(200).json("User has been logged out!")
};