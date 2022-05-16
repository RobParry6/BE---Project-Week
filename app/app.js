const express = require("express");
const { getCategories } = require("./controllers/controller");

const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/*", (request, response, next) => {
  response.status(404).send({ message: "Route Not Found" });
});

app.use((err, request, response, next) => {
  response.status(500).send({ message: "Internal Server Error" });
});

module.exports = { app };
