const productListDiv = document.getElementById('productList');
const addProductForm = document.getElementById('addProductForm');
const increaseProductForm = document.getElementById('increaseProductForm');
const editProductForm = document.getElementById('editProductForm');
const searchInput = document.getElementById('searchInput');
const categoryOption = document.getElementById('categoryOption');
const categoryInputs = document.getElementById('categoryInputs');
const nameInput = document.getElementById('name');
const nameError = document.getElementById('nameError');
const saleInput = document.getElementById('sale');
const saleError = document.getElementById('saleError');
const categoryError = document.getElementById('categoryError');
const increaseQuantityInput = document.getElementById('increaseQuantity');
const increaseQuantityError = document.getElementById('increaseQuantityError');
const increasePurchaseİnput = document.getElementById('increasePurchase');
const increasePurchaseError = document.getElementById('increasePurchaseError');
const editNameInput = document.getElementById('editName');
const editNameError = document.getElementById('editNameError');
const editSaleInput = document.getElementById('editSale');
const editSaleError = document.getElementById('editSaleError');

function displayProducts(productList) {
    productListDiv.innerHTML = '';
    productList.forEach(product => {
        productListDiv.innerHTML += `
          <div class="row bg-light py-2 rounded border mt-2">
            <div class="col-2">${product.name}</div> 
            <div class="col-2">${product.category}</div> 
            <div class="col-1">${product.quantity}</div>  
            <div class="col-2">${product.purchase} azn</div>
            <div class="col-2">${product.sale} azn</div>
            <div class="col-3 text-center">
                <button class="btn btn-primary btn-sm mx-1" onclick="increaseProduct(${product.id})">Artır</button>
                <button class="btn btn-warning btn-sm mx-1" onclick="editProduct(${product.id})">Yenilə</button>
                <button class="btn btn-danger btn-sm mx-1" onclick="deleteProduct(${product.id})">Sil</button>
            </div>
          </div>
        `;
    });
};

function placementCategories(categoryList) {
    categoryInputs.innerHTML = '';
    categoryList.forEach(category => {
        categoryInputs.innerHTML += `
            <input type="radio" class="btn-check" id="category${category.id}" name="category" value="${category.en}">
            <label for="category${category.id}" class="btn btn-outline-primary rounded-pill flex-fill">${category.az}</label>
        `;
    });

    categoryList.forEach(category => {
        categoryOption.innerHTML += `
            <option value="${category.en}">${category.az}</option>
        `;
    });
};

async function getProducts() {
    let res = await fetch('/api/admin/product/warehouse', {
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

let products = [];
let categories = [];
document.addEventListener("DOMContentLoaded", async function () {
    products = await getProducts();
    categories = await getCategories();
    displayProducts(products);
    placementCategories(categories);
});

function searchProduct() {
    const searchQuery = searchInput.value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery)
    );
    displayProducts(filteredProducts);
    categoryOption.value = '';
};

function selectCategory() {
    const category = categoryOption.value;
    if (!category) {
        displayProducts(products);
    } else {
        const filteredProducts = products.filter(product =>
            product.category === category
        );
        displayProducts(filteredProducts);
    };
    searchInput.value = '';
};

addProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(addProductForm);

    nameInput.style.borderColor = '#ced4da';
    saleInput.style.borderColor = '#ced4da';
    nameError.innerText = '';
    saleError.innerText = '';
    categoryError.innerText = '';

    let res = await fetch('/api/admin/product', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: formData.get('name'),
            sale: formData.get('sale'),
            category: formData.get('category'),
            type: 'warehouse'
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

        if (res.category) {
            switch (res.category) {
                case 'categoryIsRequired':
                    categoryError.innerText = 'Kategoriya seçmək məcburidir';
                    break;
            };
        };
    };
});

function increaseProduct(id) {
    const product = products.find(product => product.id === id);
    if (!product) return;

    increaseProductForm.dataset.productId = id;

    new bootstrap.Modal(document.getElementById('increaseProductModal')).show();
};

increaseProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(increaseProductForm);
    const productId = increaseProductForm.dataset.productId;

    let res = await fetch(`/api/admin/product/increase/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            quantity: formData.get('quantity'),
            purchase: formData.get('purchase')
        })
    });

    if (res.ok) {
        document.location.reload()
    } else {
        res = await res.json();
        console.log(res);
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

    let res = await fetch(`/api/admin/product/${productId}`, {
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
    if (!confirm('Məhsul silinsin?')) {
        return;
    };

    let res = await fetch(`/api/admin/product/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (res.ok) {
        document.location.reload();
    } else {
        alert('Bu məhsul silinə bilməz, sayı 0-dan çoxdur');
    };
};