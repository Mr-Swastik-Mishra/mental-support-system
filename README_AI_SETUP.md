# AI Chatbot Setup Guide

## Overview
This guide will help you set up the AI-powered chatbot for your Mental Wellness Hub website using GroqCloud API.

## Prerequisites
- Python 3.7 or higher
- pip (Python package manager)
- GroqCloud API key (free at https://console.groq.com/)

## Step 1: Install Python Dependencies

```bash
pip install -r requirements.txt
```

## Step 2: Get GroqCloud API Key

1. Visit https://console.groq.com/
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the API key

## Step 3: Set Environment Variables

### Option A: Using .env file (Recommended)
1. Create a `.env` file in the project root
2. Add your API key:
```
GROQ_API_KEY=your_groq_api_key_here
FLASK_ENV=development
PORT=5000
```

### Option B: Using Command Line
```bash
# Windows
set GROQ_API_KEY=your_groq_api_key_here

# macOS/Linux
export GROQ_API_KEY=your_groq_api_key_here
```

## Step 4: Start the Backend Server

```bash
python app.py
```

You should see output like:
```
🚀 Starting AI Chatbot Backend Server...
📡 Server will run on: http://localhost:5000
🔧 Debug mode: True
🤖 Groq API connected: True
📋 Available models: llama-3.1-8b-instant, llama-3.1-70b, gemma2-9b-it

💡 API Endpoints:
   POST /api/chat - Send message to AI
   POST /api/clear - Clear conversation
   GET  /api/models - Get available models
   GET  /api/health - Health check
   GET  /api/conversation/<user_id> - Get conversation history

🌐 Open your website and start chatting!
```

## Step 5: Open Your Website

1. Open `index.html` in your web browser
2. Navigate to the Chat section
3. You should see "AI Assistant is ready! 🤖" notification
4. Start chatting with the AI!

## Features

### AI-Powered Responses
- Uses GroqCloud's advanced language models
- Contextual conversation memory
- Fallback responses if AI is unavailable

### Available Models
- **llama-3.1-8b-instant** (Default) - Fast responses
- **llama-3.1-70b** - Higher quality responses
- **gemma2-9b-it** - Balanced performance

### Smart Features
- Real-time typing indicators
- Conversation history
- Error handling with fallbacks
- Status indicators
- Emoji support
- Quick response buttons

## Troubleshooting

### Backend Not Starting
- Check if Python is installed correctly
- Verify all dependencies are installed: `pip install -r requirements.txt`
- Check if port 5000 is available

### AI Not Responding
- Verify your GroqCloud API key is correct
- Check if the backend server is running
- Look for error messages in the browser console
- Check the backend server logs

### Connection Errors
- Ensure the backend server is running on http://localhost:5000
- Check if your firewall is blocking the connection
- Try refreshing the webpage

### API Key Issues
- Verify the API key is set correctly in environment variables
- Check if the API key has sufficient credits
- Ensure the API key is active on GroqCloud

## API Endpoints

### POST /api/chat
Send a message to the AI chatbot.

**Request:**
```json
{
  "message": "Hello, I need help with anxiety",
  "user_id": "user_123",
  "model": "llama-3.1-8b-instant"
}
```

**Response:**
```json
{
  "status": "success",
  "response": "I understand you're feeling anxious...",
  "model": "llama-3.1-8b-instant",
  "conversation_length": 2
}
```

### POST /api/clear
Clear conversation history for a user.

**Request:**
```json
{
  "user_id": "user_123"
}
```

### GET /api/health
Check backend and AI service status.

**Response:**
```json
{
  "status": "success",
  "groq_connected": true,
  "api_key_configured": true,
  "available_models": 3,
  "active_conversations": 5
}
```

## Security Notes

- Never commit your API key to version control
- Use environment variables for sensitive data
- The backend runs on localhost by default for development
- For production, use proper authentication and HTTPS

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Check the backend server logs
3. Verify your API key and network connection
4. Ensure all dependencies are installed correctly

## Next Steps

- Customize the AI responses for your specific use case
- Add more conversation context and memory
- Implement user authentication
- Add conversation export functionality
- Deploy to a production server

Happy chatting! 🤖✨




