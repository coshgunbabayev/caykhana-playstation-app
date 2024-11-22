function openModal(modal) {
    new bootstrap.Modal(modal).show();
};

function closeModal(modal) {
    new bootstrap.Modal(modal).hide();
};

async function isActive(id) {
    let res = await fetch(`/api/worker/table/${id}/is-active`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (res.ok) {
        res = await res.json();
        return res.isActive;
    };

    return false;
};
