const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.addEventListener('click', async () => {
    let res = await fetch('/api/admin/logout', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (res.ok) {
        document.location.href = '/';
    } else {
        res = await res.json();

        alert(res.message);
    };
});