document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');
    const correctPassword = '123';

    function checkPassword(currentValue) {
        if (currentValue === correctPassword) {
            // Add success animation
            passwordInput.style.backgroundColor = '#e8f5e9';
            
            // Small delay for the success animation
            setTimeout(() => {
                // Store authentication state
                sessionStorage.setItem('authenticated', 'true');
                // Redirect to home page
                window.location.href = 'home.html';
            }, 300);
        } else if (correctPassword.startsWith(currentValue)) {
            // Valid so far
            errorMessage.textContent = '';
            passwordInput.style.backgroundColor = '#fff';
        } else {
            // Wrong path
            errorMessage.textContent = 'hmm... try again';
            passwordInput.style.backgroundColor = '#ffebee';
            // Shake animation
            errorMessage.style.animation = 'shake 0.5s';
            setTimeout(() => {
                errorMessage.style.animation = '';
            }, 500);
        }
    }

    // Check on every keystroke
    passwordInput.addEventListener('input', function(e) {
        checkPassword(e.target.value);
    });

    // Submit button still works
    submitButton.addEventListener('click', function() {
        checkPassword(passwordInput.value);
    });
});