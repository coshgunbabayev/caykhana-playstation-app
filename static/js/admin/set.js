const setListDiv = document.getElementById('setList');
const addSetForm = document.getElementById('addSetForm');
const editSetForm = document.getElementById('editSetForm');
const detailsModal = document.getElementById('detailsModal');
const structureSummary = document.getElementById('structureSummary');
const structureSummaryContent = document.getElementById('structureSummaryContent');
const detailsContent = document.getElementById('detailsContent');
const searchInput = document.getElementById('searchInput');
const nameInput = document.getElementById('name');
const nameError = document.getElementById('nameError');
const saleInput = document.getElementById('sale');
const saleError = document.getElementById('saleError');
const editNameInput = document.getElementById('editName');
const editNameError = document.getElementById('editNameError');
const editSaleInput = document.getElementById('editSale');
const editSaleError = document.getElementById('editSaleError');

function displaySets(setList) {
    setListDiv.innerHTML = '';
    setList.forEach(set => {
        setListDiv.innerHTML += `
            <div class="row bg-light py-2 rounded border mt-2">
                <div class="col-5">${set.name}</div>
                <div class="col-3">${set.sale} azn</div>
                <div class="col-4 text-center">
                    <button class="btn btn-primary btn-sm mx-1" onclick="lookSet(${set.id})">Setə bax</button>
                    <button class="btn btn-warning btn-sm mx-1" onclick="editSet(${set.id})">Redaktə et</button>
                    <button class="btn btn-danger btn-sm mx-1" onclick="deleteSet(${set.id})">Sil</button>
                </div>
            </div>
        `;
    });
};

async function getSets() {
    let res = await fetch('/api/admin/product/set', {
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

async function getProducts() {
    let res = await fetch('/api/worker/product', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (res.ok) {
        res = await res.json();
        return res.products.filter(product =>
            product.type !== 'set'
        );
    } else {
        return [];
    };
};

let sets = new Array();
let products = new Array();
document.addEventListener("DOMContentLoaded", async function () {
    sets = await getSets();
    products = await getProducts();
    displaySets(sets);
});

function searchProduct() {
    const searchQuery = searchInput.value.toLowerCase();
    const filteredSets = sets.filter(set =>
        set.name.toLowerCase().includes(searchQuery)
    );
    displaySets(filteredSets);
};

addSetForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(addSetForm);

    nameInput.style.borderColor = '#ced4da';
    saleInput.style.borderColor = '#ced4da';
    nameError.innerText = '';
    saleError.innerText = '';

    let res = await fetch('/api/admin/set', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: formData.get('name'),
            sale: formData.get('sale')
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

                case 'nameIsUsed':
                    nameError.innerText = 'Ad istifadə olunub';
                    break;
            };
        };

        if (res.sale) {
            saleInput.style.borderColor = 'rgb(255, 0, 0)';
            switch (res.sale) {
                case 'saleIsRequired':
                    saleError.innerText = 'Satış qiyməti məcburidir';
                    break;

                case 'saleIsNotNumber':
                    saleError.innerText = 'Satış qiyməti rəqəm olmalıdır';
                    break;

                case 'saleIsNotPositive':
                    saleError.innerText = 'Satış qiyməti müsbət olmalıdır';
                    break;
            };
        };
    };
});

async function lookSet(id) {
    const set = sets.find(set => set.id === id);
    if (!set) return;
    detailsModal.dataset.setId = id;

    const structure = JSON.parse(set.structure);
    structureSummaryContent.innerHTML = '';

    if (structure.products.length > 0 || structure.time > 0) {
        // structureSummary.style.display = 'block';
        // const allProducts = await getProducts();

        ////////////////

    } else {
        structureSummary.style.display = 'none';
    };

    detailsContent.innerHTML = '';

    detailsContent.innerHTML += `
        <div id="addProductToSetContent">
            <div class="col-12">
                <div class="d-grid">
                    <button class="btn btn-primary btn-lg" type="text" onclick="addProductToSet()">Məhsul əlavə et</button>
                </div>
            </div>
        </div>

        <div id="addTimeToSetContent">
            <div class="col-12">
                <div class="d-grid">
                    <button class="btn btn-primary btn-lg" type="text" onclick="addTimeToSet()">Vaxt əlavə et</button>
                </div>
            </div>
        </div>
    `;

    new bootstrap.Modal(detailsModal).show();
};

