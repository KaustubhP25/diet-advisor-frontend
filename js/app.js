const API_URL = "https://zlecfce3s2.execute-api.us-east-1.amazonaws.com/analyze";

async function analyze() {

  const age = document.getElementById("age").value;
  const weight = document.getElementById("weight").value;
  const goal = document.getElementById("goal").value;
  const food = document.getElementById("food").value;

  const resultBox = document.getElementById("result");

  resultBox.innerHTML = "Analyzing your diet...";

  const response = await fetch(API_URL,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({ age, weight, goal, food })
  });

  const data = await response.text();

  resultBox.innerHTML = data;
}
