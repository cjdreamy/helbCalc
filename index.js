 console.log("start")
const Items = [];
let budget = 0;

// Load items and budget from localStorage on page init
function loadFromLocalStorage(){
    try {
        const savedItems = localStorage.getItem('savedItems');
        if(savedItems){
            Items.length = 0;
            Items.push(...JSON.parse(savedItems));
        }
        const savedBudget = localStorage.getItem('savedBudget');
        if(savedBudget){
            budget = parseFloat(savedBudget);
            document.getElementById('budget').value = budget;
        }
    } catch (err) {
        console.warn('Could not load from localStorage', err);
    }
}

// Save items and budget to localStorage
function saveToLocalStorage(){
    try {
        localStorage.setItem('savedItems', JSON.stringify(Items));
        localStorage.setItem('savedBudget', budget.toString());
    } catch (err) {
        console.warn('Could not save to localStorage', err);
    }
}

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

// Load data from localStorage on page load
window.addEventListener('load', () => {
    loadFromLocalStorage();
    if(Items.length > 0) updateDisplay();
    updateBudgetDisplay();
});

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
// Personalization
let reportTitle = '';
let reportName = '';
const savePersonalBtn = document.getElementById('savePersonal');
const reportTitleInput = document.getElementById('reportTitle');
const reportNameInput = document.getElementById('reportName');

if(savePersonalBtn){
    savePersonalBtn.addEventListener('click', () => {
        reportTitle = (reportTitleInput && reportTitleInput.value) ? reportTitleInput.value.trim() : '';
        reportName = (reportNameInput && reportNameInput.value) ? reportNameInput.value.trim() : '';
        // quick feedback
        savePersonalBtn.textContent = 'Saved';
        setTimeout(() => savePersonalBtn.textContent = 'Save Personalization', 1200);
    });
}

// Toggle personalize inputs visibility
const togglePersonalBtn = document.getElementById('togglePersonalBtn');
const personalSection = document.querySelector('.personalize-section');
if(togglePersonalBtn){
    togglePersonalBtn.addEventListener('click', () => {
        if(personalSection){
            personalSection.classList.toggle('visible');
            const visible = personalSection.classList.contains('visible');
            if(visible){
                togglePersonalBtn.textContent = 'Close Personalize';
                if(reportTitleInput) reportTitleInput.focus();
            } else {
                togglePersonalBtn.innerHTML = `<img class="icon" src="/Assets/icons/personalize.png" alt="pen" loading="lazy">  Personalize Report`;
            }
        }
    });
}

// Close personalize after save (optional)
if(savePersonalBtn){
    savePersonalBtn.addEventListener('click', () => {
        if(personalSection) personalSection.classList.remove('visible');
        if(togglePersonalBtn) togglePersonalBtn.innerHTML = `<img class="icon" src="/Assets/icons/personalize.png" alt="pen" loading="lazy"> Personalize Report`;
    });
}

// Budget input listener
budgetInput.addEventListener('input', (e) => {
    const value = e.target.value;
    if(isNaN(value) || value === '') {
        budget = 0;
    } else {
        budget = parseFloat(value);
    }
    updateBudgetDisplay();
    saveToLocalStorage();
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
saveToLocalStorage();
updateDisplay();
console.log("added", Items)
})

