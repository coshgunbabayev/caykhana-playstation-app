const tablesDiv = document.getElementById('tablesDiv');
const addTabelForm = document.getElementById('addTabelForm');

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

        for (const table of tables) {
            tablesDiv.innerHTML += `
                <div class="col-auto">
                    <div class="card custom-card border-primary">
                        <button class="btn btn-danger card-btn" onclick="deleteTable('${table.id}')">Sil</button>
                        <div class="card-body">
                            <h5 class="card-title fw-bold text-primary">${table.name}</h5>
                            <p class="card-title fw-bold text-primary">${table.role}</p>
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

    try {
        let res = await fetch('/api/admin/table', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: formData.get('name')
            })
        });

        if (res.ok) {
            document.location.reload();
        } else {
            res = await res.json();

            alert(res);
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