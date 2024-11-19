const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(loginForm);
    const passwordInput = document.getElementById('password');
    const passwordError = document.getElementById('passwordError');
    
    passwordInput.style.borderColor = '#ced4da';
    passwordError.innerText = '';

    try {
        let res = await fetch('/api/admin/login', {
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
            res = await res.json();

            if (res.password) {
                switch (res.password) {
                    case 'passwordIsRequired':
                        passwordInput.style.borderColor = 'rgb(255, 0, 0)';
                        passwordError.innerText = 'Parol məcburidir';
                        break;

                    case 'passwordIsIncorrect':
                        passwordInput.style.borderColor = 'rgb(255, 0, 0)';
                        passwordError.innerText = 'Parol yanlışdır';
                        break;
                };
            };
        };
    } catch (error) {
        console.error('err:::', error);
    };
});