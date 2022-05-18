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

describe("GET: /api/reviews", () => {
  test("200: should return a status code of 200 and an array of the reviews when the /api/review is called", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body: { reviews } }) => {
        console.log(reviews);
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
        expect(review).toEqual(expexcted);
      });
  });

  test("404: SHould return a status code of 404 when a valid number is requested but no review is found", () => {
    const incVotes = { inc_votes: 1 };

    return request(app)
      .patch("/api/reviews/20000")
      .send(incVotes)
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Requested Item Not Found Within the Database");
      });
  });

  test("400: should return a status of 400 when an invalid request is asked", () => {
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

  test("400: should return a status of 400 when an invalid request is asked", () => {
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
