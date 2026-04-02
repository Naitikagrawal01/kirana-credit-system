// Logout
function logout(){
  localStorage.removeItem("auth");
  window.location.href="/login.html";
}

// Add Customer
async function addCustomer(){
  await fetch("/customer",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      name:document.getElementById("name").value,
      phone:document.getElementById("phone").value,
      address:document.getElementById("addr").value
    })
  });
  load();
}

// Add Credit
async function addCredit(){
  await fetch("/credit",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      customer_id:document.getElementById("cid").value,
      amount:Number(document.getElementById("amt").value),
      items:document.getElementById("item").value,
      date:new Date()
    })
  });
  load();
}

// Repay
async function repay(){
  await fetch("/repay",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      customer_id:document.getElementById("rid").value,
      amount:Number(document.getElementById("ramt").value),
      date:new Date()
    })
  });
  load();
}

// Load Customers + History + Chart
async function load(){
  const res = await fetch("/customers");
  const data = await res.json();
  const search = document.getElementById("search").value.toLowerCase();
  const filtered = data.filter(c=>c.name.toLowerCase().includes(search));

  // Total Outstanding
  let total = 0;
  filtered.forEach(c=> total += c.total_outstanding);
  document.getElementById("total").innerText = total;

  // Customer list
  document.getElementById("list").innerHTML = filtered.map(c=>
    `<div class="card"><b>${c.name}</b><br>₹${c.total_outstanding}</div>`
  ).join("");

  // Dropdowns
  const options = data.map(c=>`<option value="${c._id}">${c.name}</option>`).join("");
  document.getElementById("cid").innerHTML = options;
  document.getElementById("rid").innerHTML = options;

  // History + Chart
  loadHistory();
  loadChart();
}

// Load Credit & Repayment History
async function loadHistory(){
  const credits = await (await fetch("/credits")).json();
  document.getElementById("creditList").innerHTML = credits.map(c=>
    `<div class="card">₹${c.amount} - ${c.items}</div>`
  ).join("");

  const repays = await (await fetch("/repayments")).json();
  document.getElementById("repayList").innerHTML = repays.map(r=>
    `<div class="card">₹${r.amount} repaid</div>`
  ).join("");
}

// Chart.js Outstanding
let chartInstance;
async function loadChart(){
  const data = await (await fetch("/customers")).json();
  if(chartInstance) chartInstance.destroy();
  chartInstance = new Chart(document.getElementById("chart"),{
    type:"bar",
    data:{
      labels:data.map(c=>c.name),
      datasets:[{
        label:"Outstanding ₹",
        data:data.map(c=>c.total_outstanding),
        backgroundColor:"#22c55e"
      }]
    }
  });
}

// Initial load
load();
