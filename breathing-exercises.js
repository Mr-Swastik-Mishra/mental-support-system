// breathing-exercises.js - Breathing exercises page functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Breathing exercises page loaded successfully');
    
    let currentExercise = null;
    let isRunning = false;
    let timer = null;
    let currentStep = 0;
    let cycleCount = 0;
    
    // Initialize breathing exercises
    initializeExerciseSelection();
    initializeBreathingModal();
    initializeQuickBreathing();
    
    function initializeExerciseSelection() {
        const exerciseCards = document.querySelectorAll('.exercise-card');
        
        exerciseCards.forEach(card => {
            card.addEventListener('click', function() {
                const exerciseType = this.dataset.exercise;
                startExercise(exerciseType);
            });
        });
    }
    
    function initializeBreathingModal() {
        // Modal functionality is handled by the HTML structure
        const closeBtn = document.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeBreathingExercise);
        }
    }
    
    function initializeQuickBreathing() {
        const quickBreathBtn = document.querySelector('.quick-breath-btn');
        if (quickBreathBtn) {
            quickBreathBtn.addEventListener('click', quickBreathing);
        }
    }
    
    // Global functions
    window.startExercise = function(exerciseType) {
        currentExercise = exerciseType;
        const modal = document.getElementById('breathingModal');
        if (modal) {
            modal.style.display = 'block';
            updateExerciseTitle(exerciseType);
            updateInstructions(exerciseType);
            resetExercise();
        }
    };
    
    window.startBreathingCycle = function() {
        if (isRunning) return;
        
        isRunning = true;
        currentStep = 0;
        cycleCount = 0;
        
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        
        if (startBtn) startBtn.style.display = 'none';
        if (pauseBtn) pauseBtn.style.display = 'inline-block';
        
        runBreathingCycle();
    };
    
    window.pauseExercise = function() {
        if (!isRunning) return;
        
        isRunning = false;
        clearInterval(timer);
        
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        
        if (startBtn) {
            startBtn.style.display = 'inline-block';
            startBtn.textContent = 'Resume';
        }
        if (pauseBtn) pauseBtn.style.display = 'none';
    };
    
    window.stopExercise = function() {
        isRunning = false;
        clearInterval(timer);
        resetExercise();
        closeBreathingExercise();
    };
    
    window.closeBreathingExercise = function() {
        const modal = document.getElementById('breathingModal');
        if (modal) {
            modal.style.display = 'none';
        }
        stopExercise();
    };
    
    window.showBreathingGuide = function() {
        const modal = document.getElementById('breathingGuideModal');
        if (modal) {
            modal.style.display = 'block';
        }
    };
    
    window.quickBreathing = function() {
        // Quick 1-minute breathing exercise
        showAlert('Starting quick breathing exercise...', 'info');
        setTimeout(() => {
            startExercise('box-breathing');
            setTimeout(() => {
                startBreathingCycle();
            }, 500);
        }, 1000);
    };
    
    function runBreathingCycle() {
        const exercise = getExercisePattern(currentExercise);
        let stepIndex = 0;
        let stepTimer = 0;
        
        timer = setInterval(() => {
            const currentStepData = exercise.steps[stepIndex];
            const breathingText = document.getElementById('breathingText');
            const breathingTimer = document.getElementById('breathingTimer');
            const breathingCircle = document.getElementById('breathingCircle');
            const progressFill = document.getElementById('progressFill');
            const progressText = document.getElementById('progressText');
            
            if (breathingText) {
                breathingText.textContent = currentStepData.instruction;
            }
            
            if (breathingTimer) {
                const remaining = currentStepData.duration - stepTimer;
                breathingTimer.textContent = remaining > 0 ? remaining : 0;
            }
            
            // Animate breathing circle
            if (breathingCircle) {
                const progress = stepTimer / currentStepData.duration;
                const scale = currentStepData.type === 'inhale' ? 1 + (progress * 0.3) : 
                             currentStepData.type === 'exhale' ? 1.3 - (progress * 0.3) : 1.3;
                breathingCircle.style.transform = `scale(${scale})`;
                
                // Change color based on breathing phase
                if (currentStepData.type === 'inhale') {
                    breathingCircle.style.backgroundColor = '#4F46E5';
                } else if (currentStepData.type === 'exhale') {
                    breathingCircle.style.backgroundColor = '#7C3AED';
                } else {
                    breathingCircle.style.backgroundColor = '#6366F1';
                }
            }
            
            stepTimer++;
            
            if (stepTimer >= currentStepData.duration) {
                stepTimer = 0;
                stepIndex++;
                
                if (stepIndex >= exercise.steps.length) {
                    stepIndex = 0;
                    cycleCount++;
                    
                    // Update progress
                    if (progressFill && progressText) {
                        const totalCycles = exercise.totalCycles || 10;
                        const progress = Math.min((cycleCount / totalCycles) * 100, 100);
                        progressFill.style.width = `${progress}%`;
                        progressText.textContent = `${Math.round(progress)}% Complete`;
                    }
                    
                    // Check if exercise is complete
                    if (cycleCount >= (exercise.totalCycles || 10)) {
                        completeExercise();
                        return;
                    }
                }
            }
        }, 1000);
    }
    
    function getExercisePattern(exerciseType) {
        const patterns = {
            'box-breathing': {
                name: 'Box Breathing',
                steps: [
                    { instruction: 'Breathe In', duration: 4, type: 'inhale' },
                    { instruction: 'Hold', duration: 4, type: 'hold' },
                    { instruction: 'Breathe Out', duration: 4, type: 'exhale' },
                    { instruction: 'Hold', duration: 4, type: 'hold' }
                ],
                totalCycles: 10
            },
            '4-7-8-breathing': {
                name: '4-7-8 Breathing',
                steps: [
                    { instruction: 'Breathe In', duration: 4, type: 'inhale' },
                    { instruction: 'Hold', duration: 7, type: 'hold' },
                    { instruction: 'Breathe Out', duration: 8, type: 'exhale' }
                ],
                totalCycles: 8
            },
            'belly-breathing': {
                name: 'Belly Breathing',
                steps: [
                    { instruction: 'Breathe In Slowly', duration: 5, type: 'inhale' },
                    { instruction: 'Hold', duration: 2, type: 'hold' },
                    { instruction: 'Breathe Out Slowly', duration: 6, type: 'exhale' }
                ],
                totalCycles: 12
            },
            'alternate-nostril': {
                name: 'Alternate Nostril Breathing',
                steps: [
                    { instruction: 'Close Right Nostril, Breathe In Left', duration: 4, type: 'inhale' },
                    { instruction: 'Hold Both Closed', duration: 4, type: 'hold' },
                    { instruction: 'Close Left Nostril, Breathe Out Right', duration: 4, type: 'exhale' },
                    { instruction: 'Breathe In Right', duration: 4, type: 'inhale' },
                    { instruction: 'Hold Both Closed', duration: 4, type: 'hold' },
                    { instruction: 'Close Right Nostril, Breathe Out Left', duration: 4, type: 'exhale' }
                ],
                totalCycles: 6
            },
            'coherent-breathing': {
                name: 'Coherent Breathing',
                steps: [
                    { instruction: 'Breathe In', duration: 5, type: 'inhale' },
                    { instruction: 'Breathe Out', duration: 5, type: 'exhale' }
                ],
                totalCycles: 20
            },
            'emergency-breathing': {
                name: 'Emergency Breathing',
                steps: [
                    { instruction: 'Breathe In', duration: 3, type: 'inhale' },
                    { instruction: 'Breathe Out', duration: 6, type: 'exhale' }
                ],
                totalCycles: 5
            }
        };
        
        return patterns[exerciseType] || patterns['box-breathing'];
    }
    
    function updateExerciseTitle(exerciseType) {
        const title = document.getElementById('exerciseTitle');
        if (title) {
            const pattern = getExercisePattern(exerciseType);
            title.textContent = pattern.name;
        }
    }
    
    function updateInstructions(exerciseType) {
        const instructions = document.getElementById('breathingInstructions');
        if (instructions) {
            const pattern = getExercisePattern(exerciseType);
            const stepsList = pattern.steps.map(step => 
                `<li>${step.instruction} for ${step.duration} seconds</li>`
            ).join('');
            
            instructions.innerHTML = `
                <h4>Instructions:</h4>
                <ol>
                    ${stepsList}
                    <li>Repeat the cycle</li>
                </ol>
            `;
        }
    }
    
    function resetExercise() {
        isRunning = false;
        clearInterval(timer);
        
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const breathingText = document.getElementById('breathingText');
        const breathingTimer = document.getElementById('breathingTimer');
        const breathingCircle = document.getElementById('breathingCircle');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (startBtn) {
            startBtn.style.display = 'inline-block';
            startBtn.textContent = 'Start';
        }
        if (pauseBtn) pauseBtn.style.display = 'none';
        if (breathingText) breathingText.textContent = 'Ready to begin';
        if (breathingTimer) breathingTimer.textContent = '00:00';
        if (breathingCircle) {
            breathingCircle.style.transform = 'scale(1)';
            breathingCircle.style.backgroundColor = '#4F46E5';
        }
        if (progressFill) progressFill.style.width = '0%';
        if (progressText) progressText.textContent = '0% Complete';
        
        currentStep = 0;
        cycleCount = 0;
    }
    
    function completeExercise() {
        isRunning = false;
        clearInterval(timer);
        
        const breathingText = document.getElementById('breathingText');
        const breathingTimer = document.getElementById('breathingTimer');
        
        if (breathingText) breathingText.textContent = 'Exercise Complete!';
        if (breathingTimer) breathingTimer.textContent = 'Well Done!';
        
        showAlert('Breathing exercise completed! Great job!', 'success');
        
        // Reset after 3 seconds
        setTimeout(() => {
            resetExercise();
        }, 3000);
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
        .breathing-circle {
            transition: all 0.5s ease;
        }
    `;
    document.head.appendChild(style);
});

