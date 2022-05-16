const { fetchCategories, fetchReview } = require("../models/model");

exports.getCategories = (request, response) => {
  fetchCategories().then((categories) => {
    response.status(200).send({ categories });
  });
};

exports.getReview = (request, response, next) => {
  const { reviews } = request.params;
  fetchReview(reviews)
    .then((review) => {
      response.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};
