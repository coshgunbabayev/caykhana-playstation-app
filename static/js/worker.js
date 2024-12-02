const tablesDiv = document.getElementById('tablesDiv');
const detailsModal = document.getElementById('detailsModal');
const orderSummary = document.getElementById('orderSummary');
const startTime = document.getElementById('startTime');
const orderSummaryContent = document.getElementById('orderSummaryContent');
const detailsContent = document.getElementById('detailsContent');
const addOrderModal = document.getElementById('addOrderModal');
const addTimeModal = document.getElementById('addTimeModal');
const addOrderForm = document.getElementById('addOrderForm');
const addTimeForm = document.getElementById('addTimeForm');

const categoryInputs = document.getElementById('categoryInputs');
const productInputs = document.getElementById('productInputs');

const productError = document.getElementById('productError');
const quantityError = document.getElementById('quantityError');
const timeError = document.getElementById('timeError');

const detailsModalInstance = new bootstrap.Modal(detailsModal);
const addOrderModalInstance = new bootstrap.Modal(addOrderModal);
const addTimeModalInstance = new bootstrap.Modal(addTimeModal);

const socket = io('http://localhost:8000/');

let currentTableId;

function openModal(modalInstance) {
    modalInstance.show();
};

function closeModal(modalInstance) {
    modalInstance.hide();
};

