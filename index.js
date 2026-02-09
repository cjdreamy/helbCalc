 console.log("start")
const Items = [];
let budget = 0;

// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const htmlElement = document.documentElement;

// Check for saved dark mode preference or default to system preference
function initDarkMode() {
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if(savedMode === 'enabled' || (savedMode === null && prefersDark)) {
        htmlElement.style.colorScheme = 'dark';
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<img class="icon" src="Assets/icons/light.png" alt="Light Mode" loading="lazy">';
    } else {
        htmlElement.style.colorScheme = 'light';
        document.body.classList.remove('dark-mode');
        darkModeToggle.innerHTML = '<img class="icon" src="Assets/icons/dark.png" alt="Dark Mode" loading="lazy">';
    }
}

// Initialize dark mode on page load
initDarkMode();

// Dark mode toggle listener
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    if(document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
        darkModeToggle.innerHTML = '<img class="icon" src="Assets/icons/light.png" alt="Light Mode" loading="lazy">';
        htmlElement.style.colorScheme = 'dark';
    } else {
        localStorage.setItem('darkMode', 'disabled');
        darkModeToggle.innerHTML = '<img class="icon" src="Assets/icons/dark.png" alt="Dark Mode" loading="lazy">';
        htmlElement.style.colorScheme = 'light';
    }
});

const form = document.getElementById('form');
const budgetInput = document.getElementById('budget');

// Budget input listener
budgetInput.addEventListener('input', (e) => {
    const value = e.target.value;
    if(isNaN(value) || value === '') {
        budget = 0;
    } else {
        budget = parseFloat(value);
    }
    updateBudgetDisplay();
});
//adding items if enter is pressed
document.addEventListener('keydown', (event) =>{
    if (event.key === 'Enter'){

        document.forms[0].querySelector('input[type="submit"]').click();
        console.log("Enter key Clicked");
    }
})
//adding items 


form.addEventListener('submit', (e) => {
    e.preventDefault();

    
const Amount = document.getElementById('amount').value || 0;
const item = document.getElementById('item').value ;
if(!item){
    alert("Please enter an item")
    return;
}
if(isNaN(Amount)){
    alert("Please enter a valid amount, amount should be a number")
    return;
}
Items.push({name: item, amount: Amount});
updateDisplay();
console.log("added", Items)
})

//updating the  table
function updateDisplay(){
    const view = document.getElementById('view');
    view.innerHTML = '';
    console.log('view was empty')
Items.forEach((itm, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = ` <td>${itm.name}</td> 
                    <td>${itm.amount}</td>
                    <td class="no-print"><button class="btn-delete" onclick="deleteItem(${index})">Delete</button></td>
    `
    // Add staggered animation delay
    tr.style.animationDelay = `${index * 0.1}s`;
    console.log('tr')
    view.appendChild(tr);
    //clear inputs
    document.getElementById('item').value = '';
    document.getElementById('amount').value = '';

    getSubTotals();
    console.log("refreshed")
})

}

function getSubTotals(){
    const Total_Items = document.getElementById('Total_Items');
    const Total_Amount = document.getElementById('Total_Amount');
    Total_Items.innerText = Items.length;
    Total_Amount.innerText = Items.reduce((total, item) => total + parseFloat(item.amount), 0);
    updateBudgetDisplay();
}

// delete an item by index
function deleteItem(index){
    if(typeof index !== 'number') return;
    Items.splice(index, 1);
    updateDisplay();
}

function updateBudgetDisplay(){
    const totalSpent = Items.reduce((total, item) => total + parseFloat(item.amount), 0);
    const remaining = budget - totalSpent;
    
    const spentElement = document.getElementById('Spent_Amount');
    const remainingElement = document.getElementById('Remaining_Amount');
    
    spentElement.innerText = totalSpent.toFixed(2);
    remainingElement.innerText = remaining.toFixed(2);
    
    // Change color based on remaining amount
    if(remaining < 0) {
        remainingElement.parentElement.classList.add('over-budget');
        remainingElement.parentElement.classList.remove('under-budget', 'perfect-budget');
    } else if(remaining === 0) {
        remainingElement.parentElement.classList.add('perfect-budget');
        remainingElement.parentElement.classList.remove('over-budget', 'under-budget');
    } else {
        remainingElement.parentElement.classList.add('under-budget');
        remainingElement.parentElement.classList.remove('over-budget', 'perfect-budget');
    }
}

