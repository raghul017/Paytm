const express = require("express");
const cors = require("cors");
app.use(cors());
app.use(express.json());
const app = express();

const mainRouter = require("./routes/index");

app.use("/api/vi" , mainRouter);

app.listen(3000);