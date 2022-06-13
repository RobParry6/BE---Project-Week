<p align="center" style="color:orange;font-weight:600;font-size:32px">
    Funbelievable Reviews API
</p>

## About this Project

This project is a collection of endpoints to access a database that stores information for the application Funbelivable Reviews!, a board game based review platform where users can create reviews about their favourite board games and where other users will then be able to view, comment on and vote on them.

### Available Endpoints

THe list of endpoints for this project are as follows:

#### GET Method

**/api**

Returns a JSON object with a list of all the endpoints with their available parameters, queries and an example of any returning data.

**/api/reviews**

Returns an array of all of the reviews in the database. This can be filtered, sorted and ordered depending on additional queries.

**/api/reviews/:review_id**

- /api/reviews/:review_id/comments
- /api/categories
- /api/users

#### PATCH Method

- /api/reviews/:reviews

#### POST Method

- /api/reviews/:review_id/comments

#### DELETE Method

- /api/comments/:comment_id

## Installing Necassary Files for Running

Before using this repository, a few files will need to be created in order for it to work. In order for the databases to be seeded properly, .env.test and env.development should be created and populated in the root directory of the project in order to set the ENV enviroment.

The contents of .env. files should be comparable to that found in the .enx-example.

Once these files have been created, make sure that they are not being commited to the overall project by checking the the .gitignore and ensuring that the .env.\* is present in that file.