//print table
function printTable(){
    const table = document.getElementById('table');
    const totalSpent = Items.reduce((total, item) => total + parseFloat(item.amount), 0);
    const remaining = budget - totalSpent;
    
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
        <html>
        <head>
            <title>My Money Plan</title>
        </head>
        <style>
        body{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 30px;
            max-width: 800px;
            margin: 0 auto;
        }
        .header-info {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            text-align: center;
        }
        .header-info h1 {
            margin: 0 0 15px 0;
            font-size: 24px;
        }
        .budget-info {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 15px;
            margin-top: 15px;
        }
        .budget-card {
            background: rgba(255, 255, 255, 0.2);
            padding: 15px;
            border-radius: 6px;
            text-align: center;
        }
        .budget-card p {
            margin: 0;
        }
        .budget-card .label {
            font-size: 12px;
            opacity: 0.9;
            margin-bottom: 5px;
        }
        .budget-card .value {
            font-size: 20px;
            font-weight: bold;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin-top: 20px;
        }
        th, td {
            border: 2px solid #333;
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #667eea;
            color: white;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #f0f0f0;
        }
        .table-title {
            background-color: #764ba2;
            color: white;
            font-weight: bold;
            font-size: 16px;
        }
        .totals-row {
            background-color: #e8e8ff;
            font-weight: bold;
        }
        .summary {
            margin-top: 30px;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 14px;
        }
        .summary-row:last-child {
            margin-bottom: 0;
        }
        .summary-row .label {
            font-weight: 600;
        }
        .summary-row .value {
            font-weight: bold;
            color: #667eea;
        }
        .remaining-positive {
            color: #4caf50;
        }
        .remaining-negative {
            color: #f44336;
        }
        </style>
        <body>
            <div class="header-info">
                <h1>My Money Plan Report</h1>
                <div class="budget-info">
                    <div class="budget-card">
                        <div class="label">Total Budget</div>
                        <div class="value">${budget.toFixed(2)}</div>
                    </div>
                    <div class="budget-card">
                        <div class="label">Total Spent</div>
                        <div class="value">${totalSpent.toFixed(2)}</div>
                    </div>
                    <div class="budget-card">
                        <div class="label">Remaining</div>
                        <div class="value ${remaining < 0 ? 'remaining-negative' : 'remaining-positive'}">${remaining.toFixed(2)}</div>
                    </div>
                </div>
            </div>

            ${table.outerHTML}

            <div class="summary">
                <div class="summary-row">
                    <span class="label">Total Budget:</span>
                    <span class="value">${budget.toFixed(2)}</span>
                </div>
                <div class="summary-row">
                    <span class="label">Total Items:</span>
                    <span class="value">${Items.length}</span>
                </div>
                <div class="summary-row">
                    <span class="label">Total Spent:</span>
                    <span class="value">${totalSpent.toFixed(2)}</span>
                </div>
                <div class="summary-row">
                    <span class="label">Remaining Balance:</span>
                    <span class="value ${remaining < 0 ? 'remaining-negative' : 'remaining-positive'}">${remaining < 0 ? '-' : ''}${Math.abs(remaining).toFixed(2)}</span>
                </div>
                ${remaining < 0 ? `<div class="summary-row" style="color: #f44336; margin-top: 10px;"><span class="label">⚠️ Over Budget by:</span><span class="value">${Math.abs(remaining).toFixed(2)}</span></div>` : ''}
            </div>
        </body>
        </html>
        `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
}
console.log("end");