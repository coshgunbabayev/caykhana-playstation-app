const expenseListDiv = document.getElementById('expenseList');
const addExpenseForm = document.getElementById('addExpenseForm');
const searchInput = document.getElementById('searchInput');
const nameInput = document.getElementById('name');
const nameError = document.getElementById('nameError');
const moneyInput = document.getElementById('money');
const moneyError = document.getElementById('moneyError');

function displayExpenses(expenseList) {
    expenseListDiv.innerHTML = '';
    expenseList.forEach(expense => {
        expenseListDiv.innerHTML += `
          <div class="row bg-light py-2 rounded border mt-2">
            <div class="col-4">${expense.name}</div> 
            <div class="col-3">${expense.money}</div> 
            <div class="col-3">${expense.day}.${expense.month}.${expense.year}</div>
            <div class="col-2 text-center">
                <button class="btn btn-danger btn-sm mx-1" onclick="deleteExpense(${expense.id})">Sil</button>
            </div>
          </div>
        `;
    });
};

async function getExpenses() {
    let res = await fetch('/api/admin/expense', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (res.ok) {
        res = await res.json();
        return res.expenses;
    } else {
        return [];
    };
};


let expenses = [];
document.addEventListener("DOMContentLoaded", async function () {
    expenses = await getExpenses();
    displayExpenses(expenses);
});

function searchExpense() {
    const searchQuery = searchInput.value.toLowerCase();
    const filteredExpenses = expenses.filter(expense =>
        expense.name.toLowerCase().includes(searchQuery)
    );
    displayExpenses(filteredExpenses);
};

addExpenseForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(addExpenseForm);

    nameInput.style.borderColor = '#ced4da';
    moneyInput.style.borderColor = '#ced4da';
    nameError.innerText = '';
    moneyError.innerText = '';

    let res = await fetch('/api/admin/expense', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: formData.get('name'),
            money: formData.get('money')
        })
    });

    if (res.ok) {
        document.location.reload();
    } else {
        res = await res.json();

        if (res.name) {
            nameInput.style.borderColor = 'rgb(255, 0, 0)';
            switch (res.name) {
                case 'nameIsRequired':
                    nameError.innerText = 'Ad məcburidir';
                    break;
            };
        };

        if (res.money) {
            moneyInput.style.borderColor = 'rgb(255, 0, 0)';
            switch (res.money) {
                case 'moneyIsRequired':
                    moneyError.innerText = 'Pul miqdarı məcburidir';
                    break;

                case 'moneyIsNotNumber':
                    moneyError.innerText = 'Pul miqdarı rəqəm olmalıdır';
                    break;

                case 'moneyIsNotPositive':
                    moneyError.innerText = 'Pul miqdarı müsbət olmalıdır';
                    break;
            };
        };
    };
});

async function deleteExpense(id) {
    if (!confirm('Xərc silinsin?')) {
        return;
    };

    let res = await fetch(`/api/admin/expense/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (res.ok) {
        document.location.reload();
    };
};