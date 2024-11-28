const productListDiv = document.getElementById('productList');
const addSetForm = document.getElementById('addSetForm');
const editSetForm = document.getElementById('editSetForm');
const addToSetForm = document.getElementById('addToSetForm');
const searchInput = document.getElementById('searchInput');
const nameInput = document.getElementById('name');
const nameError = document.getElementById('nameError');
const saleInput = document.getElementById('sale');
const saleError = document.getElementById('saleError');
const editNameInput = document.getElementById('editName');
const editNameError = document.getElementById('editNameError');
const editSaleInput = document.getElementById('editSale');
const editSaleError = document.getElementById('editSaleError');


function displayProducts(productList) {
    productListDiv.innerHTML = '';
    productList.forEach(product => {
        productListDiv.innerHTML += `
            <div class="row bg-light py-2 rounded border mt-2">
                <div class="col-5">${product.name}</div>
                <div class="col-3">${product.sale} azn</div>
                <div class="col-4 text-center">
                    <button class="btn btn-primary btn-sm mx-1" onclick="addToSet(${product.id})">Setə əlavə et</button>
                    <button class="btn btn-warning btn-sm mx-1" onclick="editSet(${product.id})">Redaktə et</button>
                    <button class="btn btn-danger btn-sm mx-1" onclick="deleteSet(${product.id})">Sil</button>
                </div>
            </div>
        `;
    });
};

async function getProducts() {
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

let products = [];
document.addEventListener("DOMContentLoaded", async function () {
    products = await getProducts();
    displayProducts(products);
});

function searchProduct() {
    const searchQuery = searchInput.value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery)
    );
    displayProducts(filteredProducts);
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

///////////////
///////////////
///////////////
///////////////   add to set
///////////////
///////////////
///////////////

function editSet(id) {
    const product = products.find(product => product.id === id);
    if (!product) return;

    editNameInput.value = product.name;
    editSaleInput.value = product.sale;

    editSetForm.dataset.productId = id;

    new bootstrap.Modal(document.getElementById('editSetModal')).show();
};

editSetForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(editSetForm);
    const productId = editSetForm.dataset.productId;

    editNameInput.style.borderColor = '#ced4da';
    editSaleInput.style.borderColor = '#ced4da';
    editNameError.innerText = '';
    editSaleError.innerText = '';

    let res = await fetch(`/api/admin/set/${productId}`, {
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

async function deleteProduct(id) {
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