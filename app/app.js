const express = require("express");
const { getCategories, getReview } = require("./controllers");

const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews/:reviews", getReview);

app.get("/*", (request, response) => {
  response.status(404).send({ message: "Route Not Found" });
});

app.use((err, request, response, next) => {
  if (err.status && err.message) {
    response.status(err.status).send({ message: err.message });
  } else next(err);
});

app.use((err, request, response, next) => {
  if ((err.code = "22P02")) {
    response
      .status(400)
      .send({ message: "Bad Request, Very Bad Request! (Invalid Request)" });
  } else next(err);
});

app.use((err, request, response, next) => {
  response.status(500).send({ message: "Internal Server Error" });
});

module.exports = { app };
