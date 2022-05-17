const { changeVotesProperty } = require("../models");

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
