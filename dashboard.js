// dashboard.js - Dashboard page functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard page loaded successfully');
    
    // Initialize dashboard
    initializeDashboard();
    
    // Mood tracker functionality
    initializeMoodTracker();
    
    // Instant relief buttons
    initializeInstantRelief();
    
    // Quick access buttons
    initializeQuickAccess();
    
    // Today's plan
    loadTodaysPlan();
    
    // Articles and videos
    loadRecommendedContent();
    
    // Bottom navigation
    initializeBottomNavigation();
    
    // Modal functionality
    initializeModal();
    
    function initializeDashboard() {
        // Check if user is logged in or in guest mode
        const isGuest = localStorage.getItem('guestMode') === 'true';
        const userEmail = localStorage.getItem('userEmail');
        
        const greeting = document.querySelector('.user-greeting');
        if (greeting) {
            if (isGuest) {
                greeting.textContent = 'Welcome, Guest! 👋';
            } else if (userEmail) {
                const userName = userEmail.split('@')[0];
                greeting.textContent = `Good ${getTimeOfDay()}, ${userName}! 👋`;
            } else {
                greeting.textContent = 'Welcome back! 👋';
            }
        }
        
        // Show affirmation only once when user first enters the website
        const hasSeenAffirmation = sessionStorage.getItem('hasSeenAffirmation');
        if (!hasSeenAffirmation) {
            setTimeout(() => {
                showAffirmation();
            }, 1000); // Show after 1 second delay
        }
    }
    
    function initializeMoodTracker() {
        const moodButtons = document.querySelectorAll('.mood-btn');
        let selectedMood = null;
        
        moodButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove previous selection
                moodButtons.forEach(btn => btn.classList.remove('selected'));
                
                // Add selection to clicked button
                this.classList.add('selected');
                selectedMood = this.dataset.mood;
                
                // Store mood selection
                localStorage.setItem('currentMood', selectedMood);
                localStorage.setItem('moodTimestamp', new Date().toISOString());
                
                console.log('Mood selected:', selectedMood);
            });
        });
        
        // Check if mood was already selected today
        const lastMoodTimestamp = localStorage.getItem('moodTimestamp');
        if (lastMoodTimestamp) {
            const lastMoodDate = new Date(lastMoodTimestamp);
            const today = new Date();
            
            if (isSameDay(lastMoodDate, today)) {
                const savedMood = localStorage.getItem('currentMood');
                if (savedMood) {
                    const savedButton = document.querySelector(`[data-mood="${savedMood}"]`);
                    if (savedButton) {
                        savedButton.classList.add('selected');
                    }
                }
            }
        }
    }
    
    function initializeInstantRelief() {
        const reliefButtons = document.querySelectorAll('.relief-btn');
        
        reliefButtons.forEach(button => {
            button.addEventListener('click', function() {
                const action = this.querySelector('span').textContent.toLowerCase();
                
                switch(action) {
                    case 'breathing':
                        window.location.href = 'breathing-exercises.html';
                        break;
                    case 'calming sound':
                        window.location.href = 'sounds.html';
                        break;
                    case 'affirmation':
                        showAffirmation();
                        break;
                    case 'sos support':
                        showSOSOptions();
                        break;
                }
            });
        });
    }
    
    function initializeQuickAccess() {
        const quickItems = document.querySelectorAll('.quick-item');
        
        quickItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const target = this.querySelector('span').textContent.toLowerCase();
                
                switch(target) {
                    case 'book counsellor':
                        window.location.href = 'booking.html';
                        break;
                    case 'chatbot':
                        window.location.href = 'chatbot.html';
                        break;
                    case 'community':
                        window.location.href = 'community.html';
                        break;
                    case 'health stats':
                        window.location.href = 'wearable-stats.html';
                        break;
                }
            });
        });
    }
    
    function loadTodaysPlan() {
        const planList = document.querySelector('.plan-list');
        if (!planList) return;
        
        const currentHour = new Date().getHours();
        let activities = [];
        
        // Generate activities based on time of day
        if (currentHour < 12) {
            activities = [
                { time: '9:00 AM', title: 'Morning Meditation', description: '5-minute mindfulness session', completed: false },
                { time: '10:30 AM', title: 'Study Break', description: '10-minute breathing exercise', completed: false }
            ];
        } else if (currentHour < 18) {
            activities = [
                { time: '2:00 PM', title: 'Afternoon Check-in', description: 'Quick mood assessment', completed: false },
                { time: '4:00 PM', title: 'Physical Activity', description: '15-minute walk or stretch', completed: false }
            ];
        } else {
            activities = [
                { time: '8:00 PM', title: 'Evening Reflection', description: 'Journal your thoughts', completed: false },
                { time: '9:30 PM', title: 'Wind Down', description: 'Listen to calming sounds', completed: false }
            ];
        }
        
        planList.innerHTML = activities.map(activity => `
            <div class="plan-item">
                <div class="plan-time">${activity.time}</div>
                <div class="plan-content">
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                </div>
                <button class="plan-btn" onclick="startActivity('${activity.title}')">Start</button>
            </div>
        `).join('');
    }
    
    function loadRecommendedContent() {
        const articlesGrid = document.querySelector('.articles-grid');
        if (!articlesGrid) return;
        
        const recommendations = [
            {
                title: 'Managing Exam Stress',
                description: '5 effective techniques to stay calm during exams',
                type: 'Article',
                duration: '8 min read',
                image: 'https://via.placeholder.com/150x100/4F46E5/FFFFFF?text=Exam+Stress'
            },
            {
                title: 'Guided Sleep Meditation',
                description: 'Fall asleep faster with this calming meditation',
                type: 'Audio',
                duration: '15 min',
                image: 'https://via.placeholder.com/150x100/4F46E5/FFFFFF?text=Sleep+Meditation'
            },
            {
                title: 'Building Healthy Relationships',
                description: 'Tips for maintaining friendships in college',
                type: 'Video',
                duration: '12 min watch',
                image: 'https://via.placeholder.com/150x100/4F46E5/FFFFFF?text=Relationships'
            }
        ];
        
        articlesGrid.innerHTML = recommendations.map(item => `
            <div class="article-item">
                <img src="${item.image}" alt="${item.title}">
                <div class="article-content">
                    <h4>${item.title}</h4>
                    <p>${item.description}</p>
                    <div class="article-meta">
                        <span class="duration">${item.duration}</span>
                        <span class="type">${item.type}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    function initializeBottomNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', function(e) {
                // Remove active class from all items
                navItems.forEach(nav => nav.classList.remove('active'));
                
                // Add active class to clicked item
                this.classList.add('active');
            });
        });
    }
    
    function initializeModal() {
        // Close modal when clicking the X button
        const closeBtn = document.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                const modal = document.getElementById('affirmationModal');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        }
        
        // Close modal when clicking outside
        const modal = document.getElementById('affirmationModal');
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
    }
    
    // Global functions
    window.startActivity = function(activityName) {
        showAlert(`Starting ${activityName}...`, 'success');
        
        // Navigate to appropriate page based on activity
        switch(activityName) {
            case 'Morning Meditation':
            case 'Study Break':
            case 'Afternoon Check-in':
                window.location.href = 'breathing-exercises.html';
                break;
            case 'Physical Activity':
                showAlert('Great! Take a walk or do some stretching.', 'info');
                break;
            case 'Evening Reflection':
                showAlert('Time for reflection! Consider journaling your thoughts.', 'info');
                break;
            case 'Wind Down':
                window.location.href = 'sounds.html';
                break;
        }
    };
    
    window.showAffirmation = function() {
        // Check if affirmation was already shown in this session
        const hasSeenAffirmation = sessionStorage.getItem('hasSeenAffirmation');
        
        if (hasSeenAffirmation === 'true') {
            showAlert('You\'ve already seen today\'s affirmation! Check back tomorrow for a new one.', 'info');
            return;
        }
        
        const affirmations = [
            "You are capable, resilient, and worthy of happiness. Take one step at a time.",
            "Your mental health matters, and it's okay to not be okay sometimes.",
            "You have overcome challenges before, and you will overcome this one too.",
            "Progress, not perfection. Every small step counts.",
            "You are stronger than you think and braver than you believe.",
            "It's okay to take breaks and prioritize your well-being.",
            "You deserve compassion, especially from yourself.",
            "This feeling is temporary, and you have the strength to get through it."
        ];
        
        const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
        
        // Use the existing modal in HTML
        const modal = document.getElementById('affirmationModal');
        const affirmationText = document.getElementById('affirmationText');
        
        if (modal && affirmationText) {
            affirmationText.textContent = randomAffirmation;
            modal.style.display = 'block';
            
            // Mark affirmation as shown in this session
            sessionStorage.setItem('hasSeenAffirmation', 'true');
        } else {
            // Fallback to dynamic modal
            showModal('Today\'s Positive Affirmation', randomAffirmation, [
                { text: 'Got it!', action: 'close' }
            ]);
            
            // Mark affirmation as shown in this session
            sessionStorage.setItem('hasSeenAffirmation', 'true');
        }
    };
    
    window.closeAffirmation = function() {
        const modal = document.getElementById('affirmationModal');
        if (modal) {
            modal.style.display = 'none';
        }
    };
    
    window.showSOSOptions = function() {
        showModal('Emergency Support', 'If you\'re in immediate danger or having thoughts of self-harm, please reach out for help immediately.', [
            { text: 'Call Helpline', action: 'helpline' },
            { text: 'Chat with AI', action: 'chatbot' },
            { text: 'Book Counsellor', action: 'booking' },
            { text: 'Close', action: 'close' }
        ]);
    };
    
    // Helper functions
    function getTimeOfDay() {
        const hour = new Date().getHours();
        if (hour < 12) return 'morning';
        if (hour < 17) return 'afternoon';
        return 'evening';
    }
    
    function isSameDay(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    }
    
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
    
    function showModal(title, content, buttons) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h3>${title}</h3>
                <p>${content}</p>
                <div class="modal-buttons">
                    ${buttons.map(btn => `<button class="btn btn-primary" data-action="${btn.action}">${btn.text}</button>`).join('')}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal functionality
        const closeBtn = modal.querySelector('.close');
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });
        
        // Button actions
        modal.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', function() {
                const action = this.dataset.action;
                
                switch(action) {
                    case 'close':
                        modal.remove();
                        break;
                    case 'helpline':
                        alert('Calling National Helpline: 1800-599-0019');
                        modal.remove();
                        break;
                    case 'chatbot':
                        window.location.href = 'chatbot.html';
                        break;
                    case 'booking':
                        window.location.href = 'booking.html';
                        break;
                }
            });
        });
        
        // Close on outside click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
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
            text-align: center;
            position: relative;
        }
        .modal-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-top: 1rem;
        }
        .close {
            position: absolute;
            right: 1rem;
            top: 1rem;
            font-size: 1.5rem;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);
});
