const { fetchComments } = require("../models");

exports.getComments = (request, response, next) => {
  const { review_id } = request.params;
  fetchComments(review_id)
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
