const jwt = require("jsonwebtoken");

const refreshToken = async (req, res) => {
  try {
    const token = req.body.token;
    if (!token) {
      return res.status(401).json({ message: "token doesn't match" });
    }
    await jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
      if (err) {
        return res.status(403);
      }
      const accessToken = await jwt.sign(
        { email: data.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      res.status(200).json({
        success: true,
        accessToken,
      });
    });
  } catch (err) {
    res.send({ status: 400, Error: err.message });
  }
};

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["Bearer"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      res.status(401);
    }
    await jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.send({ status: 403, message: "token is not verified" });
      }
      req.user = user;
      next();
    });
  } catch (err) {
    res.send({ status: 400, Error: err.message });
  }
};

module.exports = { refreshToken, verifyToken };
