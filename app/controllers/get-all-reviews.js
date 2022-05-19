const { fetchAllReviews } = require("../models");

exports.getAllReviews = (request, response, next) => {
  fetchAllReviews().then((reviews) => {
    response.status(200).send({ reviews });
  });
};
