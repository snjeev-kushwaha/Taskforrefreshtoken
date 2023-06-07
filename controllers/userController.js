const { connections } = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  try {
    const { username, email, password, status } = req.body;
    const hashPassword = await bcrypt.hashSync(password, 8);
    const data = {
      username,
      email,
      password: hashPassword,
      status,
    };
    const sqlQuery = `INSERT INTO user SET ?`;
    await connections.query(sqlQuery, data, (err, reuslt) => {
      if (err) {
        return res.send({ status: 400, Error: err.sqlMessage });
      }
      res.send({ status: 200, response: reuslt });
    });
  } catch (err) {
    res.send({ status: 400, Error: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const sqlQuery = `SELECT * FROM user WHERE email = ?`;
    await connections.query(sqlQuery, email, async (err, result) => {
      if (err) {
        return res.send({ status: 400, Error: err.message });
      }
      const data = result[0];
      const dbPassword = await bcrypt.compare(password, data.password);
      if (!dbPassword) {
        return res
          .status(400)
          .json({ status: 400, message: "password doesn't match" });
      }
      const token = jwt.sign(
        { username: data.username, email: data.email, status: data.status },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
      res.status(200).json({
        success: true,
        token,
        result,
      });
    });
  } catch (err) {
    return res.send({ status: 400, Error: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const sqlQuery = `SELECT * FROM user`;
    await connections.query(sqlQuery, (err, result) => {
      if (err) {
        return res.send({ status: 400, Error: err.message });
      }
      res.send({ status: 200, response: result });
    });
  } catch (err) {
    res.send({ status: 400, Error: err.message });
  }
};

module.exports = { createUser, loginUser, getAllUsers };
