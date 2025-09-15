// mood-tracker.js - Mood tracker page functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Mood tracker page loaded successfully');
    
    let selectedMood = null;
    let selectedIntensity = 5;
    
    // Initialize mood tracker
    initializeMoodOptions();
    initializeIntensitySlider();
    initializeQuestions();
    loadMoodHistory();
    
    function initializeMoodOptions() {
        const moodOptions = document.querySelectorAll('.mood-option');
        
        moodOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remove previous selection
                moodOptions.forEach(opt => opt.classList.remove('selected'));
                
                // Add selection to clicked option
                this.classList.add('selected');
                selectedMood = this.dataset.mood;
                
                // Show intensity section
                const intensitySection = document.getElementById('intensitySection');
                if (intensitySection) {
                    intensitySection.style.display = 'block';
                    intensitySection.scrollIntoView({ behavior: 'smooth' });
                }
                
                console.log('Mood selected:', selectedMood);
            });
        });
    }
    
    function initializeIntensitySlider() {
        const intensityRange = document.getElementById('intensityRange');
        const intensityValue = document.getElementById('intensityValue');
        
        if (intensityRange && intensityValue) {
            intensityRange.addEventListener('input', function() {
                selectedIntensity = this.value;
                intensityValue.textContent = this.value;
                
                // Show questions section
                const questionsSection = document.getElementById('questionsSection');
                if (questionsSection) {
                    questionsSection.style.display = 'block';
                    questionsSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }
    
    function initializeQuestions() {
        const saveBtn = document.querySelector('.btn-primary');
        if (saveBtn) {
            saveBtn.addEventListener('click', saveMoodEntry);
        }
    }
    
    function saveMoodEntry() {
        if (!selectedMood) {
            showAlert('Please select a mood first', 'error');
            return;
        }
        
        // Get form data
        const concerns = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
            .map(cb => cb.value);
        
        const activities = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
            .map(cb => cb.value);
        
        const additionalNotes = document.getElementById('additionalNotes')?.value || '';
        
        // Create mood entry
        const moodEntry = {
            mood: selectedMood,
            intensity: selectedIntensity,
            concerns: concerns,
            activities: activities,
            notes: additionalNotes,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString()
        };
        
        // Save to localStorage
        const moodHistory = JSON.parse(localStorage.getItem('moodHistory') || '[]');
        moodHistory.push(moodEntry);
        localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
        
        // Show success message
        showAlert('Mood entry saved successfully!', 'success');
        
        // Show insights
        setTimeout(() => {
            showMoodInsights(moodEntry);
        }, 1000);
        
        // Reset form
        resetForm();
    }
    
    function showMoodInsights(moodEntry) {
        const insightsSection = document.getElementById('insightsSection');
        if (insightsSection) {
            insightsSection.style.display = 'block';
            insightsSection.scrollIntoView({ behavior: 'smooth' });
            
            // Generate insights based on mood
            const insights = generateInsights(moodEntry);
            updateInsightsContent(insights);
        }
    }
    
    function generateInsights(moodEntry) {
        const insights = {
            trend: 'Your mood has been stable over the past week',
            suggestions: []
        };
        
        // Analyze mood history for trends
        const moodHistory = JSON.parse(localStorage.getItem('moodHistory') || '[]');
        const recentMoods = moodHistory.slice(-7); // Last 7 entries
        
        if (recentMoods.length >= 3) {
            const moodValues = recentMoods.map(entry => {
                const moodMap = {
                    'joyful': 5, 'content': 4, 'neutral': 3, 
                    'worried': 2, 'sad': 1, 'angry': 1, 
                    'stressed': 1, 'lonely': 1
                };
                return moodMap[entry.mood] || 3;
            });
            
            const avgMood = moodValues.reduce((a, b) => a + b, 0) / moodValues.length;
            
            if (avgMood > 3.5) {
                insights.trend = 'Your mood has been positive overall! Keep up the great work.';
            } else if (avgMood < 2.5) {
                insights.trend = 'You\'ve been going through a tough time. Remember, it\'s okay to seek help.';
            }
        }
        
        // Generate suggestions based on current mood
        switch(moodEntry.mood) {
            case 'stressed':
            case 'worried':
                insights.suggestions = [
                    'Try our breathing exercises to calm your mind',
                    'Consider booking a session with a counsellor',
                    'Take a break and listen to calming sounds'
                ];
                break;
            case 'sad':
            case 'lonely':
                insights.suggestions = [
                    'Connect with our community for peer support',
                    'Try some positive affirmations',
                    'Consider reaching out to friends or family'
                ];
                break;
            case 'angry':
                insights.suggestions = [
                    'Take some deep breaths and count to 10',
                    'Try our guided meditation',
                    'Consider what might be triggering these feelings'
                ];
                break;
            default:
                insights.suggestions = [
                    'Keep up the great work!',
                    'Continue with your wellness routine',
                    'Share your positive energy with others'
                ];
        }
        
        return insights;
    }
    
    function updateInsightsContent(insights) {
        const trendElement = document.querySelector('.insight-item:first-child p');
        const suggestionsElement = document.querySelector('.insight-item:last-child p');
        
        if (trendElement) {
            trendElement.textContent = insights.trend;
        }
        
        if (suggestionsElement) {
            suggestionsElement.innerHTML = insights.suggestions
                .map(suggestion => `• ${suggestion}`)
                .join('<br>');
        }
    }
    
    function resetForm() {
        // Reset mood selection
        document.querySelectorAll('.mood-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        selectedMood = null;
        
        // Reset intensity
        const intensityRange = document.getElementById('intensityRange');
        if (intensityRange) {
            intensityRange.value = 5;
            document.getElementById('intensityValue').textContent = '5';
        }
        selectedIntensity = 5;
        
        // Reset checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });
        
        // Reset textarea
        const notesTextarea = document.getElementById('additionalNotes');
        if (notesTextarea) {
            notesTextarea.value = '';
        }
        
        // Hide sections
        document.getElementById('intensitySection').style.display = 'none';
        document.getElementById('questionsSection').style.display = 'none';
        document.getElementById('actionsSection').style.display = 'none';
        document.getElementById('insightsSection').style.display = 'none';
    }
    
    function loadMoodHistory() {
        const moodHistory = JSON.parse(localStorage.getItem('moodHistory') || '[]');
        console.log('Mood history loaded:', moodHistory);
    }
    
    // Global functions
    window.showMoodHistory = function() {
        const moodHistory = JSON.parse(localStorage.getItem('moodHistory') || '[]');
        
        if (moodHistory.length === 0) {
            showAlert('No mood history found. Start tracking your mood to see your progress!', 'info');
            return;
        }
        
        // Create modal to show mood history
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        
        const historyHTML = moodHistory.slice(-10).reverse().map(entry => `
            <div class="history-item">
                <div class="history-date">${entry.date}</div>
                <div class="history-mood">
                    <span class="mood-emoji">${getMoodEmoji(entry.mood)}</span>
                    <span class="mood-name">${entry.mood}</span>
                    <span class="mood-intensity">(${entry.intensity}/10)</span>
                </div>
                ${entry.notes ? `<div class="history-notes">${entry.notes}</div>` : ''}
            </div>
        `).join('');
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h3>Your Mood History</h3>
                <div class="mood-history-list">
                    ${historyHTML}
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
    
    function getMoodEmoji(mood) {
        const moodEmojis = {
            'joyful': '😄',
            'content': '😊',
            'neutral': '😐',
            'worried': '😟',
            'sad': '😢',
            'angry': '😠',
            'stressed': '😰',
            'lonely': '😔'
        };
        return moodEmojis[mood] || '😐';
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
            max-width: 600px;
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
        .history-item {
            padding: 1rem;
            border-bottom: 1px solid #e2e8f0;
            margin-bottom: 0.5rem;
        }
        .history-date {
            font-weight: 600;
            color: #4F46E5;
            margin-bottom: 0.5rem;
        }
        .history-mood {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.5rem;
        }
        .mood-emoji {
            font-size: 1.5rem;
        }
        .mood-name {
            text-transform: capitalize;
            font-weight: 500;
        }
        .mood-intensity {
            color: #64748b;
            font-size: 0.9rem;
        }
        .history-notes {
            color: #64748b;
            font-style: italic;
        }
    `;
    document.head.appendChild(style);
});

