document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const Email = document.getElementById('email').value;
    const Contrasena = document.getElementById('password').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Email, Contrasena })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirigir según rol
            if (data.user.IDRol === 2) {
                window.location.href = '/page/admin.html';
            } else {
                window.location.href = '/page/reservas.html';
            }
        } else {
            const error = await response.json();
            document.getElementById('errorMessage').textContent = error.message || 'Error al iniciar sesión';
        }
    } catch (error) {
        document.getElementById('errorMessage').textContent = 'Error de conexión';
    }
});