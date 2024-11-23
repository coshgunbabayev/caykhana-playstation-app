const addOrderForm = document.getElementById('addOrderForm');
const addOrderFormContent = document.getElementById('addOrderFormContent');
const addOrderModal = document.getElementById('addOrderModal');

async function openAddOrder(id) {
    closeModal(detailsModal);
    addOrderForm.dataset.tableId = id;
    openModal(addOrderModal);
};