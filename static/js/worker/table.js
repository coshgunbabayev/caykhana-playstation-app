const tablesDiv = document.getElementById('tablesDiv');

async function getTables() {
    let res = await fetch('/api/worker/table', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (res.ok) {
        res = await res.json();
        const tables = res.tables;

        const foodTables = tables.filter(table => table.role === 'food');
        const playstationTables = tables.filter(table => table.role === 'playstation');
        const sortedTables = foodTables.concat(playstationTables);

        function role(role) {
            if (role === 'playstation') {
                return 'Playstation';
            } else if (role === 'food') {
                return 'Yemək';
            };
        };

        for (const table of sortedTables) {
            tablesDiv.innerHTML += `
                <div class="col-auto">
                    <div class="card custom-card ${await isActive(table.id) ? 'active-custom-card' : ''} border-primary">
                        <button class="btn btn-primary card-btn" onclick="openDetails(${table.id})">Bax</button>
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