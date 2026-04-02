const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// 🔥 FIREBASE FAIL HUA TOH LOCAL USE KAR
mongoose.connect("mongodb://127.0.0.1:27017/kirana")
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log(err));

// SCHEMAS
const Customer = mongoose.model("Customer", {
  name: String,
  phone: String,
  address: String,
  total_outstanding: { type: Number, default: 0 }
});

const Credit = mongoose.model("Credit", {
  customer_id: String,
  amount: Number,
  items: String,
  date: String
});

const Repayment = mongoose.model("Repayment", {
  customer_id: String,
  amount: Number,
  date: String
});

// ADD CUSTOMER
app.post("/customer", async (req, res) => {
  const data = await Customer.create(req.body);
  res.send(data);
});

// ADD CREDIT
app.post("/credit", async (req, res) => {
  const { customer_id, amount } = req.body;

  await Credit.create(req.body);

  const cust = await Customer.findById(customer_id);
  cust.total_outstanding += amount;
  await cust.save();

  res.send("Credit Added");
});

// ADD REPAYMENT
app.post("/repay", async (req, res) => {
  const { customer_id, amount } = req.body;

  await Repayment.create(req.body);

  const cust = await Customer.findById(customer_id);
  cust.total_outstanding -= amount;
  await cust.save();

  res.send("Repayment Done");
});

// GET CUSTOMERS
app.get("/customers", async (req, res) => {
  const data = await Customer.find();
  res.send(data);
});

app.listen(3000, () => console.log("Server running 🚀"));