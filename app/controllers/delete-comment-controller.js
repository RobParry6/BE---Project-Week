const { removeComment } = require("../models");

exports.deleteComment = (request, response, next) => {
  const { comment_id } = request.params;
  removeComment(comment_id).then(() => {
    response.sendStatus(204);
  });
};
