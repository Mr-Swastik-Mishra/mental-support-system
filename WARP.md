# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Mental Wellness Hub is a comprehensive digital mental health platform designed for college students. It's built as a hybrid web application with both a traditional HTML/CSS/JS frontend and a React-based component system, backed by a Flask Python API for AI chatbot functionality.

## Development Commands

### Frontend Development
```powershell
# Install Node.js dependencies
npm install

# Start React development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Alternative webpack development server
npm run dev

# Build with webpack (development)
npm run build-dev
```

### Backend Development
```powershell
# Install Python dependencies
pip install -r requirements.txt

# Start Flask backend server
python app.py

# Start with environment variables
$env:GROQ_API_KEY="your_api_key_here"; python app.py
```

### Environment Setup
Create a `.env` file in the root directory:
```
GROQ_API_KEY=your_groq_api_key_here
FLASK_ENV=development
PORT=5000
```

## Architecture Overview

### Dual Frontend Architecture
The project uses a unique hybrid approach:
- **Traditional HTML Pages**: Static pages (`index.html`, `dashboard.html`, etc.) with vanilla JavaScript
- **React Components**: Modern component-based UI in `src/components/`
- **Shared Styling**: Global CSS in `styles.css` with component-specific CSS files

### Key Components Structure
```
src/components/
├── App.js              # Main React router and layout
├── Header.js           # Navigation header
├── Sidebar.js          # Navigation sidebar
├── Dashboard.js        # Main dashboard page
├── Chatbot.js          # AI chat interface
├── BreathingExercises.js
├── Sounds.js
├── Resources.js
├── Booking.js
├── MoodTracker.js
├── Community.js
├── Login.js
└── Register.js
```

### Backend API Architecture
Flask-based API (`app.py`) provides:
- **Chat Endpoints**: AI-powered conversation via Groq API
- **Health Checks**: Service status monitoring
- **Conversation Management**: User session handling
- **Model Selection**: Support for multiple LLM models

### AI Integration
The chatbot system has dual implementation:
1. **React Component** (`src/components/Chatbot.js`) - Modern React interface
2. **Vanilla JS** (`chatbot.js`) - Traditional HTML page integration

Both implementations:
- Use Groq Cloud API with Llama models
- Include fallback responses for offline functionality
- Specialize in mental health conversations only
- Filter out non-medical queries

## Key Features

### Mental Health Focus
- AI chatbot specialized for mental wellness (anxiety, depression, stress)
- Breathing exercises with guided techniques
- Calming sounds for meditation and sleep
- Professional counsellor booking system
- Mood tracking and emotional wellbeing monitoring
- Peer support community features

### AI Capabilities
- **Primary Model**: `llama-3.1-8b-instant` (fast responses)
- **Alternative Models**: `llama-3.1-70b`, `gemma2-9b-it`
- Conversation memory and context awareness
- Mental health-specific prompt engineering
- Automatic fallback to local responses if API unavailable

## Development Patterns

### State Management
- React components use local state with hooks
- Conversation history stored in-memory (backend)
- User sessions identified by generated IDs
- No persistent database (development setup)

### Error Handling
- API failures gracefully fallback to local responses
- Health check endpoints for service monitoring
- User-friendly error messages with retry options
- CORS enabled for cross-origin requests

### Security Considerations
- API keys managed via environment variables
- No sensitive data in version control
- HTTPS recommended for production deployment
- User conversations not permanently stored

## File Organization

### Static Assets
- HTML pages in root directory (legacy structure)
- Shared CSS in `styles.css`
- Individual JS files for page-specific functionality

### React Application
- Modern component structure in `src/`
- Component-specific CSS files
- React Router for navigation
- Public assets in `public/`

### Backend
- Single-file Flask application (`app.py`)
- Minimal dependencies in `requirements.txt`
- Environment configuration via `.env`

## Testing and Development

### Running Individual Components
- Open HTML files directly for static testing
- Use React dev server for component development
- Backend runs independently on port 5000
- Frontend dev server typically on port 3000

### API Testing
```powershell
# Test health endpoint
curl http://localhost:5000/api/health

# Test chat endpoint
curl -X POST http://localhost:5000/api/chat -H "Content-Type: application/json" -d '{\"message\":\"I feel anxious\",\"user_id\":\"test\"}'
```

## Common Development Tasks

### Adding New Mental Health Features
1. Create React component in `src/components/`
2. Add corresponding CSS file
3. Update routing in `App.js`
4. Create static HTML version if needed
5. Update navigation in Header/Sidebar components

### Modifying AI Behavior
- Update system prompt in both Chatbot implementations
- Modify fallback response logic in `generateBotResponse()`
- Adjust model parameters (temperature, max_tokens)
- Test with various mental health scenarios

### Styling Updates
- Global styles in `styles.css`
- Component-specific styles in individual CSS files
- Consistent design tokens (colors, fonts, spacing)
- Mobile-responsive design patterns

## API Integration

### Groq Cloud Setup
1. Get API key from https://console.groq.com/
2. Set `GROQ_API_KEY` environment variable
3. Choose from available models
4. Monitor usage and rate limits

### Backend Endpoints
- `POST /api/chat` - Send message to AI
- `POST /api/clear` - Clear conversation history
- `GET /api/health` - Service status check
- `GET /api/models` - Available AI models
- `GET /api/conversation/<user_id>` - Get chat history

## Deployment Notes

### Production Considerations
- Set secure API keys and environment variables
- Enable HTTPS for all communications
- Configure proper CORS policies
- Set up error monitoring and logging
- Consider database for persistent conversations
- Implement proper user authentication
- Set up health monitoring for AI services

### Environment Variables
- `GROQ_API_KEY` - Required for AI functionality
- `FLASK_ENV` - Set to 'production' for production
- `PORT` - Server port (default: 5000)