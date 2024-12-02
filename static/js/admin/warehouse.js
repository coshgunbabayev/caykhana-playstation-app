const productListDiv = document.getElementById('productList');
const addProductForm = document.getElementById('addProductForm');
const increaseProductForm = document.getElementById('increaseProductForm');
const reduceProductForm = document.getElementById('reduceProductForm');
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
const reduceQuantityInput = document.getElementById('reduceQuantity');
const reduceQuantityError = document.getElementById('reduceQuantityError');
const reduceRefundInput = document.getElementById('reduceRefund');
const reduceRefundError = document.getElementById('reduceRefundError');
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
            <div class="col-2">${categories.find(category => category.en === product.category).az}</div> 
            <div class="col-1">${product.quantity}</div>  
            <div class="col-2">${product.purchase} azn</div>
            <div class="col-2">${product.sale} azn</div>
            <div class="col-3 text-center">
                <button class="btn btn-primary btn-sm mx-1" onclick="increaseProduct(${product.id})">Artır</button>
                <button class="btn btn-primary btn-sm mx-1" onclick="reduceProduct(${product.id})">Azalt</button>
                <button class="btn btn-warning btn-sm mx-1" onclick="editProduct(${product.id})">Redaktə et</button>
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

    increaseQuantityInput.style.borderColor = '#ced4da';
    increasePurchaseİnput.style.borderColor = '#ced4da';
    increaseQuantityError.innerText = '';
    increasePurchaseError.innerText = '';

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

        if (res.quantity) {
            increaseQuantityInput.style.borderColor = 'rgb(255, 0, 0)';
            switch (res.quantity) {
                case 'quantityIsRequired':
                    increaseQuantityError.innerText = 'Say məcburidir';
                    break;

                case 'quantityIsNotNumber':
                    increaseQuantityError.innerText = 'Say ədəd olmalıdır';
                    break;

                case 'quantityIsNotWholeNumber':
                    increaseQuantityError.innerText = 'Say tam ədəd olmalıdır';
                    break;

                case 'quantityIsNotPositive':
                    increaseQuantityError.innerText = 'Say müsbət ədəd olmalıdır';
                    break;
            };
        };

        if (res.purchase) {
            increasePurchaseİnput.style.borderColor = 'rgb(255, 0, 0)';
            switch (res.purchase) {
                case 'purchaseIsRequired':
                    increasePurchaseError.innerText = 'Ümumi alış qiyməti məcburidir';
                    break;

                case 'purchaseIsNotNumber':
                    increasePurchaseError.innerText = 'Ümumi alış qiyməti ədəd olmalıdır';
                    break;

                case 'purchaseIsNotPositive':
                    increasePurchaseError.innerText = 'Ümumi alış qiyməti müsbət ədəd olmalıdır';
                    break;
            };
        };
    };
});

function reduceProduct(id) {
    const product = products.find(product => product.id === id);
    if (!product) return;

    reduceProductForm.dataset.productId = id;

    new bootstrap.Modal(document.getElementById('reduceProductModal')).show();
};

reduceProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(reduceProductForm);
    const productId = reduceProductForm.dataset.productId;

    reduceQuantityInput.style.borderColor = '#ced4da';
    reduceRefundInput.style.borderColor = '#ced4da';
    reduceQuantityError.innerText = '';
    reduceRefundError.innerText = '';

    let res = await fetch(`/api/admin/product/reduce/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            quantity: formData.get('quantity'),
            refund: formData.get('refund')
        })
    });

    if (res.ok) {
        document.location.reload()
    } else {
        res = await res.json();

        if (res.quantity) {
            reduceQuantityInput.style.borderColor = 'rgb(255, 0, 0)';
            switch (res.quantity) {
                case 'quantityIsRequired':
                    reduceQuantityError.innerText = 'Say məcburidir';
                    break;

                case 'quantityIsNotNumber':
                    reduceQuantityError.innerText = 'Say ədəd olmalıdır';
                    break;

                case 'quantityIsNotWholeNumber':
                    reduceQuantityError.innerText = 'Say tam ədəd olmalıdır';
                    break;

                case 'quantityIsNotPositive':
                    reduceQuantityError.innerText = 'Say müsbət ədəd olmalıdır';
                    break;
            };
        };

        if (res.refund) {
            reduceRefundInput.style.borderColor = 'rgb(255, 0, 0)';
            switch (res.refund) {
                case 'refundIsRequired':
                    reduceRefundError.innerText = 'Ümumi geri alınan pul məcburidir';
                    break;

                case 'refundIsNotNumber':
                    reduceRefundError.innerText = 'Ümumi geri alınan pul ədəd olmalıdır';
                    break;

                case 'refundIsNotPositive':
                    reduceRefundError.innerText = 'Ümumi geri alınan pul mənfi ədəd ola bilməz';
                    break;
            };
        };

        if (res.refund) {
            switch (res.refund) {
                case 'refundIsRequired':
                    reduceRefundError.innerText = 'Qaytarılma seçimini seçmək məcburidir';
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