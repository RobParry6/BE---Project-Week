const db = require("../../db/connection");
const request = require("supertest");
const app = require("../../app/app");
const testData = require("../../db/data/test-data");
const seed = require("../../db/seeds/seed");
const endpointObject = require("../../endpoints.json");

beforeAll(() => {
  return seed(testData);
});

afterAll(() => {
  db.end();
});

describe("404: /Invalid Endpoint", () => {
  test("404: Should return a status code of 404 when an incorrect endpoint is asked for", () => {
    return request(app)
      .get("/api/wrong_path")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Route Not Found");
      });
  });
});

describe("Categories", () => {
  describe("GET: /api/categories", () => {
    test("200: should return a status code of 200 and an array of objects with properties slug and descruption on them", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body: { categories } }) => {
          expect(categories).toBeInstanceOf(Array);
          expect(categories).toHaveLength(4);
          categories.forEach((category) => {
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            });
          });
        });
    });
  });
});

describe("Reviews", () => {
  describe("POST: /api/reviews/:review_id/comments", () => {
    test("201: Should return a status code of 201, sucessfully post an object to the database and return the post", () => {
      const newPost = { user_name: "bainesface", body: "A timeless classic!" };

      return request(app)
        .post("/api/reviews/13/comments")
        .send(newPost)
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment).toEqual(
            expect.objectContaining({
              body: "A timeless classic!",
              votes: 0,
              author: "bainesface",
              review_id: 13,
              created_at: expect.any(String),
            })
          );
        });
    });

    test("400: Should return a status code of 400 when not all of the necessary keys on the posting comment", () => {
      const newPost = { user_name: "bainesface" };

      return request(app)
        .post("/api/reviews/13/comments")
        .send(newPost)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe(
            "Bad Request, Very Bad Request! (Invalid Request)"
          );
        });
    });

    test("404: Should return a status code of 404 when an invalid review_id number is requested", () => {
      const newPost = { user_name: "bainesface", body: "A timeless classic!" };

      return request(app)
        .post("/api/reviews/20000/comments")
        .send(newPost)
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("Requested Item Not Found Within the Database");
        });
    });

    test("404: Should return a status code of 404 when the user requesting the post does not exist in the data base", () => {
      const newPost = { user_name: "zxybeast", body: "One of the greats!" };

      return request(app)
        .post("/api/reviews/13/comments")
        .send(newPost)
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe(
            "Who?! Not sure who you mean! (Route not found: Invalid User)"
          );
        });
    });
  });

  describe("GET: /api/reviews/:review_id/comments", () => {
    test("200: Should return a status code of 200 and an array of comments for the given review", () => {
      return request(app)
        .get("/api/reviews/3/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toBeInstanceOf(Array);
          expect(comments).toHaveLength(3);
          comments.forEach((comment) => {
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              review_id: expect.any(Number),
            });
          });
        });
    });

    test("404: Should return a status code of 404 when a valid number is passed into the parameter but does not match a valid ID", () => {
      return request(app)
        .get("/api/reviews/20000/comments")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("Requested Item Not Found Within the Database");
        });
    });

    test("200: Should return a status code of 200 when a valid number is passed but has no comments", () => {
      return request(app)
        .get("/api/reviews/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toBeInstanceOf(Array);
          expect(comments).toHaveLength(0);
        });
    });

    test("400: Should return a status code of 400 when an incorrect data type is passed into the endpoint", () => {
      return request(app)
        .get("/api/reviews/coolio/comments")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe(
            "Bad Request, Very Bad Request! (Invalid Request)"
          );
        });
    });
  });

  describe("GET: /api/reviews/:review_id", () => {
    test("200: should return a status code of 200 and an object of the requested review to the /api/reviews/:review_id endpoint", () => {
      return request(app)
        .get("/api/reviews/3")
        .expect(200)
        .then(({ body: { review } }) => {
          expect.objectContaining({
            review_id: 3,
            title: "Ultimate Werewolf",
            designer: "Akihisa Okui",
            owner: "bainesface",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            review_body: "We couldn't find the werewolf!",
            category: "social deduction",
            created_at: "2021-01-18T10:01:41.251Z",
            votes: 5,
          });
        });
    });

    test("200: the returning object should have a comment_count property that references the comments data", () => {
      return request(app)
        .get("/api/reviews/3")
        .expect(200)
        .then(
          ({
            body: {
              review: { comment_count },
            },
          }) => {
            expect(comment_count).toBe(3);
          }
        );
    });

    test("404: should return a status code of 404 when an incorrect path is asked for", () => {
      return request(app)
        .get("/api/reviews/20000")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("Requested Item Not Found Within the Database");
        });
    });

    test("400: should return a status of 400 when an invalid request is asked", () => {
      return request(app)
        .get("/api/reviews/coolio")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe(
            "Bad Request, Very Bad Request! (Invalid Request)"
          );
        });
    });
  });

  describe("PATCH: /api/reviews/:review_id", () => {
    test("201: Should return status code of 201 when a sucessful patch request is made to the review endpoint. Should send an object with a property of inc_votes with increments the votes by the desired amount", () => {
      const incVotes = { inc_votes: 1 };
      const expexcted = {
        review_id: 3,
        title: "Ultimate Werewolf",
        designer: "Akihisa Okui",
        owner: "bainesface",
        review_img_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        review_body: "We couldn't find the werewolf!",
        category: "social deduction",
        created_at: "2021-01-18T10:01:41.251Z",
        votes: 6,
      };

      return request(app)
        .patch("/api/reviews/3")
        .send(incVotes)
        .expect(201)
        .then(({ body: { review } }) => {
          expect(review).toEqual(expect.objectContaining(expexcted));
        });
    });

    test("404: Should return a status code of 404 when a valid number is requested but no review is found", () => {
      const incVotes = { inc_votes: 1 };

      return request(app)
        .patch("/api/reviews/20000")
        .send(incVotes)
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("Requested Item Not Found Within the Database");
        });
    });

    test("400: Should return a status of 400 when an invalid request is asked", () => {
      const incVotes = { inc_votes: 1 };

      return request(app)
        .patch("/api/reviews/coolio")
        .send(incVotes)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe(
            "Bad Request, Very Bad Request! (Invalid Request)"
          );
        });
    });

    test("400: Should return a status of 400 when an invalid request is asked", () => {
      const incVotes = { inc_votes: "coolio" };

      return request(app)
        .patch("/api/reviews/3")
        .send(incVotes)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe(
            "Bad Request, Very Bad Request! (Invalid Request)"
          );
        });
    });
  });

  describe("GET: /api/reviews?query", () => {
    describe("200", () => {
      test("200: Should return a status code of 200 and sort the returned array of reviews by the desired key, in this case TITLE", () => {
        return request(app)
          .get("/api/reviews?sort_by=title")
          .expect(200)
          .then(({ body: { reviews } }) => {
            expect(reviews).toBeSorted({ key: "title", descending: true });
            expect(reviews[0].title).toBe("Ultimate Werewolf");
            expect(reviews[12].title).toBe(
              "A truly Quacking Game; Quacks of Quedlinburg"
            );
          });
      });

      test("200: Should return a status code of 200 and sort the returned array of reviews by the desired key, in this case DESIGNER", () => {
        return request(app)
          .get("/api/reviews?sort_by=designer")
          .expect(200)
          .then(({ body: { reviews } }) => {
            expect(reviews).toBeSorted({ key: "designer", descending: true });
            expect(reviews[0].designer).toBe("Wolfgang Warsch");
            expect(reviews[12].designer).toBe("Akihisa Okui");
          });
      });

      test("200: Should return a status code of 200 and sort the returned array of reviews by the desired key, in this case OWNER", () => {
        return request(app)
          .get("/api/reviews?sort_by=owner")
          .expect(200)
          .then(({ body: { reviews } }) => {
            expect(reviews).toBeSorted({ key: "owner", descending: true });
            expect(reviews[0].owner).toBe("philippaclaire9");
            expect(reviews[12].owner).toBe("bainesface");
          });
      });

      test("200: Should return a status code of 200 and sort the returned array of reviews by the desired key, in this case CATEGORY", () => {
        return request(app)
          .get("/api/reviews?sort_by=category")
          .expect(200)
          .then(({ body: { reviews } }) => {
            expect(reviews).toBeSorted({ key: "category", descending: true });
            expect(reviews[0].category).toBe("social deduction");
            expect(reviews[12].category).toBe("dexterity");
          });
      });

      test("200: Should return a status code of 200 and should return the ordered array in ascending ORDER", () => {
        return request(app)
          .get("/api/reviews?order=asc")
          .expect(200)
          .then(({ body: { reviews } }) => {
            expect(reviews).toBeSorted({
              key: "created_at",
              descending: false,
            });
            expect(reviews[0].created_at).toBe("1970-01-10T02:08:38.400Z");
            expect(reviews[12].created_at).toBe("2021-01-25T11:16:54.963Z");
          });
      });

      test("200: Should return a status code of 200 and sort and return the ordered array in ascending order by TITLE", () => {
        return request(app)
          .get("/api/reviews?sort_by=title&order=asc")
          .expect(200)
          .then(({ body: { reviews } }) => {
            expect(reviews).toBeSorted({ key: "title", descending: false });
            expect(reviews[0].title).toBe(
              "A truly Quacking Game; Quacks of Quedlinburg"
            );
            expect(reviews[12].title).toBe("Ultimate Werewolf");
          });
      });

      test("200: Should return a status code of 200 and sort and return the ordered array in ascending order by DESIGNER", () => {
        return request(app)
          .get("/api/reviews?sort_by=designer&order=asc")
          .expect(200)
          .then(({ body: { reviews } }) => {
            expect(reviews).toBeSorted({ key: "designer", descending: false });
            expect(reviews[0].designer).toBe("Akihisa Okui");
            expect(reviews[12].designer).toBe("Wolfgang Warsch");
          });
      });

      test("200: Should return a status code of 200 and sort and return the ordered array in ascending order by OWNER", () => {
        return request(app)
          .get("/api/reviews?sort_by=owner&order=asc")
          .expect(200)
          .then(({ body: { reviews } }) => {
            expect(reviews).toBeSorted({ key: "owner", descending: false });
            expect(reviews[0].owner).toBe("bainesface");
            expect(reviews[12].owner).toBe("philippaclaire9");
          });
      });

      test("200: Should return a status code of 200 and sort and return the ordered array in ascending order by CATEGORY", () => {
        return request(app)
          .get("/api/reviews?sort_by=category&order=asc")
          .expect(200)
          .then(({ body: { reviews } }) => {
            expect(reviews).toBeSorted({ key: "category", descending: false });
            expect(reviews[0].category).toBe("dexterity");
            expect(reviews[12].category).toBe("social deduction");
          });
      });

      test("200: Should return a code of 200 and return a filtered array of the desired category", () => {
        return request(app)
          .get("/api/reviews?category=social+deduction")
          .expect(200)
          .then(({ body: { reviews } }) => {
            reviews.forEach((review) => {
              expect(review.category).toBe("social deduction");
            });
          });
      });

      test("200: SHould return a sataus code of 200 when all the queries are asked for", () => {
        return request(app)
          .get("/api/reviews?sort_by=title&order=asc&category=social+deduction")
          .expect(200)
          .then(({ body: { reviews } }) => {
            expect(reviews).toBeSorted({ key: "title", descending: false });
            expect(reviews[0].title).toBe(
              "A truly Quacking Game; Quacks of Quedlinburg"
            );
            expect(reviews[10].title).toBe("Ultimate Werewolf");
          });
      });
    });

    test("400: should return a status code of 400 when a user tries to enter a non-valid sort_by query", () => {
      return request(app)
        .get("/api/reviews?sort_by=coolio")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe(
            "Bad Request, Very Bad Request! (Invalid Request)"
          );
        });
    });

    test("400: should return a status code of 400 when a user tries to enter a non-valid order query", () => {
      return request(app)
        .get("/api/reviews?order=coolio")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe(
            "Bad Request, Very Bad Request! (Invalid Request)"
          );
        });
    });

    test("404: should return a status code of 400 when a user tries to enter a non-existant category", () => {
      return request(app)
        .get("/api/reviews?category=coolio")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("Requested Item Not Found Within the Database");
        });
    });
  });

  describe("GET: /api/reviews", () => {
    test("200: should return a status code of 200 and an array of the reviews when the /api/review is called", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeInstanceOf(Array);
          expect(reviews).toHaveLength(13);
          expect(reviews).toBeSorted({ key: "created_at", descending: true });
          expect(reviews[3]).toEqual(
            expect.objectContaining({
              title: "Build you own tour de Yorkshire",
              designer: "Asger Harding Granerud",
              owner: "mallionaire",
              review_img_url:
                "https://images.pexels.com/photos/258045/pexels-photo-258045.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
              review_body:
                "Cold rain pours on the faces of your team of cyclists, you pulled to the front of the pack early and now your taking on exhaustion cards like there is not tomorrow, you think there are about 2 hands left until you cross the finish line, will you draw enough from your deck to cross before the other team shoot passed? Flamee Rouge is a Racing deck management game where you carefully manage your deck in order to cross the line before your opponents, cyclist can fall slyly behind front runners in their slipstreams to save precious energy for the prefect moment to burst into the lead ",
              category: "social deduction",
              created_at: "2021-01-18T10:01:41.251Z",
              votes: 10,
              review_id: 10,
              comment_count: 0,
            })
          );
          reviews.forEach((review) => {
            expect.objectContaining({
              review_id: expect.any(Number),
              title: expect.any(String),
              designer: expect.any(String),
              owner: expect.any(String),
              review_img_url: expect.any(String),
              review_body: expect.any(String),
              category: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            });
          });
        });
    });
  });

  describe("POST: /api/reviews", () => {
    test("201: Should return a status code of 201 and create a new review entry when the endpoint is called.", () => {
      const newReview = {
        title: "Mysterium",
        designer: "Oleksandr Nevskiy/Oleg Sidorenko",
        owner: "philippaclaire9",
        review_img_url:
          "https://upload.wikimedia.org/wikipedia/en/thumb/5/5e/Mysterium_board_game_cover.jpg/220px-Mysterium_board_game_cover.jpg",
        review_body:
          "It's interesting to see everybodies interpretations of the images",
        category: "euro game",
      };

      const createdReview = {
        title: "Mysterium",
        designer: "Oleksandr Nevskiy/Oleg Sidorenko",
        owner: "philippaclaire9",
        review_img_url:
          "https://upload.wikimedia.org/wikipedia/en/thumb/5/5e/Mysterium_board_game_cover.jpg/220px-Mysterium_board_game_cover.jpg",
        review_body:
          "It's interesting to see everybodies interpretations of the images",
        category: "euro game",
        review_id: 14,
        votes: 0,
        comment_count: 0,
        created_at: expect.any(String),
      };

      return request(app)
        .post("/api/reviews")
        .send(newReview)
        .expect(201)
        .then(({ body: { review } }) => {
          expect(review).toEqual(
            expect.objectContaining({
              title: "Mysterium",
              designer: "Oleksandr Nevskiy/Oleg Sidorenko",
              owner: "philippaclaire9",
              review_img_url:
                "https://upload.wikimedia.org/wikipedia/en/thumb/5/5e/Mysterium_board_game_cover.jpg/220px-Mysterium_board_game_cover.jpg",
              review_body:
                "It's interesting to see everybodies interpretations of the images",
              category: "euro game",
              review_id: 14,
              votes: 0,
              comment_count: 0,
              created_at: expect.any(String),
            })
          );
        });
    });

    test("400: Should return a code of 400 when the not all of the fields are correct or missing", () => {
      const newReview = {
        designer: "Oleksandr Nevskiy/Oleg Sidorenko",
        review_img_url:
          "https://upload.wikimedia.org/wikipedia/en/thumb/5/5e/Mysterium_board_game_cover.jpg/220px-Mysterium_board_game_cover.jpg",
        review_body:
          "It's interesting to see everybodies interpretations of the images",
        category: "deck building",
      };

      return request(app)
        .post("/api/reviews")
        .send(newReview)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe(
            "Bad Request, Very Bad Request! (Invalid Request)"
          );
        });
    });
  });
});

