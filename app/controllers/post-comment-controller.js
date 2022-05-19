const { addNewComment } = require("../models");

exports.createComment = (request, response, next) => {
  const post = request.body;
  const { review_id } = request.params;
  addNewComment(post, review_id)
    .then(([comment]) => {
      response.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
