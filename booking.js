// booking.js - Counsellor booking page functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Booking page loaded successfully');
    
    let currentStep = 1;
    let selectedCounsellor = null;
    let selectedDate = null;
    let selectedTime = null;
    let selectedSessionType = 'in-person';
    
    // Initialize booking system
    initializeBookingSteps();
    initializeCounsellorSelection();
    initializeDateTimeSelection();
    initializeSessionTypeSelection();
    loadCounsellors();
    
    function initializeBookingSteps() {
        const steps = document.querySelectorAll('.step');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const confirmBtn = document.getElementById('confirmBtn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', previousStep);
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', nextStep);
        }
        
        if (confirmBtn) {
            confirmBtn.addEventListener('click', confirmBooking);
        }
    }
    
    function initializeCounsellorSelection() {
        const counsellorCards = document.querySelectorAll('.counsellor-card');
        
        counsellorCards.forEach(card => {
            const selectBtn = card.querySelector('.btn-primary');
            if (selectBtn) {
                selectBtn.addEventListener('click', function() {
                    const counsellorId = card.dataset.counsellor;
                    selectCounsellor(counsellorId);
                });
            }
        });
    }
    
    function initializeDateTimeSelection() {
        const dateBtns = document.querySelectorAll('.date-btn');
        const timeBtns = document.querySelectorAll('.time-btn');
        
        dateBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove previous selection
                dateBtns.forEach(b => b.classList.remove('active'));
                
                // Add selection to clicked button
                this.classList.add('active');
                selectedDate = this.dataset.date;
                
                console.log('Date selected:', selectedDate);
            });
        });
        
        timeBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove previous selection
                timeBtns.forEach(b => b.classList.remove('active'));
                
                // Add selection to clicked button
                this.classList.add('active');
                selectedTime = this.dataset.time;
                
                console.log('Time selected:', selectedTime);
            });
        });
    }
    
    function initializeSessionTypeSelection() {
        const sessionOptions = document.querySelectorAll('input[name="sessionType"]');
        
        sessionOptions.forEach(option => {
            option.addEventListener('change', function() {
                selectedSessionType = this.value;
                updateSessionLocation();
                console.log('Session type selected:', selectedSessionType);
            });
        });
    }
    
    function loadCounsellors() {
        // Simulate loading counsellors from backend
        const counsellors = [
            {
                id: 'dr-smith',
                name: 'Dr. Sarah Smith',
                specialization: 'Clinical Psychologist',
                specialties: ['Anxiety', 'Depression', 'Academic Stress'],
                rating: 4.9,
                reviews: 127,
                availability: 'Available today'
            },
            {
                id: 'dr-johnson',
                name: 'Dr. Michael Johnson',
                specialization: 'Counselling Psychologist',
                specialties: ['Relationships', 'Career Guidance', 'Life Transitions'],
                rating: 4.8,
                reviews: 89,
                availability: 'Available tomorrow'
            },
            {
                id: 'ms-wilson',
                name: 'Ms. Lisa Wilson',
                specialization: 'Mental Health Counsellor',
                specialties: ['Trauma', 'Self-esteem', 'Mindfulness'],
                rating: 4.9,
                reviews: 156,
                availability: 'Available today'
            }
        ];
        
        console.log('Counsellors loaded:', counsellors);
    }
    
    // Global functions
    window.selectCounsellor = function(counsellorId) {
        selectedCounsellor = counsellorId;
        
        // Remove previous selection
        document.querySelectorAll('.counsellor-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Add selection to clicked card
        const selectedCard = document.querySelector(`[data-counsellor="${counsellorId}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
        
        console.log('Counsellor selected:', counsellorId);
        
        // Enable next step
        updateStepButtons();
    };
    
    window.nextStep = function() {
        if (currentStep < 3) {
            // Validate current step
            if (!validateCurrentStep()) {
                return;
            }
            
            currentStep++;
            updateStepDisplay();
            updateStepButtons();
        }
    };
    
    window.previousStep = function() {
        if (currentStep > 1) {
            currentStep--;
            updateStepDisplay();
            updateStepButtons();
        }
    };
    
    window.confirmBooking = function() {
        if (!validateBooking()) {
            return;
        }
        
        // Create booking object
        const booking = {
            counsellor: selectedCounsellor,
            date: selectedDate,
            time: selectedTime,
            sessionType: selectedSessionType,
            concerns: document.getElementById('concerns')?.value || '',
            preferences: document.getElementById('preferences')?.value || '',
            timestamp: new Date().toISOString()
        };
        
        // Save booking
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        bookings.push(booking);
        localStorage.setItem('bookings', JSON.stringify(bookings));
        
        // Show success modal
        showBookingSuccess(booking);
    };
    
    window.viewMyAppointments = function() {
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        
        if (bookings.length === 0) {
            showAlert('No appointments found. Book your first session!', 'info');
            return;
        }
        
        // Create modal to show appointments
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        
        const appointmentsHTML = bookings.map((booking, index) => `
            <div class="appointment-item">
                <div class="appointment-header">
                    <h4>Appointment ${index + 1}</h4>
                    <span class="appointment-status">Confirmed</span>
                </div>
                <div class="appointment-details">
                    <p><strong>Counsellor:</strong> ${getCounsellorName(booking.counsellor)}</p>
                    <p><strong>Date:</strong> ${formatDate(booking.date)}</p>
                    <p><strong>Time:</strong> ${booking.time}</p>
                    <p><strong>Type:</strong> ${booking.sessionType}</p>
                </div>
            </div>
        `).join('');
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h3>Your Appointments</h3>
                <div class="appointments-list">
                    ${appointmentsHTML}
                </div>
                <button class="btn btn-primary" onclick="this.closest('.modal').remove()">Close</button>
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
    };
    
    function validateCurrentStep() {
        switch(currentStep) {
            case 1:
                if (!selectedCounsellor) {
                    showAlert('Please select a counsellor', 'error');
                    return false;
                }
                break;
            case 2:
                if (!selectedDate || !selectedTime) {
                    showAlert('Please select both date and time', 'error');
                    return false;
                }
                break;
        }
        return true;
    }
    
    function validateBooking() {
        const consent = document.getElementById('consent');
        if (!consent || !consent.checked) {
            showAlert('Please agree to the terms of service', 'error');
            return false;
        }
        
        return validateCurrentStep();
    }
    
    function updateStepDisplay() {
        // Update step indicators
        document.querySelectorAll('.step').forEach((step, index) => {
            if (index + 1 <= currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        // Show/hide sections
        document.querySelectorAll('.booking-section').forEach((section, index) => {
            if (index + 1 === currentStep) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
        
        // Update summary if on step 3
        if (currentStep === 3) {
            updateBookingSummary();
        }
    }
    
    function updateStepButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const confirmBtn = document.getElementById('confirmBtn');
        
        if (prevBtn) {
            prevBtn.style.display = currentStep > 1 ? 'inline-block' : 'none';
        }
        
        if (nextBtn) {
            nextBtn.style.display = currentStep < 3 ? 'inline-block' : 'none';
        }
        
        if (confirmBtn) {
            confirmBtn.style.display = currentStep === 3 ? 'inline-block' : 'none';
        }
    }
    
    function updateBookingSummary() {
        const counsellorName = document.getElementById('selectedCounsellor');
        const date = document.getElementById('selectedDate');
        const time = document.getElementById('selectedTime');
        const sessionType = document.getElementById('selectedSessionType');
        const location = document.getElementById('sessionLocation');
        
        if (counsellorName) {
            counsellorName.textContent = getCounsellorName(selectedCounsellor);
        }
        
        if (date) {
            date.textContent = formatDate(selectedDate);
        }
        
        if (time) {
            time.textContent = selectedTime;
        }
        
        if (sessionType) {
            sessionType.textContent = selectedSessionType;
        }
        
        if (location) {
            location.textContent = getSessionLocation(selectedSessionType);
        }
    }
    
    function updateSessionLocation() {
        const location = document.getElementById('sessionLocation');
        if (location) {
            location.textContent = getSessionLocation(selectedSessionType);
        }
    }
    
    function getCounsellorName(counsellorId) {
        const counsellorNames = {
            'dr-smith': 'Dr. Sarah Smith',
            'dr-johnson': 'Dr. Michael Johnson',
            'ms-wilson': 'Ms. Lisa Wilson'
        };
        return counsellorNames[counsellorId] || 'Selected Counsellor';
    }
    
    function getSessionLocation(sessionType) {
        switch(sessionType) {
            case 'in-person':
                return 'Counselling Centre, Room 205';
            case 'video':
                return 'Secure online session';
            case 'phone':
                return 'Audio-only session';
            default:
                return 'To be determined';
        }
    }
    
    function formatDate(dateString) {
        if (!dateString) return 'Not selected';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
    
    function showBookingSuccess(booking) {
        const modal = document.getElementById('bookingSuccessModal');
        if (modal) {
            // Update modal content
            const finalCounsellor = document.getElementById('finalCounsellor');
            const finalDateTime = document.getElementById('finalDateTime');
            const finalLocation = document.getElementById('finalLocation');
            
            if (finalCounsellor) {
                finalCounsellor.textContent = getCounsellorName(booking.counsellor);
            }
            
            if (finalDateTime) {
                finalDateTime.textContent = `${formatDate(booking.date)} at ${booking.time}`;
            }
            
            if (finalLocation) {
                finalLocation.textContent = getSessionLocation(booking.sessionType);
            }
            
            modal.style.display = 'block';
        }
    }
    
    window.addToCalendar = function() {
        showAlert('Calendar integration coming soon!', 'info');
    };
    
    window.closeSuccessModal = function() {
        const modal = document.getElementById('bookingSuccessModal');
        if (modal) {
            modal.style.display = 'none';
        }
        
        // Reset form and go to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 500);
    };
    
    function showAlert(message, type) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        
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
        
        setTimeout(() => {
            alert.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.remove();
                }
            }, 300);
        }, 3000);
    }
    
    // Initialize step display
    updateStepDisplay();
    updateStepButtons();
    
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
        .counsellor-card.selected {
            border-color: #4F46E5;
            background-color: #f8fafc;
        }
        .date-btn.active, .time-btn.active {
            background-color: #4F46E5;
            color: white;
        }
        .appointment-item {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 1rem;
            margin-bottom: 1rem;
        }
        .appointment-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
        }
        .appointment-status {
            background: #10b981;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8rem;
        }
    `;
    document.head.appendChild(style);
});

