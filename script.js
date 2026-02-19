let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

updateUI();

function addTransaction(){

 let desc=document.getElementById("desc").value;
 let amount=document.getElementById("amount").value;
 let type=document.getElementById("type").value;
 let month=document.getElementById("month").value;

 if(!desc || !amount || !month) return;

 transactions.push({
   id:Date.now(),
   desc,
   amount:Number(amount),
   type,
   month
 });

 localStorage.setItem("transactions",JSON.stringify(transactions));
 updateUI();
}

function deleteTransaction(id){
 transactions=transactions.filter(t=>t.id!==id);
 localStorage.setItem("transactions",JSON.stringify(transactions));
 updateUI();
}

function editTransaction(id){
 let t=transactions.find(x=>x.id===id);
 let newAmt=prompt("Enter new amount",t.amount);
 if(newAmt){
   t.amount=Number(newAmt);
   localStorage.setItem("transactions",JSON.stringify(transactions));
   updateUI();
 }
}

function updateUI(){

 let list=document.getElementById("transactionList");
 list.innerHTML="";

 let income=0, expense=0;

 transactions.forEach(t=>{
   let li=document.createElement("li");
   li.innerHTML=`
   ${t.desc} ₹${t.amount}
   <span>
    <button onclick="editTransaction(${t.id})">Edit</button>
    <button onclick="deleteTransaction(${t.id})">X</button>
   </span>
   `;
   li.className=t.type;
   list.appendChild(li);

   if(t.type=="income") income+=t.amount;
   else expense+=t.amount;
 });

 document.getElementById("income").innerText=income;
 document.getElementById("expense").innerText=expense;
 document.getElementById("balance").innerText=income-expense;

 drawChart(income,expense);
}

function filterTransactions(){

 let f=document.getElementById("filter").value;
 let list=document.getElementById("transactionList");
 list.innerHTML="";

 transactions
 .filter(t=>f=="all"||t.type==f)
 .forEach(t=>{
   let li=document.createElement("li");
   li.innerText=`${t.desc} ₹${t.amount}`;
   li.className=t.type;
   list.appendChild(li);
 });
}

/* Simple chart */

function drawChart(income,expense){

 let c=document.getElementById("chart");
 let ctx=c.getContext("2d");

 c.width=300;
 c.height=150;

 ctx.clearRect(0,0,300,150);

 let total=income+expense;
 if(total==0) return;

 ctx.fillStyle="green";
 ctx.fillRect(0,0,(income/total)*300,50);

 ctx.fillStyle="red";
 ctx.fillRect(0,60,(expense/total)*300,50);
}
