const tablesDiv = document.getElementById('tablesDiv');
const addTabelForm = document.getElementById('addTabelForm');
const nameInput = document.getElementById('name');
const nameError = document.getElementById('nameError');
const roleError = document.getElementById('roleError');

async function getTables() {
    let res = await fetch('/api/admin/table', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (res.ok) {
        res = await res.json();
        const tables = res.tables;

        function role(role) {
            if (role === 'playstation') {
                return 'Playstation';
            } else if (role === 'food') {
                return 'Yemək';
            };
        };

        for (const table of tables) {
            tablesDiv.innerHTML += `
                <div class="col-auto">
                    <div class="card custom-card border-primary">
                        <button class="btn btn-danger card-btn" onclick="deleteTable('${table.id}')">Sil</button>
                        <div class="card-body">
                            <h5 class="card-title fw-bold text-primary">${table.name}</h5>
                            <h6 class="card-title fw-bold text-primary">${role(table.role)}</h6>
                        </div>
                    </div>
                </div>
            `;
        };
    } else {
        res = await res.json();
        alert(res.message);
    };
};

document.addEventListener('DOMContentLoaded', () => {
    getTables();
});

addTabelForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(addTabelForm);

    nameInput.style.borderColor = '#ced4da';
    nameError.innerText = '';
    roleError.innerText = '';

    try {
        let res = await fetch('/api/admin/table', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: formData.get('name'),
                role: formData.get('role')
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

            if (res.role) {
                switch (res.role) {
                    case 'roleIsRequired':
                        roleError.innerText = 'Rol seçmək məcburidir';
                        break;
                };
            };
        };
    } catch (err) {
        console.error('err:::', error);
    };
});

async function deleteTable(id) {
    if (!confirm('Masa silinsin?')) {
        return;
    };

    let res = await fetch(`/api/admin/table/${id}`, {
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