async function getTables() {
    let res = await fetch('/api/worker/table', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (res.ok) {
        res = await res.json();
        return res.tables;
    };
    return [];
}

async function getProducts() {
    let res = await fetch('/api/worker/product', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (res.ok) {
        res = await res.json();
        return res.products;
    };
    return [];
};

async function getCategories() {
    let res = await fetch('/api/category', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (res.ok) {
        res = await res.json();
        return res.categories;
    };
    return [];
};

async function placementTables(tableList) {
    const foodTables = tableList.filter(table => table.role === 'food');
    const playstationTables = tableList.filter(table => table.role === 'playstation');
    const sortedTables = foodTables.concat(playstationTables);

    for (const table of sortedTables) {
        let starts = new Array();
        let orderSummaryPrice = 0;

        async function calculateSummary(id) {
            const orders = await getOrders(id);

            orders.forEach(order => {
                const product = products.find(product =>
                    product.id == order.productId
                );

                const price = product.sale * order.quantity;
                orderSummaryPrice += price;

                starts.push(new Date(order.start));
            });

            if (table.isHaveTime) {
                const time = await getTime(id);
                const price = Number((1 * calculateElapsedHours(time.start)).toFixed(2));
                orderSummaryPrice += price;

                starts.push(new Date(time.start));
            };

            return orderSummaryPrice
        };

        if (table.isHaveOrder || table.isHaveTime) {
            orderSummaryPrice = await calculateSummary(table.id);
        };

        let hour, minute
        if (starts.length > 0) {
            let minDate = starts.reduce((min, current) => (current < min ? current : min));
            hour = minDate.getHours();
            minute = minDate.getMinutes();
        };

        tablesDiv.innerHTML += `
                <div class="col-auto" >
                    <div id="${table.id}Div" class="card custom-card ${table.isHaveOrder || table.isHaveTime ? 'active-custom-card' : ''} border-primary">
                        <button class="btn btn-primary card-btn" onclick="openDetails(${table.id})">Bax</button>
                        <div class="card-body">
                            <h5 class="card-title fw-bold text-primary">${table.name}</h5>
                            ${table.isHaveOrder || table.isHaveTime ?
                `<h5 class="card-title fw-bold text-primary">${hour}:${minute}</h5>
                                <h5 class="card-title fw-bold text-primary">`
                + orderSummaryPrice + ' azn</h5>' : ''}
                        </div>
                    </div>
                </div>
            `;

    };
};

function placementCategories(categoryList) {
    categoryList.forEach(category => {
        categoryInputs.innerHTML += `
            <input type="radio" class="btn-check" id="category${category.en}" name="category" value="${category.en}"  onclick="changeCategory('${category.en}')">
            <label for="category${category.en}" class="btn btn-outline-primary rounded-pill flex-fill">${category.az}</label>
        `;
    });
};

let tables = new Array();
let products = new Array();
let categories = new Array();

document.addEventListener("DOMContentLoaded", async function () {
    tables = await getTables()
    products = await getProducts();
    categories = await getCategories();
    placementTables(tables);
    placementCategories(categories);
});

async function getOrders(id) {
    let res = await fetch(`/api/worker/table/${id}/order`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (res.ok) {
        res = await res.json();
        return res.orders;
    };
};

async function getTime(id) {
    let res = await fetch(`/api/worker/table/${id}/time`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (res.ok) {
        res = await res.json();
        return res.time;
    };
};

function calculateElapsedHours(givenTime) {
    return (new Date() - new Date(givenTime)) / (1000 * 60 * 60);
};

async function openDetails(id) {
    const table = tables.find(table =>
        table.id === id
    );

    const isActive = table.isHaveOrder || table.isHaveTime;
    let orderSummaryPrice = 0;
    let isHaveTime = false;
    orderSummaryContent.innerHTML = '';

    if (isActive) {
        orderSummary.style.display = 'block';
        const orders = await getOrders(id);
        let starts = new Array();

        orders.forEach(order => {
            const product = products.find(product =>
                product.id == order.productId
            );

            const price = product.sale * order.quantity;
            orderSummaryPrice += price;

            starts.push(new Date(order.start));

            orderSummaryContent.innerHTML += `
                <div class="d-flex justify-content-between mb-3">
                    <span>${product.name} ( ${order.quantity} ədəd )</span>
                    <span>${price} azn
                    
                        ${order.quantity > 1 ? `<button class="btn btn-danger btn-sm mx-1" onclick="deleteOneOrder(${order.id})">Birini sil</button>` : ''}
                        <button class="btn btn-danger btn-sm mx-1" onclick="deleteOrder(${order.id})">Sil</button>
                    </span>
                </div>
            `;

            if (product.type === 'set') {
                const structure = JSON.parse(product.structure);

                structure.products.forEach(setProduct => {
                    const thisProduct = products.find(product => product.id === setProduct.id);
                    orderSummaryContent.innerHTML += `
                        <div class="d-flex justify-content-between mb-3">
                            <span>--- ${thisProduct.name} ( ${setProduct.quantity * order.quantity} ədəd )</span>
                        </div>
                    `;
                });

                if (structure.time > 0) {
                    isHaveTime = true;
                    orderSummaryContent.innerHTML += `
                        <div class="d-flex justify-content-between mb-3">
                            <span>--- Playstation ( ${structure.time * order.quantity} saat )</span>
                        </div>
                    `;
                };
            };
        });

        if (table.isHaveTime) {
            const time = await getTime(id);

            ///// burada 1 qiymetdir
            const price = Number((1 * calculateElapsedHours(time.start)).toFixed(2));
            orderSummaryPrice += price;

            starts.push(new Date(time.start));

            orderSummaryContent.innerHTML += `
                <div class="d-flex justify-content-between">
                    <span>Playstation ( ${time.type === 'unlimited' ? 'limitsiz' : time.time + ' saat'} )</span>
                    <span>${price} azn
                        <button class="btn btn-danger btn-sm mx-1" onclick="deleteTime()">Sil</button>
                    </span>
                </div>
            `;
        };

        let hour, minute
        if (starts.length > 0) {
            let minDate = starts.reduce((min, current) => (current < min ? current : min));
            hour = minDate.getHours();
            minute = minDate.getMinutes();
        };

        startTime.innerText = hour + ':' + minute;
    } else {
        orderSummary.style.display = 'none';
    };


    detailsContent.innerHTML = '';

    if (table.role === 'playstation') {
        if (!table.isHaveTime && !isHaveTime) {
            detailsContent.innerHTML += `
                <div class="col-12">
                    <div class="d-grid">
                        <button class="btn btn-primary btn-lg" type="text" onclick="openAddTime(${id});">Vaxt qur</button>
                    </div>
                </div>
            `;
        };
    };

    detailsContent.innerHTML += `
            <div class="col-12">
                <div class="d-grid">
                    <button class="btn btn-primary btn-lg" type="text" onclick="openAddOrder(${id});">Sifariş əlavə et</button>
                </div>
            </div>
        `;

    if (isActive) {
        detailsContent.innerHTML += `
                <div class="col-12">
                    <div class="d-grid">
                        <button class="btn btn-primary btn-lg" type="text" onclick="closeTable(${id})")>Masanı bağla ( ${orderSummaryPrice} azn )</button>
                    </div>
                </div>
            `;
    };

    currentTableId = id;
    openModal(detailsModalInstance);
};

async function openAddOrder(id) {
    closeModal(detailsModalInstance);
    currentTableId = id;
    openModal(addOrderModalInstance);

    const defaultCategory = document.getElementById('categorypopular');
    if (defaultCategory.checked) {
        changeCategory(defaultCategory.value);
    };
};

function placementProducts(productList) {
    productInputs.innerHTML = '';
    productList.forEach(product => {
        productInputs.innerHTML += `
            <input type="radio" class="btn-check" id="product${product.id}" name="product" value="${product.id}">
            <label for="product${product.id}" class="btn btn-outline-primary rounded-pill flex-fill">${product.name} ${product.sale}azn</label>
        `;
    });
};

function changeCategory(category) {
    switch (category) {
        case 'popular':
            placementProducts(
                products
                    .sort((a, b) => b.sold - a.sold)
                    .slice(0, Math.min(products.length, 5))
            );
            break;

        case 'set':
            placementProducts(
                products
                    .filter(product => product.type === 'set')
            );
            break;

        default:
            placementProducts(
                products
                    .filter(product => product.category === category)
            );
            break;
    };
};

addOrderForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(addOrderForm);

    productError.innerText = '';
    quantityError.innerText = '';

    let res = await fetch(`/api/worker/table/${currentTableId}/order`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            productId: formData.get('product'),
            quantity: formData.get('quantity'),
        })
    });

    if (res.ok) {
        document.location.reload();
    } else {
        res = await res.json();

        if (res.product) {
            switch (res.product) {
                case 'productIsRequired':
                    productError.innerText = 'Məhsul məcburidir';
                    break;
            };
        };

        if (res.quantity) {
            switch (res.quantity) {
                case 'quantityIsRequired':
                    quantityError.innerText = 'Say məcburidir';
                    break;
            };
        };
    };
});

