const productListDiv = document.getElementById('productList');
const addProductForm = document.getElementById('addProductForm');
const editProductForm = document.getElementById('editProductForm');
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
            <div class="col-6">${product.name}</div>
            <div class="col-3">${product.sale}</div>
            <div class="col-3 text-center">
                <button class="btn btn-warning btn-sm mx-1" onclick="editProduct(${product.id})">Redaktə et</button>
                <button class="btn btn-danger btn-sm mx-1" onclick="deleteProduct(${product.id})">Sil</button>
            </div>
          </div>
        `;
    });
};

async function getProducts() {
    let res = await fetch('/api/admin/without-warehouse', {
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
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery)
    );
    displayProducts(filteredProducts);
};

addProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(addProductForm);

    nameInput.style.borderColor = '#ced4da';
    saleInput.style.borderColor = '#ced4da';
    nameError.innerText = '';
    saleError.innerText = '';

    let res = await fetch('/api/admin/without-warehouse', {
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
            switch (res.name) {
                case 'nameIsRequired':
                    nameInput.style.borderColor = 'rgb(255, 0, 0)';
                    nameError.innerText = 'Ad məcburidir';
                    break;

                case 'nameIsUsed':
                    nameInput.style.borderColor = 'rgb(255, 0, 0)';
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

function editProduct(id) {
    const product = products.find(product => product.id === id);
    if (!product) return;

    editNameInput.value = product.name;
    editSaleInput.value = product.sale;

    editProductForm.dataset.productId = id;

    new bootstrap.Modal(document.getElementById('editProductModal')).show();
};

editProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(editProductForm);
    const productId = editProductForm.dataset.productId;

    editNameInput.style.borderColor = '#ced4da';
    editSaleInput.style.borderColor = '#ced4da';
    editNameError.innerText = '';
    editSaleError.innerText = '';

    try {
        let res = await fetch(`/api/admin/without-warehouse/${productId}`, {
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
        }
    } catch (err) {
        console.error('Hata:', err);
    }
});


async function deleteProduct(id) {
    if (!confirm('Məhsul silinsin?')) {
        return;
    };

    let res = await fetch(`/api/admin/without-warehouse/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (res.ok) {
        document.location.reload();
    } else {
        res = await res.json();

        console.log(res);
    };
};