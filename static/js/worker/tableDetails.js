const detailsForm = document.getElementById('detailsForm');
const detailsFormContent = document.getElementById('detailsFormContent');
const detailsModal = document.getElementById('detailsModal');

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
    detailsFormContent.innerHTML = '';

    if (table.role === 'playstation') {
        detailsFormContent.innerHTML += `
                <div class="col-12">
                    <div class="d-grid">
                        <button class="btn btn-primary btn-lg" type="text">Vaxt qur</button>
                    </div>
                </div>
            `;
    };

    detailsFormContent.innerHTML += `
            <div class="col-12">
                <div class="d-grid">
                    <button class="btn btn-primary btn-lg" type="text" onclick="openAddOrder(${id});">Sifariş əlavə et</button>
                </div>
            </div>
        `;

    if (tableIsActive) {
        detailsFormContent.innerHTML += `
                <div class="col-12">
                    <div class="d-grid">
                        <button class="btn btn-primary btn-lg" type="text">Masanı bağla</button>
                    </div>
                </div>
            `;
    };

    detailsForm.dataset.tableId = id;
    openModal(detailsModal);
};