async function deleteOneOrder(id) {
    let res = await fetch(`/api/worker/table/order/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (res.ok) {
        document.location.reload();
    };
};

async function deleteOrder(id) {
    let res = await fetch(`/api/worker/table/order/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (res.ok) {
        document.location.reload();
    };
};

async function openAddTime(id) {
    closeModal(detailsModalInstance);
    currentTableId = id;
    openModal(addTimeModalInstance);
};

addTimeForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(addTimeForm);

    timeError.innerText = '';

    let res = await fetch(`/api/worker/table/${currentTableId}/time`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            time: formData.get('time')
        })
    });

    if (res.ok) {
        document.location.reload();
    } else {
        res = await res.json();

        if (res.time) {
            switch (res.time) {
                case 'timeIsRequired':
                    timeError.innerText = 'Vaxt məcburidir';
                    break;
            };
        };
    };
});

async function deleteTime() {
    let res = await fetch(`/api/worker/table/${currentTableId}/time`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (res.ok) {
        document.location.reload();
    };
};

function notificationForTime(id) {
    const tableDiv = document.getElementById(`${id}Div`);

    if (Array.from(tableDiv.classList).includes('active-custom-card')) {
        tableDiv.classList.remove('active-custom-card');
    } else {
        tableDiv.classList.add('active-custom-card');
    };
};

socket.on('finishedTime', async (data) => {
    setInterval(async () => {
        notificationForTime(data.id)
    }, 0.5 * 1000);
});

async function closeTable(id) {
    if (!confirm('Masa bağlansın?')) {
        return
    };

    let res = await fetch(`/api/worker/table/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (res.ok) {
        document.location.reload();
    };
};