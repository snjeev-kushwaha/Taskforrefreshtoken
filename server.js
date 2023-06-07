const express = require("express");
require("dotenv").config();
const app = express();
app.use(express.json());

const { userRoute } = require("./routes/userRoutes");
app.use("/api/v1", userRoute);

app.listen(process.env.PORT, (err) => {
  console.log(`Server is started on port http://localhost:${process.env.PORT}`);
});
