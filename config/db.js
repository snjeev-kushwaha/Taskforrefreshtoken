const mysql = require("mysql");

const connections = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "task1",
});

connections.connect((err) => {
  if (err) {
    console.log(err.sqlMessage);
  }
  console.log("Database is connected");
});

module.exports = { connections };
