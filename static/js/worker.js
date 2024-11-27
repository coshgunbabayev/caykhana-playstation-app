const tablesDiv = document.getElementById('tablesDiv');
const detailsModal = document.getElementById('detailsModal');
const detailsContent = document.getElementById('detailsContent');
const addOrderModal = document.getElementById('addOrderModal');
const addTimeModal = document.getElementById('addTimeModal');
const addOrderForm = document.getElementById('addOrderForm');
const addTimeForm = document.getElementById('addTimeForm');

const categoryInputs = document.getElementById('categoryInputs');
const productInputs = document.getElementById('productInputs');

const productError = document.getElementById('productError');
const quantityError = document.getElementById('quantityError');

const detailsModalInstance = new bootstrap.Modal(detailsModal);
const addOrderModalInstance = new bootstrap.Modal(addOrderModal);
const addTimeModalInstance = new bootstrap.Modal(addTimeModal);

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

function placementTables(tableList) {
    const foodTables = tableList.filter(table => table.role === 'food');
    const playstationTables = tableList.filter(table => table.role === 'playstation');
    const sortedTables = foodTables.concat(playstationTables);

    function role(role) {
        if (role === 'playstation') {
            return 'Playstation';
        } else if (role === 'food') {
            return 'Yemək';
        };
    };

    for (const table of sortedTables) {
        tablesDiv.innerHTML += `
                <div class="col-auto">
                    <div class="card custom-card ${table.isHaveOrder || table.isHaveTime ? 'active-custom-card' : ''} border-primary">
                        <button class="btn btn-primary card-btn" onclick="openDetails(${table.id})">Bax</button>
                        <div class="card-body">
                            <h5 class="card-title fw-bold text-primary">${table.name}</h5>
                            <h6 class="card-title fw-bold text-primary">${role(table.role)}</h6>
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

async function openDetails(id) {
    const table = tables.find(table =>
        table.id === id
    );
    detailsContent.innerHTML = '';

    if (table.isHaveOrder) {
        let res = await fetch(`/api/worker/table/${id}/order`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (res.ok) {
            res = await res.json();
            const orders = res.orders;

            console.log(orders);
        };
    };

    if (table.role === 'playstation') {
        if (!table.isHaveTime) {
            detailsContent.innerHTML += `
                <div class="col-12">
                    <div class="d-grid">
                        <button class="btn btn-primary btn-lg" type="text" onclick="openAddTime(${id});">Vaxt qur</button>
                    </div>
                </div>
            `;
        } else {

        };
    };

    detailsContent.innerHTML += `
            <div class="col-12">
                <div class="d-grid">
                    <button class="btn btn-primary btn-lg" type="text" onclick="openAddOrder(${id});">Sifariş əlavə et</button>
                </div>
            </div>
        `;

    if (table.isHaveOrder || table.isHaveTime) {
        detailsContent.innerHTML += `
                <div class="col-12">
                    <div class="d-grid">
                        <button class="btn btn-primary btn-lg" type="text">Masanı bağla</button>
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
    console.log(category);

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

async function openAddTime(id) {
    closeModal(detailsModalInstance);
    currentTableId = id;
    openModal(addTimeModalInstance);
};