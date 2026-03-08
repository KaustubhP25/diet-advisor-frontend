const API_URL = "https://zlecfce3s2.execute-api.us-east-1.amazonaws.com/analyze"

async function analyze(){

const age = document.getElementById("age").value
const weight = document.getElementById("weight").value
const goal = document.getElementById("goal").value
const food = document.getElementById("food").value

const resultBox = document.getElementById("result")

if(!age || !weight || !food){
resultBox.innerHTML = "Please fill all fields."
return
}

resultBox.innerHTML = "<div class='loading'>Analyzing your diet...</div>"

try{

const response = await fetch(API_URL,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
age:age,
weight:weight,
goal:goal,
food:food
})
})

const data = await response.text()

resultBox.innerHTML = `
<h3>AI Diet Analysis</h3>
<p>${data}</p>
`

}catch(error){

resultBox.innerHTML = "Error connecting to AI service."

}

}