import mysql from "mysql"

// data need to establish connection with local MySQL database
export const db = mysql.createConnection({
    host: "localhost",
    user: "root", // what the database username is
    password: "Mysql123!", // what the database password is
    database: "tharansocial" //what the database name is on mysql
})