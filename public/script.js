async function addCustomer() {
  await fetch("/customer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: document.getElementById("name").value,
      phone: document.getElementById("phone").value,
      address: document.getElementById("addr").value
    })
  });
  load();
}

async function load() {
  const res = await fetch("/customers");
  const data = await res.json();

  const search = document.getElementById("search").value.toLowerCase();

  const filtered = data.filter(c =>
    c.name && c.name.toLowerCase().includes(search)
  );

  let total = 0;
  filtered.forEach(c => total += c.total_outstanding);
  document.getElementById("total").innerText = total;

  document.getElementById("list").innerHTML = filtered.map(c => `
    <div class="card">
      <b>${c.name}</b><br>
      ₹${c.total_outstanding}
    </div>
  `).join("");

  document.getElementById("cid").innerHTML = data.map(c =>
    `<option value="${c._id}">${c.name}</option>`
  ).join("");

  document.getElementById("rid").innerHTML =
    document.getElementById("cid").innerHTML;

  loadHistory();
}

async function loadHistory() {
  const cRes = await fetch("/credits");
  const credits = await cRes.json();

  document.getElementById("creditList").innerHTML = credits.map(c => `
    <div class="card">₹${c.amount} - ${c.items}</div>
  `).join("");

  const rRes = await fetch("/repayments");
  const repays = await rRes.json();

  document.getElementById("repayList").innerHTML = repays.map(r => `
    <div class="card">₹${r.amount} repaid</div>
  `).join("");
}

async function addCredit() {
  await fetch("/credit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customer_id: document.getElementById("cid").value,
      amount: Number(document.getElementById("amt").value),
      items: document.getElementById("item").value,
      date: new Date()
    })
  });
  load();
}

async function repay() {
  await fetch("/repay", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customer_id: document.getElementById("rid").value,
      amount: Number(document.getElementById("ramt").value),
      date: new Date()
    })
  });
  load();
}

load();