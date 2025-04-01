document.addEventListener('DOMContentLoaded', () => {
    const signinForm = document.getElementById('signin__form');
    const signinDiv = document.getElementById('signin');
    const welcomeDiv = document.getElementById('welcome');
    const userIdSpan = document.getElementById('user_id');

    // Проверка авторизации при загрузке
    const savedUserId = localStorage.getItem('user_id');
    if (savedUserId) {
        signinDiv.classList.remove('signin_active');
        welcomeDiv.classList.add('welcome_active');
        userIdSpan.textContent = savedUserId;
    }

    // Обработка отправки формы
    signinForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch(signinForm.action, {
                method: 'POST',
                body: new FormData(signinForm),
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Сохранение и отображение данных
                localStorage.setItem('user_id', data.user_id);
                signinDiv.classList.remove('signin_active');
                welcomeDiv.classList.add('welcome_active');
                userIdSpan.textContent = data.user_id;
            } else {
                alert('Неверный логин/пароль');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка соединения с сервером');
        }

        // Очистка полей формы
        signinForm.querySelector('[name="login"]').value = '';
        signinForm.querySelector('[name="password"]').value = '';
    });

    // Динамическая кнопка выхода (опционально)
    const addLogoutButton = () => {
        const logoutBtn = document.createElement('button');
        logoutBtn.textContent = 'Выйти';
        logoutBtn.className = 'btn';
        logoutBtn.style.marginTop = '20px';
        logoutBtn.onclick = () => {
            localStorage.removeItem('user_id');
            welcomeDiv.classList.remove('welcome_active');
            signinDiv.classList.add('signin_active');
        };
        welcomeDiv.appendChild(logoutBtn);
    };
    
    if (savedUserId) addLogoutButton();
    welcomeDiv.addEventListener('DOMNodeInserted', () => {
        if (!welcomeDiv.querySelector('.btn')) addLogoutButton();
    });
});