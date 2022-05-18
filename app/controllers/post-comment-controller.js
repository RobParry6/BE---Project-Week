const { addNewComment } = require("../models");

exports.createComment = (request, response, next) => {
  const { post } = request.body;
  addNewComment(post)
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
