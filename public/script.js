body {
  margin: 0;
  font-family: 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  color: white;
}

.container {
  max-width: 1100px;
  margin: auto;
  padding: 15px;
}

h1 {
  text-align: center;
  margin-bottom: 15px;
}

h2 {
  margin-top: 20px;
  font-size: 18px;
}

input, select {
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  border-radius: 10px;
  border: none;
}

button {
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(45deg, #22c55e, #16a34a);
  color: white;
  font-weight: bold;
}

.card {
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(10px);
  padding: 12px;
  margin: 8px 0;
  border-radius: 12px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

@media(max-width:768px){
  .grid {
    grid-template-columns: 1fr;
  }

  h1 {
    font-size: 22px;
  }

  h2 {
    font-size: 16px;
  }

  input, select, button {
    font-size: 14px;
  }
}