// const productListDiv = document.getElementById('productList');
const addSetForm = document.getElementById('addSetForm');
// const editProductForm = document.getElementById('editProductForm');
// const searchInput = document.getElementById('searchInput');
// const categoryOption = document.getElementById('categoryOption');
// const categoryInputs = document.getElementById('categoryInputs');
const nameInput = document.getElementById('name');
const nameError = document.getElementById('nameError');
const saleInput = document.getElementById('sale');
const saleError = document.getElementById('saleError');
// const categoryError = document.getElementById('categoryError');
// const editNameInput = document.getElementById('editName');
// const editNameError = document.getElementById('editNameError');
// const editSaleInput = document.getElementById('editSale');
// const editSaleError = document.getElementById('editSaleError');


// function displayProducts(productList) {
//     productListDiv.innerHTML = '';
//     productList.forEach(product => {
//         productListDiv.innerHTML += `
//             <div class="row bg-light py-2 rounded border mt-2">
//                 <div class="col-5">${product.name}</div>
//                 <div class="col-3">${product.sale} azn</div>
//                 <div class="col-4 text-center">
//                     <button class="btn btn-warning btn-sm mx-1" onclick="editProduct(${product.id})">Setə əlavə et</button>
//                     <button class="btn btn-warning btn-sm mx-1" onclick="editProduct(${product.id})">Redaktə et</button>
//                     <button class="btn btn-danger btn-sm mx-1" onclick="deleteProduct(${product.id})">Sil</button>
//                 </div>
//             </div>
//         `;
//     });
// };

// async function getProducts() {
//     let res = await fetch('/api/admin/product/set', {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//         }
//     });

//     if (res.ok) {
//         res = await res.json();
//         return res.products;
//     } else {
//         return [];
//     };
// };

// let products = [];
// document.addEventListener("DOMContentLoaded", async function () {
//     products = await getProducts();
//     displayProducts(products);
// });

// function searchProduct() {
//     const searchQuery = searchInput.value.toLowerCase();
//     const filteredProducts = products.filter(product =>
//         product.name.toLowerCase().includes(searchQuery)
//     );
//     displayProducts(filteredProducts);
// };

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