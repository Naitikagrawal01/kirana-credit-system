const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// 🔥 ATLAS CONNECTION (DON'T TOUCH)
mongoose.connect("mongodb+srv://webx:1234@cluster0.pt8c1mc.mongodb.net/kirana?retryWrites=true&w=majority")
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
  const { name, phone, address } = req.body;
  const data = await Customer.create({ name, phone, address });
  res.send(data);
});

// GET CUSTOMERS
app.get("/customers", async (req, res) => {
  const data = await Customer.find();
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

// 🔥 NEW APIs
app.get("/credits", async (req, res) => {
  const data = await Credit.find();
  res.send(data);
});

app.get("/repayments", async (req, res) => {
  const data = await Repayment.find();
  res.send(data);
});

// HOMEPAGE
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// PORT (DON'T TOUCH)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running " + PORT));