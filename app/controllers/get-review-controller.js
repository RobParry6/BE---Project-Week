const { fetchReview } = require("../models");

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
