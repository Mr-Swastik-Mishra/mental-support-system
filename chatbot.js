// chatbot.js - AI chat support page functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Chatbot page loaded successfully');
    
    let chatHistory = [];
    let isTyping = false;
    let userId = 'user_' + Date.now(); // Generate unique user ID
    let currentModel = 'llama-3.1-8b-instant'; // Default model
    let apiBaseUrl = 'http://localhost:5000'; // Backend API URL
    let groqApiKey = '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'; // Your API key
    let isAIMode = true; // AI mode enabled by default
    
    // Initialize chatbot
    initializeChatInterface();
    initializeQuickResponses();
    initializeEmergencyOptions();
    checkEmergencyFlag();
    checkBackendStatus();
    
    function initializeChatInterface() {
        const chatInput = document.getElementById('chatInput');
        const sendBtn = document.getElementById('sendMessageBtn');
        
        if (chatInput) {
            chatInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            });
            
            // Auto-resize textarea
            chatInput.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = this.scrollHeight + 'px';
            });
        }
        
        if (sendBtn) {
            sendBtn.addEventListener('click', function(e) {
                e.preventDefault();
                sendMessage();
            });
        }
        
        // Also add click listener to send button by class
        const sendBtnByClass = document.querySelector('.send-btn');
        if (sendBtnByClass) {
            sendBtnByClass.addEventListener('click', function(e) {
                e.preventDefault();
                sendMessage();
            });
        }
    }
    
    function initializeQuickResponses() {
        const quickResponseBtns = document.querySelectorAll('.quick-response-btn');
        
        quickResponseBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const message = this.textContent;
                sendQuickResponse(message);
            });
        });
    }
    
    function initializeEmergencyOptions() {
        const emergencyBtn = document.querySelector('.btn-secondary');
        if (emergencyBtn && emergencyBtn.textContent.includes('Emergency')) {
            emergencyBtn.addEventListener('click', showEmergencyOptions);
        }
    }
    
    function checkEmergencyFlag() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('emergency') === 'true') {
            setTimeout(() => {
                addBotMessage('I see you clicked the SOS button. Are you in an emergency? Please consider contacting a professional or helpline immediately. I can also help you find resources.');
            }, 1000);
        }
    }
    
    function sendMessage() {
        const chatInput = document.getElementById('chatInput');
        const message = chatInput.value.trim();
        
        if (!message) return;
        
        // Add user message to chat
        addUserMessage(message);
        
        // Clear input
        chatInput.value = '';
        chatInput.style.height = 'auto';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Send message to AI backend
        sendMessageToAI(message);
    }
    
    function sendQuickResponse(message) {
        const chatInput = document.getElementById('chatInput');
        chatInput.value = message;
        sendMessage();
    }
    
    // AI Communication Functions
    async function sendMessageToAI(message) {
        if (!isAIMode || !groqApiKey) {
            const fallbackResponse = generateBotResponse(message);
            addBotMessage(fallbackResponse);
            return;
        }
        
        try {
            // Direct Groq API call
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${groqApiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: currentModel,
                       messages: [
                           {
                               role: "system",
                               content: `You are a specialized AI medical wellness assistant for a mental health website. You ONLY discuss medical and mental health topics. Do NOT answer questions about programming, technology, or non-medical subjects.

                               Available medical features:
                               🫁 Breathing Exercises (breathing-exercises.html) - For anxiety, stress, relaxation
                               🎵 Calming Sounds (sounds.html) - For sleep, focus, meditation
                               📚 Resources (resources.html) - Medical articles, mental health guides
                               👨‍⚕️ Book Counsellor (booking.html) - Professional mental health support
                               📊 Mood Tracker (mood-tracker.html) - Track emotional wellbeing
                               👥 Community (community.html) - Connect with others facing similar challenges
                               
                               Focus on: Mental health, anxiety, depression, stress, sleep issues, emotional wellbeing, therapy, counseling, self-care, mindfulness, relaxation techniques.
                               
                               If users ask non-medical questions, politely redirect them to medical topics.`
                           },
                        ...chatHistory.map(msg => ({ role: msg.type === 'user' ? 'user' : 'assistant', content: msg.message })),
                        { role: 'user', content: message }
                    ],
                    max_tokens: 1000,
                    temperature: 0.7,
                    top_p: 0.9
                })
            });
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            
            const data = await response.json();
            const aiResponse = data.choices[0].message.content;
            
            hideTypingIndicator();
            addBotMessage(aiResponse);
            
            // Add to chat history
            chatHistory.push({ type: 'user', message: message, timestamp: new Date() });
            chatHistory.push({ type: 'bot', message: aiResponse, timestamp: new Date() });
            
        } catch (error) {
            console.error('AI API Error:', error);
            hideTypingIndicator();
            
            // Fallback to local response
            const fallbackResponse = generateBotResponse(message);
            addBotMessage(fallbackResponse);
            
            showNotification('AI temporarily unavailable. Using fallback responses.', 'warning');
        }
    }
    
    async function checkBackendStatus() {
        try {
            const response = await fetch(`${apiBaseUrl}/api/health`);
            const data = await response.json();
            
            if (data.groq_connected) {
                showNotification('AI Assistant is ready! 🤖', 'success');
            } else {
                showNotification('AI service unavailable. Using fallback responses.', 'warning');
            }
        } catch (error) {
            console.error('Backend not available:', error);
            showNotification('AI backend not available. Using fallback responses.', 'warning');
        }
    }
    
    async function clearConversation() {
        try {
            await fetch(`${apiBaseUrl}/api/clear`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId
                })
            });
            
            // Clear local chat history
            chatHistory = [];
            const chatMessages = document.getElementById('chatMessages');
            chatMessages.innerHTML = `
                <div class="message bot-message">
                    <div class="message-avatar">🤖</div>
                    <div class="message-content">
                        <div class="message-text">
                            Hi! I'm your AI wellness assistant. I'm here to provide support, coping strategies, and guidance. 
                            How can I help you today? Remember, this conversation is completely confidential.
                        </div>
                        <div class="message-time">Just now</div>
                    </div>
                </div>
            `;
            
            showNotification('Conversation cleared!', 'success');
        } catch (error) {
            console.error('Error clearing conversation:', error);
            showNotification('Error clearing conversation', 'error');
        }
    }
    
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : type === 'error' ? '❌' : 'ℹ️'}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    function addUserMessage(message) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-text">${message}</div>
                <div class="message-time">${getCurrentTime()}</div>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
        
        // Store in chat history
        chatHistory.push({ type: 'user', message: message, timestamp: new Date() });
    }
    
    function addBotMessage(message) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        
        // Format message with highlights and emojis
        const formattedMessage = formatBotMessage(message);
        
        messageDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <div class="message-text">${formattedMessage}</div>
                <div class="message-time">${getCurrentTime()}</div>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
        
        // Store in chat history
        chatHistory.push({ type: 'bot', message: message, timestamp: new Date() });
    }
    
    function formatBotMessage(message) {
        // Add random AI personality emojis
        const aiEmojis = ['✨', '💫', '🌟', '💝', '🌈', '🦋', '🌸', '💎', '🎯', '🚀'];
        const randomEmoji = aiEmojis[Math.floor(Math.random() * aiEmojis.length)];
        
        // Format suggestions with highlights
        let formatted = message
            // Highlight page suggestions
            .replace(/\*\*(.*?)\*\*/g, '<span class="highlight-suggestion">$1</span>')
            // Add emojis to common words
            .replace(/\b(anxiety|anxious|stressed|stress)\b/gi, '😰 $1')
            .replace(/\b(sad|depressed|down|hopeless)\b/gi, '😔 $1')
            .replace(/\b(angry|gussa|rage|frustrated)\b/gi, '😡 $1')
            .replace(/\b(sleep|insomnia|tired)\b/gi, '😴 $1')
            .replace(/\b(study|exam|academic)\b/gi, '📚 $1')
            .replace(/\b(breathing|breathe)\b/gi, '🫁 $1')
            .replace(/\b(sounds|music|audio)\b/gi, '🎵 $1')
            .replace(/\b(counsellor|therapist|professional)\b/gi, '👨‍⚕️ $1')
            .replace(/\b(resources|guides|articles)\b/gi, '📚 $1')
            .replace(/\b(community|friends|social)\b/gi, '👥 $1')
            .replace(/\b(mood|tracker|emotions)\b/gi, '📊 $1')
            // Add line breaks for better readability
            .replace(/\n\n/g, '<br><br>')
            .replace(/\n/g, '<br>');
        
        // Add random AI emoji at the beginning
        return `${randomEmoji} ${formatted}`;
    }
    
    function generateBotResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        // Check for non-medical questions and redirect
        const nonMedicalKeywords = ['c++', 'programming', 'code', 'python', 'javascript', 'html', 'css', 'technology', 'computer', 'software', 'app', 'website development', 'coding', 'programming language'];
        const isNonMedical = nonMedicalKeywords.some(keyword => lowerMessage.includes(keyword));
        
        if (isNonMedical) {
            return 'I\'m a specialized medical wellness assistant! 🏥 I focus on mental health, anxiety, stress, and emotional wellbeing. \n\nI can help you with:\n\n😰 **Anxiety & Stress** - Breathing exercises and relaxation techniques\n😔 **Depression** - Mood tracking and professional support\n😴 **Sleep Issues** - Sleep hygiene and calming sounds\n📚 **Mental Health Resources** - Self-help guides and articles\n👨‍⚕️ **Professional Help** - Book a counsellor session\n\nWhat mental health topic would you like to discuss? 💙';
        }
        
        // Emergency responses
        if (lowerMessage.includes('emergency') || lowerMessage.includes('suicide') || lowerMessage.includes('hurt myself')) {
            return 'If you\'re in immediate danger or having thoughts of self-harm, please contact emergency services immediately. National Helpline: 1800-599-0019. You are not alone, and help is available.';
        }
        
        // Anger management
        if (lowerMessage.includes('angry') || lowerMessage.includes('gussa') || lowerMessage.includes('rage') || lowerMessage.includes('frustrated')) {
            return 'I understand you\'re feeling 😡 angry or frustrated. These emotions are completely valid! 💪\n\nHere are some helpful resources:\n\n🫁 **Breathing Exercises** - Try our guided breathing techniques to calm down\n🎵 **Calming Sounds** - Listen to soothing music to help relax\n📚 **Resources** - Read our anger management guides\n\nWould you like me to take you to any of these features? 🌟';
        }
        
        // Anxiety and stress responses
        if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety') || lowerMessage.includes('stressed') || lowerMessage.includes('stress')) {
            return 'I understand you\'re feeling 😰 anxious or stressed. This is completely normal, especially for college students! 💙\n\nHere are some helpful resources:\n\n🫁 **Breathing Exercises** - Immediate relief techniques\n🎵 **Calming Sounds** - Relaxing audio for stress relief\n👨‍⚕️ **Book Counsellor** - Professional support\n📚 **Resources** - Self-help guides\n\nWhich would be most helpful right now? ✨';
        }
        
        // Depression responses
        if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('down') || lowerMessage.includes('hopeless')) {
            return 'I\'m sorry to hear you\'re feeling this way. 😔 Depression is a real and treatable condition. 💙\n\nHere are some resources that might help:\n\n👨‍⚕️ **Book Counsellor** - Professional mental health support\n📊 **Mood Tracker** - Track your emotional wellbeing\n👥 **Community** - Connect with others who understand\n📚 **Resources** - Depression support guides\n\nYou\'re not alone. Would you like to explore any of these options? 🌟';
        }
        
        // Sleep issues
        if (lowerMessage.includes('sleep') || lowerMessage.includes('insomnia') || lowerMessage.includes('tired')) {
            return '😴 Sleep issues can really affect your mental health. Here are some resources to help:\n\n🎵 **Calming Sounds** - Sleep-inducing audio\n🫁 **Breathing Exercises** - Relaxation before bed\n📚 **Resources** - Sleep hygiene guides\n👨‍⚕️ **Book Counsellor** - Address underlying causes\n\nWhich would you like to try first? 🌙';
        }
        
        // Academic stress
        if (lowerMessage.includes('exam') || lowerMessage.includes('study') || lowerMessage.includes('academic') || lowerMessage.includes('grades')) {
            return '📚 Academic pressure is very common among students! Here are some resources to help:\n\n📚 **Resources** - Study tips and academic support guides\n🫁 **Breathing Exercises** - Manage exam stress\n🎵 **Calming Sounds** - Focus and concentration music\n👨‍⚕️ **Book Counsellor** - Academic stress counseling\n\nWhat would be most helpful for your studies? 🎯';
        }
        
        // Relationship issues
        if (lowerMessage.includes('friend') || lowerMessage.includes('relationship') || lowerMessage.includes('lonely') || lowerMessage.includes('social')) {
            return '👥 Relationships and social connections are important for mental health! Here are some resources:\n\n👥 **Community** - Connect with others facing similar challenges\n👨‍⚕️ **Book Counsellor** - Relationship counseling\n📚 **Resources** - Social skills and relationship guides\n🎵 **Calming Sounds** - Reduce social anxiety\n\nWould you like to explore any of these options? 💝';
        }
        
        // Breathing exercises
        if (lowerMessage.includes('breathing') || lowerMessage.includes('breathe')) {
            return '🫁 Breathing exercises are a great way to manage stress and anxiety! I can take you to our breathing exercises page where you\'ll find various techniques like box breathing and 4-7-8 breathing.\n\n🫁 **Breathing Exercises** - Guided techniques for immediate relief\n\nWould you like me to take you there now? 🌸';
        }
        
        // Counsellor booking
        if (lowerMessage.includes('counsellor') || lowerMessage.includes('therapist') || lowerMessage.includes('professional') || lowerMessage.includes('book')) {
            return '👨‍⚕️ I can help you book a session with one of our qualified counsellors! They specialize in various areas like anxiety, depression, academic stress, and relationship issues.\n\n👨‍⚕️ **Book Counsellor** - Professional mental health support\n\nWould you like me to take you to our booking page? 💎';
        }
        
        // General support
        if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
            return 'I\'m here to help! 💫 Here are all the resources available to you:\n\n🫁 **Breathing Exercises** - For anxiety and stress\n🎵 **Calming Sounds** - For relaxation and focus\n📚 **Resources** - Self-help articles and guides\n👨‍⚕️ **Book Counsellor** - Professional support\n📊 **Mood Tracker** - Track your wellbeing\n👥 **Community** - Connect with others\n\nWhat would be most helpful for you right now? 🌟';
        }
        
        // Gratitude responses
        if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
            return 'You\'re very welcome! 😊 I\'m glad I could help. Remember, I\'m always here whenever you need support. Take care of yourself! 💝';
        }
        
        // Default response
        return 'I understand you\'re going through something. 💙 I\'m here to listen and help. Here are some resources that might be useful:\n\n🫁 **Breathing Exercises** - For immediate relief\n🎵 **Calming Sounds** - For relaxation\n📚 **Resources** - Self-help guides\n👨‍⚕️ **Book Counsellor** - Professional support\n\nCould you tell me more about what you\'re experiencing? ✨';
    }
    
    function showTypingIndicator() {
        if (isTyping) return;
        
        isTyping = true;
        const chatMessages = document.getElementById('chatMessages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.id = 'typingIndicator';
        
        typingDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        chatMessages.appendChild(typingDiv);
        scrollToBottom();
    }
    
    function hideTypingIndicator() {
        isTyping = false;
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    function scrollToBottom() {
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Global functions
    window.showEmergencyOptions = function() {
        const modal = document.getElementById('emergencyModal');
        if (modal) {
            modal.style.display = 'block';
        }
    };
    
    window.clearChat = function() {
        clearConversation();
    };
    
    window.requestCopingStrategy = function() {
        sendQuickResponse('I need coping strategies for stress');
    };
    
    window.requestRelaxation = function() {
        sendQuickResponse('Can you help me with relaxation techniques?');
    };
    
    window.requestSleepHelp = function() {
        sendQuickResponse('I need help with sleep issues');
    };
    
    window.requestStudyTips = function() {
        sendQuickResponse('I need study tips and academic support');
    };
    
    // Page Navigation Functions
    window.goToBreathingExercises = function() {
        window.location.href = 'breathing-exercises.html';
    };
    
    window.goToSounds = function() {
        window.location.href = 'sounds.html';
    };
    
    window.goToResources = function() {
        window.location.href = 'resources.html';
    };
    
    window.goToBooking = function() {
        window.location.href = 'booking.html';
    };
    
    window.goToMoodTracker = function() {
        window.location.href = 'mood-tracker.html';
    };
    
    window.goToCommunity = function() {
        window.location.href = 'community.html';
    };
    
    window.attachFile = function() {
        showNotification('File attachment feature coming soon!', 'info');
    };
    
    window.sendEmoji = function() {
        const modal = document.getElementById('emojiModal');
        if (modal) {
            modal.style.display = 'block';
        }
    };
    
    window.insertEmoji = function(emoji) {
        const chatInput = document.getElementById('chatInput');
        chatInput.value += emoji;
        chatInput.focus();
        
        const modal = document.getElementById('emojiModal');
        if (modal) {
            modal.style.display = 'none';
        }
    };
    
    window.callEmergency = function() {
        alert('Calling Emergency Services: 100 (Police) | 108 (Ambulance)');
        const modal = document.getElementById('emergencyModal');
        if (modal) {
            modal.style.display = 'none';
        }
    };
    
    window.callHelpline = function() {
        alert('Calling Mental Health Helpline: 1800-599-0019');
        const modal = document.getElementById('emergencyModal');
        if (modal) {
            modal.style.display = 'none';
        }
    };
    
    window.textCrisis = function() {
        alert('Opening Crisis Text Line: Text HOME to 741741');
        const modal = document.getElementById('emergencyModal');
        if (modal) {
            modal.style.display = 'none';
        }
    };
    
    window.closeEmergency = function() {
        const modal = document.getElementById('emergencyModal');
        if (modal) {
            modal.style.display = 'none';
        }
    };
    
    // Add CSS animations and styles
    const style = document.createElement('style');
    style.textContent = `
        /* Main Layout Fixes */
        .chatbot-main {
            height: calc(100vh - 80px);
            overflow: hidden;
        }
        
        .chat-layout {
            height: 100%;
            display: flex;
            gap: 1rem;
        }
        
        .chat-container {
            flex: 1;
            display: flex;
            flex-direction: column;
            height: 100%;
            max-height: 100%;
            overflow: hidden;
        }
        
        .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 1rem;
            height: calc(100% - 120px);
            max-height: calc(100% - 120px);
        }
        
        .chat-input-container {
            padding: 1rem;
            border-top: 1px solid #e2e8f0;
            background: white;
            position: sticky;
            bottom: 0;
        }
        
        .typing-dots {
            display: flex;
            gap: 4px;
            padding: 10px 0;
        }
        .typing-dots span {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: #4F46E5;
            animation: typing 1.4s infinite ease-in-out;
        }
        .typing-dots span:nth-child(1) {
            animation-delay: -0.32s;
        }
        .typing-dots span:nth-child(2) {
            animation-delay: -0.16s;
        }
        @keyframes typing {
            0%, 80%, 100% {
                transform: scale(0);
                opacity: 0.5;
            }
            40% {
                transform: scale(1);
                opacity: 1;
            }
        }
        .message {
            margin-bottom: 1rem;
            display: flex;
            align-items: flex-start;
            gap: 0.5rem;
        }
        .user-message {
            justify-content: flex-end;
        }
        .user-message .message-content {
            background: #4F46E5;
            color: white;
            border-radius: 18px 18px 4px 18px;
        }
        .bot-message .message-content {
            background: #f1f5f9;
            color: #1e293b;
            border-radius: 18px 18px 18px 4px;
        }
        .message-content {
            padding: 12px 16px;
            max-width: 70%;
        }
        .message-text {
            margin-bottom: 4px;
        }
        .message-time {
            font-size: 0.75rem;
            opacity: 0.7;
        }
        .message-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
        }
        
        /* Notification Styles */
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            border-left: 4px solid #4F46E5;
            padding: 1rem 1.5rem;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 350px;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-success {
            border-left-color: #22c55e;
        }
        
        .notification-warning {
            border-left-color: #f59e0b;
        }
        
        .notification-error {
            border-left-color: #ef4444;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .notification-icon {
            font-size: 1.2rem;
        }
        
        .notification-message {
            color: #1e293b;
            font-weight: 500;
            font-size: 0.9rem;
        }
        
        /* Emoji Modal Styles */
        .emoji-modal {
            max-width: 400px;
            text-align: center;
        }
        
        .emoji-grid {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 0.5rem;
            margin-top: 1rem;
        }
        
        .emoji-btn {
            background: #f8fafc;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            padding: 0.75rem;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 1.5rem;
        }
        
        .emoji-btn:hover {
            border-color: #22c55e;
            background: #f0fdf4;
            transform: scale(1.1);
        }
        
        /* AI Status Indicator */
        .ai-status {
            position: fixed;
            top: 20px;
            left: 20px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 25px;
            padding: 0.5rem 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.9rem;
            font-weight: 500;
            z-index: 100;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .ai-status.online {
            color: #22c55e;
        }
        
        .ai-status.offline {
            color: #ef4444;
        }
        
        .ai-status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: currentColor;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% {
                opacity: 1;
            }
            50% {
                opacity: 0.5;
            }
        }
        
        /* Highlight Suggestions */
        .highlight-suggestion {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 0.9em;
            display: inline-block;
            margin: 2px;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
            animation: highlightPulse 2s infinite;
        }
        
        @keyframes highlightPulse {
            0%, 100% {
                transform: scale(1);
                box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
            }
            50% {
                transform: scale(1.05);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            }
        }
        
        /* Enhanced Message Styling */
        .bot-message .message-content {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            border: 1px solid rgba(99, 102, 241, 0.1);
            box-shadow: 0 4px 20px rgba(99, 102, 241, 0.1);
        }
        
        .bot-message .message-text {
            line-height: 1.6;
            font-size: 0.95rem;
        }
        
        /* Emoji Animation */
        .message-text {
            animation: fadeInUp 0.5s ease-out;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* Quick Response Button Enhancements */
        .quick-response-btn {
            background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
            border: 2px solid transparent;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .quick-response-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.1), transparent);
            transition: left 0.5s ease;
        }
        
        .quick-response-btn:hover::before {
            left: 100%;
        }
        
        .quick-response-btn:hover {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }
        
        /* Send Button Fixes */
        .send-btn {
            background: linear-gradient(135deg, #4F46E5, #7C3AED);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 12px 20px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .send-btn:hover {
            background: linear-gradient(135deg, #3730A3, #6D28D9);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        }
        
        .send-btn:active {
            transform: translateY(0);
        }
        
        .send-btn:disabled {
            background: #9CA3AF;
            cursor: not-allowed;
            transform: none;
        }
        
        /* Input Area Improvements */
        .chat-input-container {
            display: flex;
            gap: 12px;
            align-items: flex-end;
            background: white;
            border-radius: 12px;
            padding: 16px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .chat-input {
            flex: 1;
            border: 2px solid #E5E7EB;
            border-radius: 8px;
            padding: 12px 16px;
            font-size: 14px;
            resize: none;
            min-height: 20px;
            max-height: 100px;
            transition: border-color 0.3s ease;
        }
        
        .chat-input:focus {
            outline: none;
            border-color: #4F46E5;
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }
        
        /* Scrollbar Styling */
        .chat-messages::-webkit-scrollbar {
            width: 6px;
        }
        
        .chat-messages::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
        }
        
        .chat-messages::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 3px;
        }
        
        .chat-messages::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
        }
    `;
    document.head.appendChild(style);
    
    // Add AI status indicator
    const aiStatus = document.createElement('div');
    aiStatus.className = 'ai-status offline';
    aiStatus.innerHTML = `
        <div class="ai-status-dot"></div>
        <span>AI Assistant</span>
    `;
    document.body.appendChild(aiStatus);
    
    // Update AI status based on backend connection
    function updateAIStatus(connected) {
        const statusElement = document.querySelector('.ai-status');
        if (statusElement) {
            statusElement.className = `ai-status ${connected ? 'online' : 'offline'}`;
        }
    }
    
    // Initialize AI status check
    checkBackendStatus().then(() => {
        updateAIStatus(true);
    }).catch(() => {
        updateAIStatus(false);
    });
});

