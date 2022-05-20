const { fetchComments, addNewComment, removeComment } = require("../models");

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

exports.deleteComment = (request, response, next) => {
  const { comment_id } = request.params;
  removeComment(comment_id)
    .then(() => {
      response.sendStatus(204);
    })
    .catch((err) => {
      next(err);
    });
};
