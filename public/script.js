function logout(){localStorage.removeItem("auth");window.location.href="/login.html"}

async function addCustomer(){
  await fetch("/customer",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:name.value,phone:phone.value,address:addr.value})});
  load();
}

async function load(){
  const data=await(await fetch("/customers")).json();
  const search=document.getElementById("search").value.toLowerCase();
  const filtered=data.filter(c=>c.name.toLowerCase().includes(search));

  let total=0;
  filtered.forEach(c=>total+=c.total_outstanding);
  document.getElementById("total").innerText=total;

  document.getElementById("list").innerHTML=filtered.map(c=>`<div class="card"><b>${c.name}</b><br>₹${c.total_outstanding}</div>`).join("");
  const options=data.map(c=>`<option value="${c._id}">${c.name}</option>`).join("");
  document.getElementById("cid").innerHTML=options;
  document.getElementById("rid").innerHTML=options;

  loadHistory();
  loadChart();
}

async function loadHistory(){
  const credits=await(await fetch("/credits")).json();
  creditList.innerHTML=credits.map(c=>`<div class="card">₹${c.amount}-${c.items}</div>`).join("");

  const repays=await(await fetch("/repayments")).json();
  repayList.innerHTML=repays.map(r=>`<div class="card">₹${r.amount} repaid</div>`).join("");
}

async function addCredit(){
  await fetch("/credit",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({customer_id:cid.value,amount:Number(amt.value),items:item.value,date:new Date()})});
  load();
}

async function repay(){
  await fetch("/repay",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({customer_id:rid.value,amount:Number(ramt.value),date:new Date()})});
  load();
}

async function loadChart(){
  const data=await(await fetch("/customers")).json();
  new Chart(document.getElementById("chart"),{
    type:"bar",
    data:{labels:data.map(c=>c.name),datasets:[{label:"Outstanding ₹",data:data.map(c=>c.total_outstanding)}]}
  });
}

load();