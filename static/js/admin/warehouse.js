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
            <div class="col-4">${product.name}</div>
            <div class="col-2">${product.quatity}</div>
            <div class="col-2">${product.purchase}</div>
            <div class="col-2">${product.sale}</div>
            <div class="col-2 text-center">
                <button class="btn btn-warning btn-sm mx-1" onclick="editProduct(${product.id})">Redaktə et</button>
                <button class="btn btn-danger btn-sm mx-1" onclick="deleteProduct(${product.id})">Sil</button>
            </div>
          </div>
        `;
    });
};

async function getProducts() {
    let res = await fetch('/api/admin/warehouse', {
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

    try {
        let res = await fetch('/api/admin/warehouse', {
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
                switch (res.sale) {
                    case 'saleIsRequired':
                        saleInput.style.borderColor = 'rgb(255, 0, 0)';
                        saleError.innerText = 'Satış qiyməti məcburidir';
                        break;

                    case 'saleIsNotNumber':
                        saleInput.style.borderColor = 'rgb(255, 0, 0)';
                        saleError.innerText = 'Satış qiyməti rəqəm olmalıdır';
                        break;

                    case 'saleIsNotPositive':
                        saleInput.style.borderColor = 'rgb(255, 0, 0)';
                        saleError.innerText = 'Satış qiyməti müsbət olmalıdır';
                        break;
                };
            };
        };
    } catch (err) {
        console.error('err:::', error);
    };
});

function editProduct(id) {
    const product = products.find(product => product.id === id);
    if (!product) return;

    document.getElementById('editName').value = product.name;
    document.getElementById('editSale').value = product.sale;

    editProductForm.dataset.productId = id;

    new bootstrap.Modal(document.getElementById('editProductModal')).show();
};

editProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(editProductForm);
    const productId = editProductForm.dataset.productId;

    try {
        let res = await fetch(`/api/admin/warehouse/${productId}`, {
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
                switch (res.name) {
                    case 'nameIsRequired':
                        editNameInput.style.borderColor = 'rgb(255, 0, 0)';
                        editNameError.innerText = 'Ad məcburidir';
                        break;

                    case 'nameIsUsed':
                        editNameInput.style.borderColor = 'rgb(255, 0, 0)';
                        editNameError.innerText = 'Ad istifadə olunub';
                        break;
                };
            };

            if (res.sale) {
                switch (res.sale) {
                    case 'saleIsRequired':
                        editSaleInput.style.borderColor = 'rgb(255, 0, 0)';
                        saleError.innerText = 'Satış qiyməti məcburidir';
                        break;

                    case 'saleIsNotNumber':
                        editSaleInput.style.borderColor = 'rgb(255, 0, 0)';
                        saleError.innerText = 'Satış qiyməti rəqəm olmalıdır';
                        break;

                    case 'saleIsNotPositive':
                        editSaleInput.style.borderColor = 'rgb(255, 0, 0)';
                        saleError.innerText = 'Satış qiyməti müsbət olmalıdır';
                        break;
                };
            };
        }
    } catch (err) {
        console.error('err:::', err);
    };
});

async function deleteProduct(id) {
    if (!confirm('Məhsul silinsin?')) {
        return;
    };

    let res = await fetch(`/api/admin/warehouse/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (res.ok) {
        document.location.reload();
    } else {
        res = await res.json();

        alert(res);
    };
};