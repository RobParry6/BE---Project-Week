const db = require("../../db/connection");
const request = require("supertest");
const app = require("../../app/app");
const testData = require("../../db/data/test-data");
const seed = require("../../db/seeds/seed");

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
          expect(reviews).toBeSorted({ key: "created_at", descending: false });
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
        expect(reviews[4]).toEqual(
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
            comment_count: 3,
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