function addProductToSet() {
    closeAddTimeToSet();

    const addProductToSetContent = document.getElementById('addProductToSetContent');
    addProductToSetContent.innerHTML = '';

    addProductToSetContent.innerHTML += `
        <div class="col-12 mb-3">
            <div class="d-grid">
                <button class="btn btn-primary btn-lg" type="text" onclick="closeAddProductToSet()">Bağla</button>
            </div>
        </div>
    `;

    let productInputsHTML = '';
    products.forEach(product => {
        productInputsHTML += `
            <input type="radio" class="btn-check" id="product${product.id}" name="product" value="${product.id}">
            <label for="product${product.id}" class="btn btn-outline-primary rounded-pill flex-fill">${product.name}</label>
        `;
    });

    addProductToSetContent.innerHTML += `
    <form id="addProductToSetForm">
        
        <div class="col-12 mb-3">
            <div class="btn-group d-flex flex-wrap gap-2" role="group"
                aria-label="role">

                ${productInputsHTML}

            </div>
            <div class="error" id="productError"></div>
        </div>

        <div class="col-12 mb-3">
            <div class="btn-group d-flex" id="quantity" role="group" aria-label="quantity">
                <input type="radio" class="btn-check" id="quantity1" name="quantity" value="1">
                <label for="quantity1" class="btn btn-outline-primary flex-fill">1</label>

                <input type="radio" class="btn-check" id="quantity2" name="quantity" value="2">
                <label for="quantity2" class="btn btn-outline-primary flex-fill">2</label>

                <input type="radio" class="btn-check" id="quantity3" name="quantity" value="3">
                <label for="quantity3" class="btn btn-outline-primary flex-fill">3</label>

                <input type="radio" class="btn-check" id="quantity4" name="quantity" value="4">
                <label for="quantity4" class="btn btn-outline-primary flex-fill">4</label>

                <input type="radio" class="btn-check" id="quantity5" name="quantity" value="5">
                <label for="quantity5" class="btn btn-outline-primary flex-fill">5</label>

                <input type="radio" class="btn-check" id="quantity10" name="quantity" value="10">
                <label for="quantity10" class="btn btn-outline-primary flex-fill">10</label>
            </div>
            <div class="error" id="quantityError"></div>
        </div>

        <div class="col-12">
            <div class="d-grid">
                <button class="btn btn-primary btn-lg" type="text" onclick="addProductToSetFormSubmit(event)">Əlavə et</button>
            </div>
        </div>
    </form>
    `;
};

