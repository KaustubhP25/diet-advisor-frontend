const API_URL = "https://zlecfce3s2.execute-api.us-east-1.amazonaws.com/analyze";

const config = {
    domain: "us-east-1g2froq2nc.auth.us-east-1.amazoncognito.com",
    clientId: "4vevev7h7gkqj07q449qc5ki42",
    redirectUri: "https://diet-advisor-frontend.vercel.app/",
};

async function analyze() {
    const age = document.getElementById("age").value;
    const weight = document.getElementById("weight").value;
    const goal = document.getElementById("goal").value;
    const food = document.getElementById("food").value;
    const resultBox = document.getElementById("result");

    resultBox.innerHTML = "Analyzing your diet...";
    
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ age, weight, goal, food })
        });
        const data = await response.text();
        resultBox.innerHTML = data;
    } catch (error) {
        resultBox.innerHTML = "Error analyzing diet. Please try again.";
        console.error(error);
    }
}

function login() {
    const authUrl = `https://${config.domain}/login?client_id=${config.clientId}&response_type=code&scope=email+openid+profile&redirect_uri=${config.redirectUri}`;
    window.location.href = authUrl;
}

// Logic to run when page loads
window.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
    const authStatus = document.getElementById('auth-status');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', login);
    }

    // Check if we are returning from a successful Cognito login
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');

    if (authCode) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (authStatus) {
            authStatus.innerHTML = "✅ Authenticated";
            authStatus.style.color = "#2ecc71";
        }
        // Clean URL so the code doesn't stay visible
        window.history.replaceState({}, document.title, "/");
    }
});
