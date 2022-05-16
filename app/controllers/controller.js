const { fetchCategories } = require("../models/model");

exports.getCategories = (request, response) => {
  fetchCategories()
    .then((categories) => {
      response.status(200).send({ categories: categories });
    })
    .catch((err) => {
      console.log(err);
    });
};
