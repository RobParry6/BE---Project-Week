const express = require("express");
const {
  invalidEndpoint,
  invalidNumberRequest,
  invalidUserError,
  internalServerError,
  psqlError,
} = require("./controllers/error-handler-controller");
const apiRouter = require("./routes/api-router");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.get("/*", invalidEndpoint);
app.use(invalidNumberRequest);
app.use(invalidUserError);
app.use(psqlError);
app.use(internalServerError);

module.exports = app;
