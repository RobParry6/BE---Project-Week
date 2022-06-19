const { fetchUsers, fetchUser } = require("../models");

exports.getUsers = (request, response, next) => {
  fetchUsers().then((users) => {
    response.status(200).send({ users });
  });
};

exports.getUser = (request, response, next) => {
  const { username } = request.params;
  fetchUser(username).then((user) => {
    response.status(200).send({ user });
  });
};
