#!/usr/bin/env python3
"""
AI Chatbot Backend Server
A Flask-based backend for the Mental Wellness Hub AI chatbot using GroqCloud API

Requirements:
pip install flask flask-cors groq python-dotenv

Usage:
1. Get your API key from https://console.groq.com/
2. Set your API key as environment variable: export GROQ_API_KEY="your_api_key_here"
3. Run: python app.py
"""

import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize Groq client
groq_client = None
api_key = os.getenv("GROQ_API_KEY")

if api_key:
    try:
        groq_client = Groq(api_key=api_key)
        print("✅ Successfully connected to GroqCloud API")
    except Exception as e:
        print(f"❌ Error initializing GroqCloud client: {e}")
        groq_client = None
else:
    print("⚠️  No GROQ_API_KEY found. Please set your API key.")

# Available models
AVAILABLE_MODELS = [
    "llama-3.1-8b-instant", 
    "llama-3.1-70b",
    "gemma2-9b-it",
]

# Default model
DEFAULT_MODEL = "llama-3.1-8b-instant"

# Store conversation histories (in production, use a database)
conversations = {}

@app.route('/')
def home():
    """Health check endpoint"""
    return jsonify({
        "status": "success",
        "message": "AI Chatbot Backend is running",
        "groq_connected": groq_client is not None
    })

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat messages"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        message = data.get('message', '').strip()
        user_id = data.get('user_id', 'default')
        model = data.get('model', DEFAULT_MODEL)
        
        if not message:
            return jsonify({"error": "Message cannot be empty"}), 400
        
        if not groq_client:
            return jsonify({
                "error": "AI service unavailable. Please check API key configuration.",
                "response": "I'm sorry, but I'm currently unable to process your request. Please try again later or contact support."
            }), 503
        
        # Get or create conversation history
        if user_id not in conversations:
            conversations[user_id] = []
        
        # Add user message to conversation
        conversations[user_id].append({"role": "user", "content": message})
        
        try:
            # Create the completion request
            response = groq_client.chat.completions.create(
                model=model,
                messages=conversations[user_id],
                max_tokens=2048,
                temperature=0.7,
                top_p=0.9,
                stream=False
            )
            
            # Extract the response
            bot_response = response.choices[0].message.content
            
            # Add bot response to conversation
            conversations[user_id].append({"role": "assistant", "content": bot_response})
            
            return jsonify({
                "status": "success",
                "response": bot_response,
                "model": model,
                "conversation_length": len(conversations[user_id])
            })
            
        except Exception as e:
            # Remove the user message if request failed
            if conversations[user_id] and conversations[user_id][-1]["role"] == "user":
                conversations[user_id].pop()
            
            return jsonify({
                "error": f"AI service error: {str(e)}",
                "response": "I'm sorry, I encountered an error while processing your request. Please try again."
            }), 500
            
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/api/clear', methods=['POST'])
def clear_conversation():
    """Clear conversation history for a user"""
    try:
        data = request.get_json()
        user_id = data.get('user_id', 'default')
        
        if user_id in conversations:
            conversations[user_id] = []
        
        return jsonify({
            "status": "success",
            "message": "Conversation cleared"
        })
        
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/api/models', methods=['GET'])
def get_models():
    """Get available models"""
    return jsonify({
        "status": "success",
        "models": AVAILABLE_MODELS,
        "default_model": DEFAULT_MODEL
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check with detailed status"""
    return jsonify({
        "status": "success",
        "groq_connected": groq_client is not None,
        "api_key_configured": api_key is not None,
        "available_models": len(AVAILABLE_MODELS),
        "active_conversations": len(conversations)
    })

@app.route('/api/conversation/<user_id>', methods=['GET'])
def get_conversation(user_id):
    """Get conversation history for a user"""
    try:
        conversation = conversations.get(user_id, [])
        return jsonify({
            "status": "success",
            "conversation": conversation,
            "length": len(conversation)
        })
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    print(f"\n🚀 Starting AI Chatbot Backend Server...")
    print(f"📡 Server will run on: http://localhost:{port}")
    print(f"🔧 Debug mode: {debug}")
    print(f"🤖 Groq API connected: {groq_client is not None}")
    print(f"📋 Available models: {', '.join(AVAILABLE_MODELS)}")
    print(f"\n💡 API Endpoints:")
    print(f"   POST /api/chat - Send message to AI")
    print(f"   POST /api/clear - Clear conversation")
    print(f"   GET  /api/models - Get available models")
    print(f"   GET  /api/health - Health check")
    print(f"   GET  /api/conversation/<user_id> - Get conversation history")
    print(f"\n🌐 Open your website and start chatting!")
    
    app.run(host='0.0.0.0', port=port, debug=debug)




