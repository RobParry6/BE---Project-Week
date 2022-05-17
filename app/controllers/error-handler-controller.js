exports.invalidEndpoint = (request, response) => {
  response.status(404).send({ message: "Route Not Found" });
};

exports.invalidNumberRequest = (err, request, response, next) => {
  if (err.status && err.message) {
    response.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
};

exports.psqlError = (err, request, response, next) => {
  if ((err.code = "22P02")) {
    response
      .status(400)
      .send({ message: "Bad Request, Very Bad Request! (Invalid Request)" });
  } else next(err);
};

exports.internalServerError = (err, request, response, next) => {
  response.status(500).send({ message: "Internal Server Error" });
};
