const tablesDiv = document.getElementById('tablesDiv');
const detailsModal = document.getElementById('detailsModal');
const detailsContent = document.getElementById('detailsContent');
const addOrderModal = document.getElementById('addOrderModal');
const addOrderForm = document.getElementById('addOrderForm');

const categoryInputs = document.getElementById('categoryInputs');

const detailsModalInstance = new bootstrap.Modal(detailsModal);
const addOrderModalInstance = new bootstrap.Modal(addOrderModal);

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
            <input type="radio" class="btn-check" id="category${category.id}" name="category" value="${category.en}">
            <label for="category${category.id}" class="btn btn-outline-primary rounded-pill flex-fill">${category.az}</label>
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

document.addEventListener('DOMContentLoaded', () => {
    getTables();
});

async function openDetails(id) {
    const table = tables.find(table => 
        table.id === id
    );
    detailsContent.innerHTML = '';

    if (table.isHaveOrder) {
        let res = await fetch('/api/worker/table/:id/order', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (res.ok) {
            res = await res.json();
        };
    };

    if (table.role === 'playstation') {
        detailsContent.innerHTML += `
                <div class="col-12">
                    <div class="d-grid">
                        <button class="btn btn-primary btn-lg" type="text">Vaxt qur</button>
                    </div>
                </div>
            `;
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
};