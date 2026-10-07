/**
 * Farmisto API Integration Test Suite
 *
 * Uses supertest to test all API endpoints without a real DB connection.
 * Mocks mongoose to avoid needing a live MongoDB instance in CI.
 *
 * Run: npm test
 */

const request = require("supertest");
const express = require("express");

// ─── Minimal Express app for testing (mirrors server.js without DB) ─────────
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mockLeanQuery = (value) => ({
  lean: jest.fn().mockResolvedValue(value),
});

// ─── Mock middleware ─────────────────────────────────────────────────────────
jest.mock("../config/cloudinary", () => () => {});
jest.mock("../middleware/TokenAuth", () => ({
  GenerateToken: () => "mock.jwt.token",
  getJwtSecret: jest.fn(),
  verifyToken: () => ({ id: "mockUserId", email: "test@farm.com", name: "Test Farmer", tokenVersion: 0 }),
}));

// ─── Mock all Mongoose models ────────────────────────────────────────────────
jest.mock("../models/Farmer", () => {
  const mockFarmer = {
    _id: "farmerId123",
    farmerName: "Test Farmer",
    farmerEmail: "farmer@test.com",
    farmerPassword: "$2a$10$mockHash",
    farmerLocation: { latitude: 12.97, longitude: 77.59 },
    save: jest.fn().mockResolvedValue(true),
  };
  const Model = jest.fn().mockImplementation(() => mockFarmer);
  Model.findOne = jest.fn().mockResolvedValue(null);
  Model.findById = jest.fn().mockResolvedValue(null);
  Model.create = jest.fn().mockResolvedValue(mockFarmer);
  return Model;
});
jest.mock("../models/User", () => {
  const mockUser = {
    _id: "mockUserId",
    userName: "Test User",
    email: "user@test.com",
    password: "$2a$10$mockHash",
    role: "farmer",
    tokenVersion: 0,
    toObject: jest.fn(function () {
      const { toObject, ...user } = this;
      return user;
    }),
  };
  const Model = jest.fn().mockImplementation(() => mockUser);
  Model.findOne = jest.fn(() => ({ lean: jest.fn().mockResolvedValue(null) }));
  Model.findById = jest.fn().mockResolvedValue(mockUser);
  Model.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUser);
  Model.create = jest.fn().mockResolvedValue(mockUser);
  Model.countDocuments = jest.fn().mockResolvedValue(0);
  return Model;
});
jest.mock("../models/Market", () => {
  const Model = jest.fn();
  Model.find = jest.fn(() => {
    const query = {
      sort: jest.fn(),
      skip: jest.fn(),
      limit: jest.fn(),
      lean: jest.fn().mockResolvedValue([]),
    };
    query.sort.mockReturnValue(query);
    query.skip.mockReturnValue(query);
    query.limit.mockReturnValue(query);
    return query;
  });
  Model.countDocuments = jest.fn().mockResolvedValue(0);
  Model.distinct = jest.fn().mockResolvedValue([]);
  Model.findByIdAndDelete = jest.fn().mockResolvedValue({ _id: "item1" });
  Model.create = jest.fn().mockResolvedValue({ _id: "item1", itemName: "Tomato" });
  return Model;
});
jest.mock("../models/Cart", () => {
  const Model = jest.fn();
  Model.find = jest.fn().mockResolvedValue([]);
  Model.deleteMany = jest.fn().mockResolvedValue({ deletedCount: 1 });
  Model.findByIdAndUpdate = jest.fn().mockResolvedValue({ _id: "cart1", quantity: 2 });
  Model.findByIdAndDelete = jest.fn().mockResolvedValue({ _id: "cart1" });
  Model.create = jest.fn().mockResolvedValue({ _id: "cart1", itemName: "Tomato" });
  return Model;
});
jest.mock("../models/Payment", () => {
  const Model = jest.fn();
  Model.find = jest.fn().mockResolvedValue([]);
  Model.findByIdAndUpdate = jest.fn().mockResolvedValue({ _id: "pay1", orderStatus: "Processing" });
  Model.findOneAndUpdate = jest.fn().mockResolvedValue({ _id: "pay1", orderStatus: "Processing" });
  Model.create = jest.fn().mockResolvedValue({ _id: "pay1", totalAmount: 200 });
  return Model;
});
jest.mock("../models/PromoCode", () => {
  const Model = jest.fn();
  Model.find = jest.fn().mockResolvedValue([{ code: "SAVE10", discountPercentage: 10 }]);
  Model.findOne = jest.fn().mockResolvedValue(null);
  Model.findByIdAndDelete = jest.fn().mockResolvedValue({ _id: "promo1" });
  Model.create = jest.fn().mockResolvedValue({ _id: "promo1", code: "SAVE10" });
  return Model;
});
jest.mock("../models/Feedback", () => ({
  create: jest.fn().mockResolvedValue({ _id: "feedback1" }),
  countDocuments: jest.fn().mockResolvedValue(0),
  deleteMany: jest.fn().mockResolvedValue({ deletedCount: 0 }),
}));
jest.mock("../middleware/hashing", () => ({
  hashPassword: jest.fn(async (p) => "$2a$10$mockhash" + p),
  comparePassword: jest.fn(async () => false), // default: wrong password
}));
jest.mock("../controllers/GeoController", () => ({
  fetchLocation: jest.fn().mockResolvedValue([{ formatted_address: "123 Street, City, State 12345, Country" }]),
  fetchNearbyFarmers: jest.fn(async (req, res) => res.status(200).json({ farmers: [] })),
}));

