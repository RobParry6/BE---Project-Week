const db = require("../../db/connection");
const request = require("supertest");
const { app } = require("../../app/app");
const testData = require("../../db/data/test-data");
const seed = require("../../db/seeds/seed");

beforeAll(() => {
  return seed(testData);
});

afterAll(() => {
  db.end();
});

describe("404: Invalid Endpoint", () => {
  test("404: Should return a status code of 404 when an incorrect endpoint is asked for", () => {
    return request(app)
      .get("/api/wrong_path")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Route Not Found");
      });
  });
});

describe("GET: api/categories", () => {
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

describe("GET: api/reviews/:review", () => {
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
