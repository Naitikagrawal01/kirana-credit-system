const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb+srv://webx:1234@cluster0.pt8c1mc.mongodb.net/kirana?retryWrites=true&w=majority")
.then(()=>console.log("MongoDB Connected ✅"))
.catch(err=>console.log(err));

// Schemas
const Customer = mongoose.model("Customer", { name:String, phone:String, address:String, total_outstanding:{type:Number, default:0}});
const Credit = mongoose.model("Credit",{ customer_id:String, amount:Number, items:String, date:String});
const Repayment = mongoose.model("Repayment",{ customer_id:String, amount:Number, date:String});

// Routes
app.post("/customer", async(req,res)=>{
  const {name,phone,address} = req.body;
  const data = await Customer.create({name,phone,address});
  res.send(data);
});

app.get("/customers", async(req,res)=>{ res.send(await Customer.find()); });

app.post("/credit", async(req,res)=>{
  await Credit.create(req.body);
  const cust = await Customer.findById(req.body.customer_id);
  cust.total_outstanding += req.body.amount;
  await cust.save();
  res.send("Credit Added");
});

app.post("/repay", async(req,res)=>{
  await Repayment.create(req.body);
  const cust = await Customer.findById(req.body.customer_id);
  cust.total_outstanding -= req.body.amount;
  await cust.save();
  res.send("Repayment Done");
});

app.get("/credits", async(req,res)=>{ res.send(await Credit.find()); });
app.get("/repayments", async(req,res)=>{ res.send(await Repayment.find()); });

// Login page route
app.get("/login.html",(req,res)=>{ res.sendFile(path.join(__dirname,"public","login.html")); });

// Homepage
app.get("/",(req,res)=>{ res.sendFile(path.join(__dirname,"public","index.html")); });

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log("Server running "+PORT));