const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(loginForm);

    try {
        const res = await fetch('/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                password: formData.get('password')
            })
        });

        if (res.ok) {
            document.location.href = '/admin';
        } else {
            loginForm.reset();
            const errorData = await res.json();
            console.log(errorData);
        }
    } catch (error) {
        console.error('Bir hata oluştu:', error);
    };
});