describe("Users", () => {
  describe("GET: /api/users", () => {
    test("200: Should return a status code of 200 and an array of objects containing user data", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users).toHaveLength(4);
          expect(users).toBeInstanceOf(Array);
          users.forEach((user) => {
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
        });
    });
  });

  describe("GET: /api/users/:username", () => {
    test("200: Should return a user object of the required user and a status code of 200 when a correct username is called.", () => {
      return request(app)
        .get("/api/users/bainesface")
        .expect(200)
        .then(({ body: { user } }) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: "bainesface",
              name: "sarah",
              avatar_url:
                "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
            })
          );
        });
    });

    test("404: should return a status code of 404 when an incorrect path is asked for", () => {
      return request(app)
        .get("/api/users/20000")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("Requested Item Not Found Within the Database");
        });
    });
  });
});

describe("Comments", () => {
  describe("DELETE: /api/comments/:comment_id", () => {
    test("204: Should return a status of 204 and delete the comment at the specific comment_id", () => {
      return request(app)
        .delete("/api/comments/3")
        .expect(204)
        .then(() => {
          return db.query(`SELECT * FROM comments WHERE comment_id = 3`);
        })
        .then(({ rows }) => {
          expect(rows).toHaveLength(0);
        });
    });

    test("400: Should return a status code of 404 when the comment_id in the path isn't a number", () => {
      return request(app)
        .delete("/api/comments/coolio")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe(
            "Bad Request, Very Bad Request! (Invalid Request)"
          );
        });
    });

    test("404: Should return a status code of 404 when the comment_id in the path isn't a number", () => {
      return request(app)
        .delete("/api/comments/20000")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("Requested Item Not Found Within the Database");
        });
    });
  });

  describe("PATCH: /api/comments/:comment_id", () => {
    const incVotes = { inc_votes: 1 };

    test("201: Should return status code of 201 when a sucessful patch request is made to the review endpoint. Should send an object with a property of inc_votes with increments the votes by the desired amount", () => {
      const expexcted = {
        body: "I loved this game too!",
        votes: 17,
        author: "bainesface",
        review_id: 2,
        created_at: "2017-11-22T12:43:33.389Z",
      };

      return request(app)
        .patch("/api/comments/1")
        .send(incVotes)
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment).toEqual(expect.objectContaining(expexcted));
        });
    });

    test("404: SHould return a status of 404 when an incorrect comment id is requested", () => {
      return request(app)
        .patch("/api/comments/20000")
        .send(incVotes)
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("Requested Item Not Found Within the Database");
        });
    });

    test("400: Should return a status code of 400 when anything but a number is called at the endpoint", () => {
      return request(app)
        .patch("/api/comments/coolio")
        .send(incVotes)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe(
            "Bad Request, Very Bad Request! (Invalid Request)"
          );
        });
    });

    test("400: Should return a status code of 400 when anything but a number is sent to the endpoint on the body", () => {
      const incWrongVotes = { inc_votes: "coolio" };

      return request(app)
        .patch("/api/comments/1")
        .send(incWrongVotes)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe(
            "Bad Request, Very Bad Request! (Invalid Request)"
          );
        });
    });
  });
});

describe("GET /api", () => {
  test("200: Should return a status of 200 and a JSON object when the /api endpoint is called", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endpointObject);
      });
  });
});
