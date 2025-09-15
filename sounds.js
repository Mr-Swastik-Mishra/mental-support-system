// sounds.js - Calming sounds page functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sounds page loaded successfully');
    
    let currentSound = null;
    let isPlaying = false;
    let audioContext = null;
    let mixerSounds = {};
    let activeSounds = {};
    
    // Initialize sounds page
    initializeSoundPlayer();
    initializeSoundSelection();
    initializeSoundMixer();
    initializeTimer();
    
    function initializeSoundPlayer() {
        const audioPlayer = document.getElementById('audioPlayer');
        const playPauseBtn = document.getElementById('playPauseBtn');
        const volumeSlider = document.getElementById('volumeSlider');
        
        if (audioPlayer) {
            audioPlayer.addEventListener('loadeddata', function() {
                console.log('Audio loaded successfully');
            });
            
            audioPlayer.addEventListener('error', function() {
                console.log('Audio loading error');
                showAlert('Audio file could not be loaded', 'error');
            });
        }
        
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', togglePlayPause);
        }
        
        if (volumeSlider) {
            volumeSlider.addEventListener('input', function() {
                if (audioPlayer) {
                    audioPlayer.volume = this.value / 100;
                }
            });
        }
    }
    
    function initializeSoundSelection() {
        const soundCards = document.querySelectorAll('.sound-card');
        
        soundCards.forEach(card => {
            card.addEventListener('click', function() {
                // Remove previous selection
                soundCards.forEach(c => c.classList.remove('selected'));
                
                // Add selection to clicked card
                this.classList.add('selected');
                
                const soundSrc = this.dataset.src;
                const soundTitle = this.querySelector('h3').textContent;
                
                loadSound(soundSrc, soundTitle);
            });
        });
    }
    
    function initializeSoundMixer() {
        // Initialize Web Audio API for mixer
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
        
        // Initialize mixer sounds
        mixerSounds = {
            'ocean': { src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', title: 'Ocean Waves' },
            'rain': { src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', title: 'Rain' },
            'forest': { src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', title: 'Forest' },
            'fire': { src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', title: 'Fireplace' },
            'ambient': { src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', title: 'Ambient Music' },
            'white-noise': { src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', title: 'White Noise' }
        };
    }
    
    function initializeTimer() {
        const timerButtons = document.querySelectorAll('.timer-btn');
        
        timerButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove previous selection
                timerButtons.forEach(b => b.classList.remove('active'));
                
                // Add selection to clicked button
                this.classList.add('active');
                
                const minutes = parseInt(this.dataset.minutes);
                setSleepTimer(minutes);
            });
        });
    }
    
    function loadSound(src, title) {
        const audioPlayer = document.getElementById('audioPlayer');
        const playerTitle = document.getElementById('playerTitle');
        
        if (audioPlayer && src) {
            audioPlayer.src = src;
            currentSound = { src, title };
            
            if (playerTitle) {
                playerTitle.textContent = title;
            }
            
            // Show floating player
            const floatingPlayer = document.getElementById('floatingPlayer');
            if (floatingPlayer) {
                floatingPlayer.style.display = 'flex';
            }
            
            console.log('Sound loaded:', title);
        }
    }
    
    function togglePlayPause() {
        const audioPlayer = document.getElementById('audioPlayer');
        const playPauseBtn = document.getElementById('playPauseBtn');
        const playerPlayBtn = document.getElementById('playerPlayBtn');
        
        if (!currentSound) {
            showAlert('Please select a sound first!', 'error');
            return;
        }
        
        if (isPlaying) {
            pauseAudio();
        } else {
            playAudio();
        }
    }
    
    function playAudio() {
        const audioPlayer = document.getElementById('audioPlayer');
        const playPauseBtn = document.getElementById('playPauseBtn');
        const playerPlayBtn = document.getElementById('playerPlayBtn');
        
        if (audioPlayer) {
            audioPlayer.play().then(() => {
                isPlaying = true;
                
                if (playPauseBtn) {
                    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
                }
                
                if (playerPlayBtn) {
                    playerPlayBtn.innerHTML = '⏸️';
                }
                
                startTimer();
            }).catch(error => {
                console.log('Playback failed:', error);
                showAlert('Could not play audio. Please try again.', 'error');
            });
        }
    }
    
    function pauseAudio() {
        const audioPlayer = document.getElementById('audioPlayer');
        const playPauseBtn = document.getElementById('playPauseBtn');
        const playerPlayBtn = document.getElementById('playerPlayBtn');
        
        if (audioPlayer) {
            audioPlayer.pause();
            isPlaying = false;
            
            if (playPauseBtn) {
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i> Play';
            }
            
            if (playerPlayBtn) {
                playerPlayBtn.innerHTML = '▶️';
            }
            
            stopTimer();
        }
    }
    
    function startTimer() {
        const playerTimer = document.getElementById('playerTimer');
        if (playerTimer) {
            let seconds = 0;
            
            const timerInterval = setInterval(() => {
                if (!isPlaying) {
                    clearInterval(timerInterval);
                    return;
                }
                
                seconds++;
                const minutes = Math.floor(seconds / 60);
                const remainingSeconds = seconds % 60;
                playerTimer.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
            }, 1000);
        }
    }
    
    function stopTimer() {
        const playerTimer = document.getElementById('playerTimer');
        if (playerTimer) {
            playerTimer.textContent = '00:00';
        }
    }
    
    function setSleepTimer(minutes) {
        if (minutes === 0) {
            showAlert('Sleep timer disabled', 'info');
            return;
        }
        
        showAlert(`Sleep timer set for ${minutes} minutes`, 'info');
        
        setTimeout(() => {
            if (isPlaying) {
                pauseAudio();
                showAlert('Sleep timer: Audio stopped', 'info');
            }
        }, minutes * 60 * 1000);
    }
    
    // Global functions
    window.showMixer = function() {
        const modal = document.getElementById('soundMixerModal');
        if (modal) {
            modal.style.display = 'block';
            initializeMixerControls();
        }
    };
    
    window.playMix = function() {
        const mixerSliders = document.querySelectorAll('.mixer-slider');
        let hasActiveSound = false;
        
        mixerSliders.forEach(slider => {
            const soundId = slider.dataset.sound;
            const volume = parseFloat(slider.value);
            
            if (volume > 0) {
                hasActiveSound = true;
                playMixerSound(soundId, volume);
            } else {
                stopMixerSound(soundId);
            }
        });
        
        if (!hasActiveSound) {
            showAlert('Please adjust at least one sound volume', 'error');
        } else {
            showAlert('Sound mix started!', 'success');
        }
    };
    
    window.saveMix = function() {
        const mixerSliders = document.querySelectorAll('.mixer-slider');
        const mixData = {};
        
        mixerSliders.forEach(slider => {
            const soundId = slider.dataset.sound;
            const volume = parseFloat(slider.value);
            mixData[soundId] = volume;
        });
        
        localStorage.setItem('savedMix', JSON.stringify(mixData));
        showAlert('Sound mix saved!', 'success');
    };
    
    window.stopAllSounds = function() {
        // Stop main audio
        pauseAudio();
        
        // Stop all mixer sounds
        Object.keys(activeSounds).forEach(soundId => {
            stopMixerSound(soundId);
        });
        
        // Hide floating player
        const floatingPlayer = document.getElementById('floatingPlayer');
        if (floatingPlayer) {
            floatingPlayer.style.display = 'none';
        }
        
        showAlert('All sounds stopped', 'info');
    };
    
    function initializeMixerControls() {
        const mixerGrid = document.querySelector('.mixer-grid');
        if (!mixerGrid) return;
        
        // Load saved mix if available
        const savedMix = JSON.parse(localStorage.getItem('savedMix') || '{}');
        
        mixerGrid.innerHTML = Object.keys(mixerSounds).map(soundId => {
            const sound = mixerSounds[soundId];
            const savedVolume = savedMix[soundId] || 0;
            
            return `
                <div class="mixer-item">
                    <label>${sound.title}</label>
                    <input type="range" class="mixer-slider" min="0" max="1" value="${savedVolume}" step="0.01" data-sound="${soundId}">
                    <span class="volume-display">${Math.round(savedVolume * 100)}%</span>
                </div>
            `;
        }).join('');
        
        // Add event listeners to sliders
        const sliders = mixerGrid.querySelectorAll('.mixer-slider');
        sliders.forEach(slider => {
            slider.addEventListener('input', function() {
                const volumeDisplay = this.nextElementSibling;
                const volume = parseFloat(this.value);
                volumeDisplay.textContent = `${Math.round(volume * 100)}%`;
                
                if (volume > 0) {
                    playMixerSound(this.dataset.sound, volume);
                } else {
                    stopMixerSound(this.dataset.sound);
                }
            });
        });
    }
    
    function playMixerSound(soundId, volume) {
        if (!audioContext) return;
        
        if (activeSounds[soundId]) {
            activeSounds[soundId].volume = volume;
            return;
        }
        
        const sound = mixerSounds[soundId];
        if (!sound) return;
        
        // Create audio element for mixer
        const audio = new Audio(sound.src);
        audio.loop = true;
        audio.volume = volume;
        
        audio.play().then(() => {
            activeSounds[soundId] = audio;
        }).catch(error => {
            console.log('Mixer sound playback failed:', error);
        });
    }
    
    function stopMixerSound(soundId) {
        if (activeSounds[soundId]) {
            activeSounds[soundId].pause();
            activeSounds[soundId].currentTime = 0;
            delete activeSounds[soundId];
        }
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
        .floating-player {
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: white;
            padding: 1rem;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 1rem;
            z-index: 100;
        }
        .mixer-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
        }
        .mixer-item label {
            min-width: 120px;
            font-weight: 500;
        }
        .mixer-slider {
            flex: 1;
        }
        .volume-display {
            min-width: 40px;
            text-align: center;
            font-size: 0.9rem;
            color: #64748b;
        }
    `;
    document.head.appendChild(style);
});

