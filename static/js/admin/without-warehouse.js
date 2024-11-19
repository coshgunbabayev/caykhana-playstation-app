const productListDiv = document.getElementById('productList');
const addProductForm = document.getElementById('addProductForm');
const editProductForm = document.getElementById('editProductForm');

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

    try {
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
            alert(res);
        };
    } catch (err) {
        console.error('err:::', err);
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
            alert(res);
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

        alert(res);
    };
};