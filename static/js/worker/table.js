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

async function getProducts() {
    let res = await fetch('/api/woker/product', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (res.ok) {
        res = await res.json();
        return res.products;
    } else {
        return [];
    };
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
    } else {
        return [];
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

let products = [];
let categories = [];
document.addEventListener("DOMContentLoaded", async function () {
    products = await getProducts();
    categories = await getCategories();
    placementCategories(categories);
});

async function isActive(id) {
    let res = await fetch(`/api/worker/table/${id}/is-active`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (res.ok) {
        res = await res.json();
        return res.isActive;
    };

    return false;
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
        const tables = res.tables;

        const foodTables = tables.filter(table => table.role === 'food');
        const playstationTables = tables.filter(table => table.role === 'playstation');
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
                    <div class="card custom-card ${await isActive(table.id) ? 'active-custom-card' : ''} border-primary">
                        <button class="btn btn-primary card-btn" onclick="openDetails(${table.id})">Bax</button>
                        <div class="card-body">
                            <h5 class="card-title fw-bold text-primary">${table.name}</h5>
                            <h6 class="card-title fw-bold text-primary">${role(table.role)}</h6>
                        </div>
                    </div>
                </div>
            `;
        };
    } else {
        res = await res.json();
        alert(res.message);
    };
};

document.addEventListener('DOMContentLoaded', () => {
    getTables();
});

async function getTable(id) {
    let res = await fetch(`/api/worker/table/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (res.ok) {
        res = await res.json();
        return res.table;
    };

    return {};
};

async function openDetails(id) {
    const table = await getTable(id);
    const tableIsActive = await isActive(id);
    detailsContent.innerHTML = '';

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

    if (tableIsActive) {
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