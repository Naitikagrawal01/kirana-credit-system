async function addCustomer() {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const addr = document.getElementById("addr").value;

  if (!name) {
    alert("Enter name!");
    return;
  }

  await fetch("/customer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, phone, address: addr })
  });

  document.getElementById("name").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("addr").value = "";

  load();
}

async function load() {
  document.getElementById("list").innerHTML = "Loading...";

  const res = await fetch("/customers");
  const data = await res.json();

  const search = document.getElementById("search").value.toLowerCase();

  const filtered = data.filter(c =>
    c.name && c.name.toLowerCase().includes(search)
  );

  // 🔥 TOTAL CALCULATION
  let total = 0;
  filtered.forEach(c => total += c.total_outstanding);
  document.getElementById("total").innerText = total;

  // 🔥 LIST
  document.getElementById("list").innerHTML = filtered.map(c => `
    <div class="card">
      <b>${c.name}</b> (${c.phone})<br>
      <span class="${c.total_outstanding > 0 ? 'high' : 'zero'}">
        ₹${c.total_outstanding}
      </span>
      <br>
      ${c.total_outstanding > 0 ? '🔴 DUE' : '🟢 CLEAR'}
    </div>
  `).join("");

  // DROPDOWN
  document.getElementById("cid").innerHTML = data.map(c => `
    <option value="${c._id}">${c.name}</option>
  `).join("");

  document.getElementById("rid").innerHTML =
    document.getElementById("cid").innerHTML;
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

  document.getElementById("amt").value = "";
  document.getElementById("item").value = "";

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

  document.getElementById("ramt").value = "";

  load();
}

load();