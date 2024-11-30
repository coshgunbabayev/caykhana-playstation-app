const totalMoneyDiv = document.getElementById('totalMoneyDiv');
const contentList = document.getElementById('contentList');

const dayInput = document.getElementById('dayInput');
const monthInput = document.getElementById('monthInput');
const yearInput = document.getElementById('yearInput');

let currentDateOption = 'day';
let currentTypeOption = 'both';

async function getElements() {
    let res = await fetch('/api/admin/all-income-expense', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (res.ok) {
        res = await res.json();
        return res.allData;
    } else {
        return [];
    };
};

function displayElements(elements) {
    totalMoneyDiv.innerText = '';
    contentList.innerHTML = '';
    let totalMoney = 0;

    for (const element of elements) {
        switch (element.type) {
            case 'income':
                contentList.innerHTML += `
                    <div class="row bg-light py-2 rounded border mt-2">
                        <div class="col-4">${element.tableName}</div> 
                        <div class="col-2">${element.price} azn</div> 
                        <div class="col-2">${element.price - element.profit} azn</div>  
                        <div class="col-2">${element.profit} azn</div>
                        <div class="col-2">${element.day}.${element.month}.${element.year}</div>
                    </div>
                `;

                totalMoney += element.profit;
                break;

            case 'expense':
                contentList.innerHTML += `
                    <div class="row bg-light py-2 rounded border mt-2">
                        <div class="col-4">${element.name}</div> 
                        <div class="col-2">-----</div> 
                        <div class="col-2">${element.money} azn</div>  
                        <div class="col-2">${0 - element.money} azn</div>
                        <div class="col-2">${element.day}.${element.month}.${element.year}</div>
                    </div>
                `;

                totalMoney += 0 - element.money;
                break;
        };
    };

    totalMoneyDiv.innerText = `Mənfəət: ${totalMoney} azn`
};

function changeOption(date, type) {
    if (date !== undefined) {
        currentDateOption = date;
    };

    if (type !== undefined) {
        currentTypeOption = type;
    };

    let filteredElements = elements;
    const now = moment();

    switch (currentDateOption) {
        case 'day':
            filteredElements = filteredElements.filter(element =>
                element.day === now.date() &&
                element.month === now.month() + 1 &&
                element.year === now.year()
            );
            break;

        case 'month':
            filteredElements = filteredElements.filter(element =>
                element.month === now.month() + 1 &&
                element.year === now.year()
            );
            break;

        case 'year':
            filteredElements = filteredElements.filter(element =>
                element.year === now.year()
            );
            break;
    };

    if (currentTypeOption !== 'both') {
        filteredElements = filteredElements.filter(element =>
            element.type === currentTypeOption
        );
    };

    displayElements(filteredElements);
};

dayInput.addEventListener('input', () => {
    if (dayInput.value) {
        let filteredElements = elements;
        const now = moment();

        filteredElements = filteredElements.filter(element =>
            element.day === Number(dayInput.value)
        );

        if (monthInput.value) {
            filteredElements = filteredElements.filter(element =>
                element.month === Number(monthInput.value) + 1
            );
        };

        if (yearInput.value) {
            filteredElements = filteredElements.filter(element =>
                element.year === Number(yearInput.value)
            );
        };

        if (currentTypeOption !== 'both') {
            filteredElements = filteredElements.filter(element =>
                element.type === currentTypeOption
            );
        };

        displayElements(filteredElements);
    } else {
        common();
    };
});

monthInput.addEventListener('input', () => {
    if (monthInput.value) {
        let filteredElements = elements;
        const now = moment();

        filteredElements = filteredElements.filter(element =>
            element.month === Number(monthInput.value) + 1
        );

        if (dayInput.value) {
            filteredElements = filteredElements.filter(element =>
                element.day === Number(dayInput.value)
            );
        };

        if (yearInput.value) {
            filteredElements = filteredElements.filter(element =>
                element.year === Number(yearInput.value)
            );
        };

        if (currentTypeOption !== 'both') {
            filteredElements = filteredElements.filter(element =>
                element.type === currentTypeOption
            );
        };

        displayElements(filteredElements);
    } else {
        common();
    };
});

yearInput.addEventListener('input', () => {
    if (yearInput.value) {
        let filteredElements = elements;
        const now = moment();

        filteredElements = filteredElements.filter(element =>
            element.year === Number(yearInput.value)
        );

        if (dayInput.value) {
            filteredElements = filteredElements.filter(element =>
                element.day === Number(dayInput.value)
            );
        };

        if (monthInput.value) {
            filteredElements = filteredElements.filter(element =>
                element.month === Number(monthInput.value) + 1
            );
        };

        if (currentTypeOption !== 'both') {
            filteredElements = filteredElements.filter(element =>
                element.type === currentTypeOption
            );
        };

        displayElements(filteredElements);
    } else {
        common();
    };
});

function common() {
    let filteredElements = elements;
    const now = moment();

    if (dayInput.value) {
        filteredElements = filteredElements.filter(element =>
            element.day === Number(dayInput.value)
        );
    };

    if (monthInput.value) {
        filteredElements = filteredElements.filter(element =>
            element.month === Number(monthInput.value) + 1
        );
    };

    if (yearInput.value) {
        filteredElements = filteredElements.filter(element =>
            element.year === Number(yearInput.value)
        );
    };

    if (currentTypeOption !== 'both') {
        filteredElements = filteredElements.filter(element =>
            element.type === currentTypeOption
        );
    };

    displayElements(filteredElements);
};

let elements = new Array();
document.addEventListener("DOMContentLoaded", async function () {
    elements = await getElements();
    displayElements(elements);
});