async function addProductToSetFormSubmit(e) {
    e.preventDefault();

    const addProductToSetForm = document.getElementById('addProductToSetForm');
    const formData = new FormData(addProductToSetForm);
    const productError = document.getElementById('productError');
    const quantityError = document.getElementById('quantityError');

    productError.innerText = '';
    quantityError.innerText = '';

    let res = await fetch(`/api/admin/set/${detailsModal.dataset.setId}/product`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            productId: formData.get('product'),
            quantity: formData.get('quantity')
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
};

function closeAddProductToSet() {
    document.getElementById('addProductToSetContent').innerHTML = `
        <div class="col-12 mb-3">
            <div class="d-grid">
                <button class="btn btn-primary btn-lg" type="text" onclick="addProductToSet()">Məhsul əlavə et</button>
            </div>
        </div>
    `;
};

function addTimeToSet() {
    closeAddProductToSet();

    const addTimeToSetContent = document.getElementById('addTimeToSetContent');
    addTimeToSetContent.innerHTML = '';

    addTimeToSetContent.innerHTML += `
        <div class="col-12 mb-3">
            <div class="d-grid">
                <button class="btn btn-primary btn-lg" type="text" onclick="closeAddTimeToSet()">Bağla</button>
            </div>
        </div>
    `;

    addTimeToSetContent.innerHTML += `
    <form id="addTimeToSetForm">
        <div class="col-12 mb-3">
            <div class="btn-group d-flex" id="time" role="group" aria-label="time">

                <input type="radio" class="btn-check" id="time1" name="time" value="1">
                <label for="time1" class="btn btn-outline-primary flex-fill">1 saat</label>

                <input type="radio" class="btn-check" id="time2" name="time" value="1.5">
                <label for="time2" class="btn btn-outline-primary flex-fill">1.5 saat</label>

                <input type="radio" class="btn-check" id="time3" name="time" value="2">
                <label for="time3" class="btn btn-outline-primary flex-fill">2 saat</label>
            </div>
            <div class="error" id="timeError"></div>
        </div>
        
        <div class="col-12">
            <div class="d-grid">
                <button class="btn btn-primary btn-lg" type="text" onclick="addTimeToSetFormSubmit(event)">Əlavə et</button>
            </div>
        </div>
    </form>
    `;
};

async function addTimeToSetFormSubmit(e) {
    e.preventDefault();

    const addTimeToSetForm = document.getElementById('addTimeToSetForm');
    const formData = new FormData(addTimeToSetForm);
    const timeError = document.getElementById('timeError');

    timeError.innerText = '';

    let res = await fetch(`/api/admin/set/${detailsModal.dataset.setId}/time`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            time: formData.get('time'),
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
};

function closeAddTimeToSet() {
    document.getElementById('addTimeToSetContent').innerHTML = `
        <div class="col-12 mb-3">
            <div class="d-grid">
                <button class="btn btn-primary btn-lg" type="text" onclick="addTimeToSet()">Vaxt əlavə et</button>
            </div>
        </div>
    `;
};

function editSet(id) {
    const set = sets.find(set => set.id === id);
    if (!set) return;

    editNameInput.value = set.name;
    editSaleInput.value = set.sale;

    editSetForm.dataset.setId = id;

    new bootstrap.Modal(document.getElementById('editSetModal')).show();
};

editSetForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(editSetForm);
    const setId = editSetForm.dataset.setId;

    editNameInput.style.borderColor = '#ced4da';
    editSaleInput.style.borderColor = '#ced4da';
    editNameError.innerText = '';
    editSaleError.innerText = '';

    let res = await fetch(`/api/admin/set/${setId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: formData.get('name'),
            sale: formData.get('sale')
        })
    });

    if (res.ok) {
        document.location.reload();
    } else {
        res = await res.json();

        if (res.name) {
            editNameInput.style.borderColor = 'rgb(255, 0, 0)';
            switch (res.name) {
                case 'nameIsRequired':
                    editNameError.innerText = 'Ad məcburidir';
                    break;

                case 'nameIsUsed':
                    editNameError.innerText = 'Ad istifadə olunub';
                    break;
            };
        };

        if (res.sale) {
            editSaleInput.style.borderColor = 'rgb(255, 0, 0)';
            switch (res.sale) {
                case 'saleIsRequired':
                    editSaleError.innerText = 'Satış qiyməti məcburidir';
                    break;

                case 'saleIsNotNumber':
                    editSaleError.innerText = 'Satış qiyməti rəqəm olmalıdır';
                    break;

                case 'saleIsNotPositive':
                    editSaleError.innerText = 'Satış qiyməti müsbət olmalıdır';
                    break;
            };
        };
    };
});

async function deleteSet(id) {
    if (!confirm('Set silinsin?')) {
        return;
    };

    let res = await fetch(`/api/admin/set/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (res.ok) {
        document.location.reload();
    };
};