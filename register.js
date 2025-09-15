// register.js - Registration page functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Register page loaded successfully');
    
    const registerForm = document.getElementById('registerForm');
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const studentIdInput = document.getElementById('studentId');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const collegeSelect = document.getElementById('college');
    const agreeTermsCheckbox = document.getElementById('agreeTerms');
    
    // Form validation and submission
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                fullName: fullNameInput.value.trim(),
                email: emailInput.value.trim(),
                studentId: studentIdInput.value.trim(),
                password: passwordInput.value,
                confirmPassword: confirmPasswordInput.value,
                college: collegeSelect.value,
                agreeTerms: agreeTermsCheckbox.checked
            };
            
            // Validate form
            if (!validateForm(formData)) {
                return;
            }
            
            // Simulate registration process
            showLoading(true);
            
            setTimeout(() => {
                showLoading(false);
                showAlert('Account created successfully! Redirecting to login...', 'success');
                
                // Store registration data
                localStorage.setItem('registeredUser', JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    studentId: formData.studentId,
                    college: formData.college,
                    registeredAt: new Date().toISOString()
                }));
                
                // Redirect to login page
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            }, 2000);
        });
    }
    
    // Real-time validation
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            validatePassword(this.value);
        });
    }
    
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            validatePasswordMatch();
        });
    }
    
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            validateEmail(this.value);
        });
    }
    
    // Social login buttons
    const googleBtn = document.querySelector('.google-btn');
    const microsoftBtn = document.querySelector('.microsoft-btn');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', function() {
            showAlert('Google registration integration coming soon!', 'info');
        });
    }
    
    if (microsoftBtn) {
        microsoftBtn.addEventListener('click', function() {
            showAlert('Microsoft registration integration coming soon!', 'info');
        });
    }
    
    // Terms and Privacy links
    const termsLink = document.querySelector('.terms-link');
    const privacyLink = document.querySelector('.privacy-link');
    
    if (termsLink) {
        termsLink.addEventListener('click', function(e) {
            e.preventDefault();
            showTermsModal();
        });
    }
    
    if (privacyLink) {
        privacyLink.addEventListener('click', function(e) {
            e.preventDefault();
            showPrivacyModal();
        });
    }
    
    function validateForm(formData) {
        let isValid = true;
        
        // Full name validation
        if (!formData.fullName || formData.fullName.length < 2) {
            showFieldError('fullName', 'Please enter a valid full name');
            isValid = false;
        } else {
            clearFieldError('fullName');
        }
        
        // Email validation
        if (!isValidEmail(formData.email)) {
            showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        } else {
            clearFieldError('email');
        }
        
        // Password validation
        if (!isValidPassword(formData.password)) {
            showFieldError('password', 'Password must be at least 8 characters with letters and numbers');
            isValid = false;
        } else {
            clearFieldError('password');
        }
        
        // Confirm password validation
        if (formData.password !== formData.confirmPassword) {
            showFieldError('confirmPassword', 'Passwords do not match');
            isValid = false;
        } else {
            clearFieldError('confirmPassword');
        }
        
        // College validation
        if (!formData.college) {
            showFieldError('college', 'Please select your college/university');
            isValid = false;
        } else {
            clearFieldError('college');
        }
        
        // Terms agreement validation
        if (!formData.agreeTerms) {
            showAlert('Please agree to the Terms of Service and Privacy Policy', 'error');
            isValid = false;
        }
        
        return isValid;
    }
    
    function validatePassword(password) {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
        const isValid = passwordRegex.test(password);
        
        if (password.length > 0) {
            if (isValid) {
                clearFieldError('password');
                showFieldSuccess('password', 'Password strength: Good');
            } else {
                showFieldError('password', 'Password must be at least 8 characters with letters and numbers');
            }
        }
        
        return isValid;
    }
    
    function validatePasswordMatch() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (confirmPassword.length > 0) {
            if (password === confirmPassword) {
                clearFieldError('confirmPassword');
                showFieldSuccess('confirmPassword', 'Passwords match');
            } else {
                showFieldError('confirmPassword', 'Passwords do not match');
            }
        }
    }
    
    function validateEmail(email) {
        if (email.length > 0) {
            if (isValidEmail(email)) {
                clearFieldError('email');
                showFieldSuccess('email', 'Email format is valid');
            } else {
                showFieldError('email', 'Please enter a valid email address');
            }
        }
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function isValidPassword(password) {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
        return passwordRegex.test(password);
    }
    
    function showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (!field) return;
        
        // Remove existing error
        clearFieldError(fieldId);
        
        // Add error styling
        field.style.borderColor = '#ef4444';
        
        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 0.25rem;
        `;
        
        field.parentNode.appendChild(errorDiv);
    }
    
    function clearFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        if (!field) return;
        
        // Remove error styling
        field.style.borderColor = '#e2e8f0';
        
        // Remove error message
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Remove success message
        const existingSuccess = field.parentNode.querySelector('.field-success');
        if (existingSuccess) {
            existingSuccess.remove();
        }
    }
    
    function showFieldSuccess(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (!field) return;
        
        // Remove existing success
        const existingSuccess = field.parentNode.querySelector('.field-success');
        if (existingSuccess) {
            existingSuccess.remove();
        }
        
        // Add success styling
        field.style.borderColor = '#10b981';
        
        // Add success message
        const successDiv = document.createElement('div');
        successDiv.className = 'field-success';
        successDiv.textContent = message;
        successDiv.style.cssText = `
            color: #10b981;
            font-size: 0.875rem;
            margin-top: 0.25rem;
        `;
        
        field.parentNode.appendChild(successDiv);
    }
    
    function showTermsModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h3>Terms of Service</h3>
                <div class="modal-body">
                    <p><strong>Mental Wellness Hub Terms of Service</strong></p>
                    <p>By using our platform, you agree to:</p>
                    <ul>
                        <li>Use the service responsibly and respectfully</li>
                        <li>Maintain confidentiality of other users' information</li>
                        <li>Not share inappropriate or harmful content</li>
                        <li>Seek professional help for serious mental health concerns</li>
                        <li>Respect the privacy and dignity of all users</li>
                    </ul>
                    <p>This service is designed to complement, not replace, professional mental health care.</p>
                </div>
                <button class="btn btn-primary" onclick="this.closest('.modal').remove()">I Understand</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal functionality
        const closeBtn = modal.querySelector('.close');
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    function showPrivacyModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h3>Privacy Policy</h3>
                <div class="modal-body">
                    <p><strong>Your Privacy Matters</strong></p>
                    <p>We are committed to protecting your privacy:</p>
                    <ul>
                        <li>All data is encrypted and stored securely</li>
                        <li>Your conversations are confidential</li>
                        <li>We never share your personal information without consent</li>
                        <li>You can delete your account and data at any time</li>
                        <li>We comply with all applicable privacy laws</li>
                    </ul>
                    <p>For more details, please contact our privacy team.</p>
                </div>
                <button class="btn btn-primary" onclick="this.closest('.modal').remove()">I Understand</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal functionality
        const closeBtn = modal.querySelector('.close');
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    function showLoading(show) {
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        if (show) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Create Account';
        }
    }
    
    function showAlert(message, type) {
        // Remove existing alerts
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        
        // Style the alert
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        if (type === 'success') {
            alert.style.backgroundColor = '#10b981';
        } else if (type === 'error') {
            alert.style.backgroundColor = '#ef4444';
        } else if (type === 'info') {
            alert.style.backgroundColor = '#3b82f6';
        }
        
        document.body.appendChild(alert);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            alert.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.remove();
                }
            }, 300);
        }, 3000);
    }
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .modal {
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .modal-content {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
        }
        .close {
            position: absolute;
            right: 1rem;
            top: 1rem;
            font-size: 1.5rem;
            cursor: pointer;
        }
        .modal-body {
            margin: 1rem 0;
            line-height: 1.6;
        }
        .modal-body ul {
            margin: 1rem 0;
            padding-left: 1.5rem;
        }
        .modal-body li {
            margin-bottom: 0.5rem;
        }
    `;
    document.head.appendChild(style);
});




