const {
  verifyTokenAutorize,
  verifyTokenAdmin,
  verifyToken,
} = require("../middleware/verifyToken");
const router = require("express").Router();
const CryptoJS = require("crypto-js");
const Order = require("../models/Order");

//Create Order
router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);

  const savedOrder = await newOrder.save();
  res.json(savedOrder);
});

//Upadate Order
router.put("/:id", verifyTokenAdmin, async (req, res) => {
  updatedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );

  res.json(updatedOrder);
});

//Delete Order
router.delete("/:id", verifyTokenAutorize, async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.json("order has been deleted...");
});

//Get User Order
router.get("/find/:userId", verifyTokenAutorize, async (req, res) => {
  const order = await Order.find({ userId: req.params.userId });
  res.json(order);
});

//Get All Orders
router.get("/", verifyTokenAdmin, async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

//Get Monthly Incomes
router.get("/income", verifyTokenAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(lastMonth.setMonth(lastMonth.getMonth() - 1));

  const income = await Order.aggregate([
    { $match: { createdAt: { $gte: previousMonth } } },
    {
      $project: {
        month: { $month: "$createdAt" },
        sales: "$amount",
      },
    },
    {
      $group: {
        _id: "$month",
        total: { $sum: "$sales" },
      },
    },
  ]);

  res.json(income);
});

module.exports = router;
