# Gemini Chatbot

A simple and elegant React chatbot powered by Google's Gemini AI API.

## Features

- Clean, modern UI with gradient design
- Real-time chat with Google Gemini AI
- No backend required - runs entirely in the browser
- Responsive design for mobile and desktop
- Easy API key setup

## Setup Instructions

### 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key" or "Create API Key"
4. Copy your API key

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure API Key (Optional)

You can either:

**Option A: Enter API key in the app**
- Just run the app and enter your API key when prompted

**Option B: Use environment variable**
- Copy `.env.example` to `.env`
- Replace `your_api_key_here` with your actual API key

```bash
cp .env.example .env
# Edit .env and add your API key
```

### 4. Run the App

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

1. If you didn't set up the `.env` file, enter your API key when prompted
2. Start chatting with Gemini!
3. Use "Clear Chat" to start a new conversation

## Technologies Used

- React 18
- Vite
- Google Generative AI SDK
- CSS3 with Gradients and Animations

## Note

This app makes direct API calls from the frontend. For production use, consider implementing a backend to protect your API key.