// ─── Mount routes ─────────────────────────────────────────────────────────────
const farmerRoutes = require("../routes/FarmerRoutes");
const userRoutes = require("../routes/userRoutes");
const marketRoutes = require("../routes/MarketRoutes");
const cartRoutes = require("../routes/cartRoutes");
const paymentRoutes = require("../routes/PaymentRoutes");
const promoRoutes = require("../routes/PromoRoutes");

app.use("/farmer", farmerRoutes);
app.use("/user", userRoutes);
app.use("/market", marketRoutes);
app.use("/cart", cartRoutes);
app.use("/payments", paymentRoutes);
app.use("/promo", promoRoutes);

// ─── Auth header helper ───────────────────────────────────────────────────────
const AUTH_HEADER = { Authorization: "Bearer mock.jwt.token" };

// ─── FARMER AUTH TESTS ────────────────────────────────────────────────────────
describe("Farmer Auth", () => {
  const User = require("../models/User");

  test("POST /farmer/register — missing fields → 400", async () => {
    const res = await request(app).post("/user/register").send({ email: "a@b.com", role: "farmer" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  test("POST /farmer/register — duplicate email → 400", async () => {
    User.findOne.mockReturnValueOnce(mockLeanQuery({ email: "farmer@test.com" }));
    const res = await request(app).post("/user/register").send({
      userName: "Test", email: "farmer@test.com", password: "Pass1234", role: "farmer",
      userLocation: { latitude: 12.97, longitude: 77.59 },
    });
    expect(res.statusCode).toBe(409);
    expect(res.body.message).toMatch(/already exists/i);
  });

  test("POST /farmer/register — valid → 201", async () => {
    User.findOne.mockReturnValueOnce(mockLeanQuery(null));
    const res = await request(app).post("/user/register").send({
      userName: "New Farmer", email: "new@farm.com", password: "Pass1234", role: "farmer",
      userLocation: { latitude: 12.97, longitude: 77.59 },
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message");
    expect(res.body.redirect).toBe("/farmer/dashboard");
  });

  test("POST /farmer/login — user not found → 400", async () => {
    User.findOne.mockReturnValueOnce(mockLeanQuery(null));
    const res = await request(app).post("/user/login").send({ email: "unknown@farm.com", password: "pass" });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/invalid email or password/i);
  });

  test("POST /farmer/login — wrong password → 400", async () => {
    const { comparePassword } = require("../middleware/hashing");
    User.findOne.mockReturnValueOnce(mockLeanQuery({ email: "farmer@test.com", password: "$2a$10$hash", role: "farmer" }));
    comparePassword.mockResolvedValueOnce(false);
    const res = await request(app).post("/user/login").send({ email: "farmer@test.com", password: "wrong" });
    expect(res.statusCode).toBe(401);
  });

  test("POST /farmer/login — valid → 200 with token", async () => {
    const { comparePassword } = require("../middleware/hashing");
    User.findOne.mockReturnValueOnce(mockLeanQuery({ email: "farmer@test.com", password: "$2a$10$hash", role: "farmer" }));
    comparePassword.mockResolvedValueOnce(true);
    const res = await request(app).post("/user/login").send({ email: "farmer@test.com", password: "Pass123" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.redirect).toBe("/farmer/dashboard");
  });
});

// ─── USER AUTH TESTS ──────────────────────────────────────────────────────────
describe("User Auth", () => {
  const User = require("../models/User");

  test("POST /user/register — missing fields → 400", async () => {
    const res = await request(app).post("/user/register").send({ email: "u@t.com" });
    expect(res.statusCode).toBe(400);
  });

  test("POST /user/register — duplicate → 400", async () => {
    User.findOne.mockReturnValueOnce(mockLeanQuery({ email: "user@test.com" }));
    const res = await request(app).post("/user/register").send({ userName: "U", email: "user@test.com", password: "password123" });
    expect(res.statusCode).toBe(409);
    expect(res.body.message).toMatch(/already exists/i);
  });

  test("POST /user/register — valid → 201", async () => {
    User.findOne.mockReturnValueOnce(mockLeanQuery(null));
    const res = await request(app).post("/user/register").send({ userName: "NUser", email: "new@user.com", password: "Pass1234" });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
  });

  test("POST /user/login — user not found → 400", async () => {
    User.findOne.mockReturnValueOnce(mockLeanQuery(null));
    const res = await request(app).post("/user/login").send({ email: "x@y.com", password: "pass" });
    expect(res.statusCode).toBe(401);
  });

  test("POST /user/login — valid → 200 with token", async () => {
    const { comparePassword } = require("../middleware/hashing");
    User.findOne.mockReturnValueOnce(mockLeanQuery({ email: "user@test.com", password: "$2a$10$hash" }));
    comparePassword.mockResolvedValueOnce(true);
    const res = await request(app).post("/user/login").send({ email: "user@test.com", password: "Pass123" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("POST /user/login — missing JWT secret returns a safe configuration error", async () => {
    const { getJwtSecret } = require("../middleware/TokenAuth");
    const errorLog = jest.spyOn(console, "error").mockImplementation(() => {});
    getJwtSecret.mockImplementationOnce(() => {
      throw Object.assign(new Error("JWT_SECRET is not configured"), { code: "JWT_SECRET_MISSING" });
    });
    const res = await request(app).post("/user/login").send({ email: "user@test.com", password: "Pass123" });
    errorLog.mockRestore();
    expect(res.statusCode).toBe(503);
    expect(res.body.message).toMatch(/temporarily unavailable/i);
    expect(res.body).not.toHaveProperty("error");
  });

  test("POST /user/logout — invalidates the current token version", async () => {
    const res = await request(app).post("/user/logout").set(AUTH_HEADER);
    expect(res.statusCode).toBe(200);
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith("mockUserId", { $inc: { tokenVersion: 1 } });
  });

  test("GET /user/get-user/:id — does not allow reading another user's profile", async () => {
    const res = await request(app).get("/user/get-user/some-other-user").set(AUTH_HEADER);
    expect(res.statusCode).toBe(403);
  });

  test("GET /farmer/dashboard — requires farmer role", async () => {
    const User = require("../models/User");
    User.findById.mockResolvedValueOnce({
      _id: "mockUserId",
      email: "user@test.com",
      userName: "Test User",
      role: "consumer",
      tokenVersion: 0,
    });
    const res = await request(app).get("/farmer/dashboard").set(AUTH_HEADER);
    expect(res.statusCode).toBe(403);
  });

  test("POST /farmer/support/feedback — stores only the authenticated user's feedback", async () => {
    const Feedback = require("../models/Feedback");
    const res = await request(app)
      .post("/farmer/support/feedback")
      .set(AUTH_HEADER)
      .send({ feedback: "  Please add more local produce.  " });
    expect(res.statusCode).toBe(200);
    expect(Feedback.create).toHaveBeenCalledWith({
      user: "mockUserId",
      message: "Please add more local produce.",
    });
  });
});

// ─── MARKET TESTS ─────────────────────────────────────────────────────────────
describe("Market", () => {
  const Market = require("../models/Market");

  test("GET /market/get-items — public, no auth → 200", async () => {
    const query = {
      sort: jest.fn(),
      skip: jest.fn(),
      limit: jest.fn(),
      lean: jest.fn().mockResolvedValue([]),
    };
    query.sort.mockReturnValue(query);
    query.skip.mockReturnValue(query);
    query.limit.mockReturnValue(query);
    Market.find.mockReturnValueOnce(query);
    query.lean.mockResolvedValueOnce([{
      _id: "item1",
      itemName: "Tomato",
      itemType: "All",
      seller: { id: "farmer1", name: "Demo Farmer", email: "private@example.invalid" },
    }]);
    const res = await request(app).get("/market/get-items");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body.items[0].seller).toEqual({ name: "Demo Farmer" });
    expect(res.body.items[0].itemType).toBe("Daily");
  });

  test("GET /market/get-items — legacy listings get accurate types and product images", async () => {
    const { LEGACY_CATEGORY_IMAGES } = require("../utils/productImages");
    const query = {
      sort: jest.fn(),
      skip: jest.fn(),
      limit: jest.fn(),
      lean: jest.fn().mockResolvedValue([{
        _id: "item2",
        itemName: "Guava",
        itemType: "All",
        itemImage: [...LEGACY_CATEGORY_IMAGES][0],
        itemCategory: "Fruits",
        seller: { id: "farmer1", name: "Demo Farmer" },
      }]),
    };
    query.sort.mockReturnValue(query);
    query.skip.mockReturnValue(query);
    query.limit.mockReturnValue(query);
    Market.find.mockReturnValueOnce(query);
    Market.countDocuments.mockResolvedValueOnce(1);

    const res = await request(app).get("/market/get-items");

    expect(res.statusCode).toBe(200);
    expect(res.body.items[0].itemType).toBe("Seasonal");
    expect(res.body.items[0].itemImage).toContain("Fresh_Guava.jpg");
  });

  test("product image mapping uses real photos and has no generated illustration fallback", () => {
    const { getProductImage, getDisplayProductImage } = require("../utils/productImages");

    const image = getProductImage("Fenugreek Seeds");

    expect(image).toBe("https://www.themealdb.com/images/ingredients/Fenugreek.png");
    expect(getProductImage("Fox Nuts (Makhana)")).toBeNull();
    expect(getProductImage("Horse Gram")).toContain("Horse_Gram_Seeds.jpg");
    expect(getProductImage("Khoya")).toBeNull();
    expect(getProductImage("Coriander Powder")).toBeNull();
    expect(getDisplayProductImage("Khoya", "https://www.themealdb.com/images/ingredients/Paneer.png")).toBe("");
  });

  test("product name variants reuse the same curated image", () => {
    const { getProductImage } = require("../utils/productImages");

    expect(getProductImage("Tomatoes")).toBe(getProductImage("Tomato"));
    expect(getProductImage("Tomatoes")).toContain("photo-1546094096");
  });

  test("fruit and vegetable type follows Bengaluru seasonal months", () => {
    const { getProductType } = require("../utils/productTypes");

    expect(getProductType({ itemName: "Carrot", itemCategory: "Vegetables" }, 10)).toBe("Seasonal");
    expect(getProductType({ itemName: "Carrot", itemCategory: "Vegetables" }, 5)).toBe("Daily");
    expect(getProductType({ itemName: "Mango", itemCategory: "Fruits" }, 5)).toBe("Seasonal");
    expect(getProductType({ itemName: "Mango", itemCategory: "Fruits" }, 10)).toBe("Daily");
    expect(getProductType({ itemName: "Potato", itemCategory: "Vegetables" }, 10)).toBe("Daily");
    expect(getProductType({
      itemName: "Saffron",
      itemCategory: "Spices",
      itemType: "Seasonal",
    }, 10)).toBe("Seasonal");
  });

  test("GET /market/stats — returns live counts and no fabricated rating", async () => {
    const User = require("../models/User");
    Market.countDocuments.mockResolvedValueOnce(12);
    Market.distinct.mockResolvedValueOnce(["farmer1", "farmer2"]);
    User.countDocuments.mockResolvedValueOnce(2);

    const res = await request(app).get("/market/stats");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ farmerCount: 2, productCount: 12, averageRating: null });
    expect(User.countDocuments).toHaveBeenCalledWith({
      _id: { $in: ["farmer1", "farmer2"] },
      role: "farmer",
    });
  });

  test("POST /market/add-item — no auth → 401", async () => {
    const res = await request(app).post("/market/add-item").send({ itemName: "Tomato" });
    expect(res.statusCode).toBe(401);
  });
});

// ─── CART TESTS ───────────────────────────────────────────────────────────────
describe("Cart", () => {
  const Cart = require("../models/Cart");

  test("POST /cart/user — no auth → 401", async () => {
    const res = await request(app).post("/cart/user").send({ id: "userId123" });
    expect(res.statusCode).toBe(401);
  });

  test("POST /cart/user — with auth, empty cart → 200", async () => {
    Cart.find.mockResolvedValueOnce([]);
    const res = await request(app).post("/cart/user").set(AUTH_HEADER).send({ id: "userId123" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
  });

  test("DELETE /cart/clear — uses authenticated user id", async () => {
    const res = await request(app).delete("/cart/clear").set(AUTH_HEADER).send({});
    expect(res.statusCode).toBe(200);
    expect(Cart.deleteMany).toHaveBeenCalledWith({ buyer: "mockUserId" });
  });

  test("DELETE /cart/clear — valid → 200", async () => {
    const res = await request(app).delete("/cart/clear").set(AUTH_HEADER).send({ id: "userId123" });
    expect(res.statusCode).toBe(200);
  });

  test("PATCH /cart/update/:id — invalid quantity → 400", async () => {
    const res = await request(app).patch("/cart/update/someId").set(AUTH_HEADER).send({ updatedQuantity: 0 });
    expect(res.statusCode).toBe(400);
  });
});

// ─── PROMO CODE TESTS ─────────────────────────────────────────────────────────
describe("Promo Codes", () => {
  const PromoCode = require("../models/PromoCode");

  test("GET /promo/list-promos — with auth → 200", async () => {
    const res = await request(app).get("/promo/list-promos").set(AUTH_HEADER);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("promoCodes");
  });

  test("POST /promo/apply-promo — code not found → 404", async () => {
    PromoCode.findOne.mockResolvedValueOnce(null);
    const res = await request(app).post("/promo/apply-promo").set(AUTH_HEADER).send({ code: "INVALID" });
    expect(res.statusCode).toBe(404);
  });

  test("POST /promo/apply-promo — expired code → 400", async () => {
    PromoCode.findOne.mockResolvedValueOnce({
      code: "EXPIRED", discountPercentage: 10,
      expiryDate: new Date("2020-01-01"),
      usageLimit: 10, usedCount: 0,
      save: jest.fn(),
    });
    const res = await request(app).post("/promo/apply-promo").set(AUTH_HEADER).send({ code: "EXPIRED" });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/expired/i);
  });

  test("POST /promo/apply-promo — valid code → 200", async () => {
    PromoCode.findOne.mockResolvedValueOnce({
      code: "SAVE10", discountPercentage: 10,
      expiryDate: new Date("2099-01-01"),
      usageLimit: 10, usedCount: 0,
      save: jest.fn(),
    });
    const res = await request(app).post("/promo/apply-promo").set(AUTH_HEADER).send({ code: "SAVE10" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("promo");
  });
});

// ─── PAYMENT TESTS ────────────────────────────────────────────────────────────
describe("Payments", () => {
  const Payment = require("../models/Payment");

  test("GET /payments/farmer-get-payment — no auth → 401", async () => {
    const res = await request(app).get("/payments/farmer-get-payment");
    expect(res.statusCode).toBe(401);
  });

  test("GET /payments/farmer-get-payment — with auth, no payments → 404", async () => {
    Payment.find.mockResolvedValueOnce([]);
    const res = await request(app).get("/payments/farmer-get-payment").set(AUTH_HEADER);
    expect(res.statusCode).toBe(404);
  });

  test("PATCH /payments/farmer-update-payment — disallowed field → 400", async () => {
    const res = await request(app).patch("/payments/farmer-update-payment").set(AUTH_HEADER)
      .send({ field: "totalAmount", value: 9999, id: "pay1" });
    expect(res.statusCode).toBe(400);
  });

  test("PATCH /payments/farmer-update-payment — valid → 200", async () => {
    Payment.findOneAndUpdate.mockResolvedValueOnce({ _id: "507f1f77bcf86cd799439011", orderStatus: "Delivered" });
    const res = await request(app).patch("/payments/farmer-update-payment").set(AUTH_HEADER)
      .send({ field: "orderStatus", value: "Delivered", id: "507f1f77bcf86cd799439011" });
    expect(res.statusCode).toBe(200);
  });
});