//updating the  table
function updateDisplay(){
    const view = document.getElementById('view');
    view.innerHTML = '';
    console.log('view was empty')
Items.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = ` <td>${item.name}</td>
                    <td>${item.amount}</td>
                    <td class="no-print">
                        <div class="actions-menu">
                            <button class="actions-delete" onclick="deleteItem(${index})" aria-label="Delete item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            </button>
                            <button class="actions-toggle" onclick="toggleActionsMenu(event, ${index})" aria-label="Actions">⋯</button>
                            <div class="actions-dropdown" id="actions-${index}">
                                <button class="dropdown-item" onclick="duplicateItem(${index})">Duplicate</button>
                                <button class="dropdown-item" onclick="duplicateItemNTimes(${index})">Add N</button>
                            </div>
                        </div>
                    </td>
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

// Toggle the compact actions dropdown for a row
function toggleActionsMenu(event, index){
    event.stopPropagation();
    // close others first
    closeAllActionMenus();
    const el = document.getElementById(`actions-${index}`);
    if(!el) return;

    // Create a floating clone appended to body to avoid clipping by transformed ancestors
    const floating = document.createElement('div');
    floating.className = 'actions-dropdown floating open';
    floating.id = `actions-floating-${index}`;
    floating.innerHTML = el.innerHTML;
    // Prevent clicks inside from closing immediately
    floating.addEventListener('click', (ev) => ev.stopPropagation());
    document.body.appendChild(floating);

    // position near the toggle button using viewport coords
    const btn = event.currentTarget;
    const btnRect = btn.getBoundingClientRect();
    // measure after append
    const fRect = floating.getBoundingClientRect();
    let left = btnRect.right - fRect.width;
    if(left < 8) left = Math.max(8, btnRect.left);
    let top = btnRect.bottom + 8;
    // prevent overflow bottom/right
    const padding = 8;
    if(top + fRect.height + padding > window.innerHeight){
        top = Math.max(padding, btnRect.top - fRect.height - 8);
    }
    if(left + fRect.width + padding > window.innerWidth){
        left = Math.max(padding, window.innerWidth - fRect.width - padding);
    }
    floating.style.left = `${left}px`;
    floating.style.top = `${top}px`;
}

// Close any open action dropdowns
function closeAllActionMenus(){
    // remove any floating clones
    document.querySelectorAll('.actions-dropdown.floating').forEach(d => d.remove());
    // close any inline dropdowns (fallback)
    document.querySelectorAll('.actions-dropdown.open').forEach(d => {
        d.classList.remove('open');
        d.style.position = '';
        d.style.left = '';
        d.style.top = '';
        d.style.display = '';
    });
}

// Close menus when clicking outside
document.addEventListener('click', (e) => {
    closeAllActionMenus();
});

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
    saveToLocalStorage();
    updateDisplay();
}

// duplicate single item after the given index
function duplicateItem(index){
    if(typeof index !== 'number') return;
    const it = Items[index];
    if(!it) return;
    Items.splice(index + 1, 0, { name: it.name, amount: it.amount });
    saveToLocalStorage();
    updateDisplay();
}

// duplicate item N times (prompt for count)
function duplicateItemNTimes(index){
    if(typeof index !== 'number') return;
    const it = Items[index];
    if(!it) return;
    let n = prompt('How many copies would you like to add?', '1');
    if(n === null) return; // cancelled
    n = parseInt(n, 10);
    if(isNaN(n) || n <= 0){
        alert('Please enter a valid positive integer');
        return;
    }
    const copies = [];
    for(let i = 0; i < n; i++) copies.push({ name: it.name, amount: it.amount });
    Items.splice(index + 1, 0, ...copies);
    saveToLocalStorage();
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
    
    // Build printable HTML
    const printableHTML = `
        <html>
        <head>
            <title>My Money Plan</title>
        </head>
        <style>
        /* Print styles - hide UI elements not suitable for print */
        .no-print { display: none !important; }
        body{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 30px;
            max-width: 800px;
            margin: 0 auto;
            color: #111;
            background: white;
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
                        <h1>${reportTitle && reportTitle.length ? reportTitle : 'My Money Plan Report'}</h1>
                        ${reportName ? `<div style="margin-top:8px; font-size:14px;">Report for: ${reportName}</div>` : ''}
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
        `;

    // Save printable content to localStorage before opening print window
    try {
        localStorage.setItem('printDraft', printableHTML);
    } catch (err) {
        console.warn('Could not save print draft to localStorage', err);
    }

    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(printableHTML);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();

    // Clear print draft and saved items/budget 1 second after print button is clicked
    setTimeout(() => {
        try {
            const clearData = confirm('This will also clear your list but will be saved for printing');
            if (clearData) {
                localStorage.removeItem('printDraft');
                localStorage.removeItem('savedItems');
                localStorage.removeItem('savedBudget');
            }
        } catch (err) {
            console.warn('Could not clear localStorage', err);
        }
    }, 1);
}
console.log("end of script");