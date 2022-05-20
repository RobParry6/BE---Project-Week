const {
  fetchReview,
  fetchAllReviews,
  changeVotesProperty,
} = require("../models");

exports.getReview = (request, response, next) => {
  const { review_id } = request.params;
  fetchReview(review_id)
    .then(([review]) => {
      response.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllReviews = (request, response, next) => {
  const { sort_by, order, category } = request.query;
  fetchAllReviews(sort_by, order, category)
    .then((reviews) => {
      response.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};

exports.alterVotesCount = (request, response, next) => {
  const { review_id } = request.params;
  const { inc_votes } = request.body;
  changeVotesProperty(review_id, inc_votes)
    .then((review) => {
      response.status(201).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};
