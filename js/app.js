const API_URL = "https://zlecfce3s2.execute-api.us-east-1.amazonaws.com/analyze";
const config = {
    domain: "us-east-1g2froq2nc.auth.us-east-1.amazoncognito.com",
    clientId: "4vevev7h7gkqj07q449qc5ki42",
    redirectUri: "https://diet-advisor-frontend.vercel.app/",
    userPoolId: "us-east-1_g2Froq2nC"
};
console.log("app.js loaded")
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

function login() {
    const authUrl = `https://${config.domain}/login?client_id=${config.clientId}&response_type=code&scope=email+openid+profile&redirect_uri=${config.redirectUri}`;
    window.location.href = authUrl;
}

// Attach to your login button (make sure your HTML button has id="login-btn")
document.getElementById('login-btn').addEventListener('click', login);



window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');

    if (authCode) {
        // Save the code to use later if needed
        localStorage.setItem('auth_code', authCode);

        // UI Updates
        const loginBtn = document.getElementById('login-btn');
        const analyzeBtn = document.querySelector('button[onclick="analyze()"]');
        const resultBox = document.getElementById('result');

        if (loginBtn) loginBtn.style.display = 'none';
        
        if (resultBox) {
            resultBox.innerHTML = "✅ Authenticated. Ready to analyze!";
            resultBox.style.color = "#2ecc71"; // A nice fitness green
        }

        // Clean the URL so the code doesn't look messy
        window.history.replaceState({}, document.title, "/");
    }
});
