# AI Sales Voice Agent — NexaCRM

A real-time, low-latency AI voice sales representative for **NexaCRM**. Conducts natural two-way voice conversations with prospective customers, handles sales discovery and objections, generates instant structured CRM intelligence via **Google Gemini 3.8 Flash**, and allows immediate playback of call audio recordings.

Built with **React 19**, **Vite**, **Tailwind CSS v4**, **Vapi Web SDK**, and **Vercel Serverless Functions**.

---

## Key Features

- **Real-Time Voice Streaming**: Ultra-low-latency bidirectional conversational audio powered by [Vapi](https://vapi.ai) WebRTC.
- **Sub-Second AI Call Summaries**: Powered by **Gemini 3.8 Flash** with optimized reasoning levels for instant post-call processing.
- **Structured CRM Extraction**: Automatically extracts:
  - Customer name & contact context
  - 2–3 sentence executive summary
  - Key customer requirements & pain points
  - Objections raised during the conversation
  - Actionable recommended next steps
  - Sales qualification status (`Converted`, `Interested`, `Demo Requested`, `Follow-up Required`, `Not Interested`, `No Response`)
- **Call Recording Playback**: Embedded custom audio player with waveform seeking and playback controls.
- **Call History**: Persistent log of previous conversations, transcripts, duration metrics, and call recordings.
- **Secure Serverless Architecture**: `GEMINI_API_KEY` and `VAPI_PRIVATE_KEY` are executed strictly inside Vercel Serverless Functions (`api/`), keeping private credentials completely hidden from client browsers and network inspectors.
- **Privacy-First In-Browser Configuration**: Built-in fallback setup modal with masked password fields and show/hide toggles.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19, Vite 8 |
| **Styling** | Tailwind CSS v4 |
| **Voice & Audio** | `@vapi-ai/web` (WebRTC audio streaming) |
| **AI Intelligence** | Google Gemini 3.8 Flash (via Google AI Studio) |
| **Backend / API** | Vercel Serverless Functions (Node.js) |
| **Linter** | Oxlint |

---

## Architecture

```
User (Browser)
   │
   ├─► Vapi WebRTC SDK ────────► Live Voice Interaction (Alex Sales Rep)
   │
   ├─► /api/summary ───────────► Vercel Serverless ──► Gemini 3.8 Flash (Secure Secret Key)
   │
   └─► /api/recording ─────────► Vercel Serverless ──► Vapi REST API (Secure Private Key)
```

1. **Client-Side**: The browser only holds the public client key (`VITE_VAPI_PUBLIC_KEY`) to stream audio directly to Vapi's telephony/WebRTC infrastructure.
2. **Server-Side**: Post-call processing occurs via serverless endpoints in [`api/`](api/), ensuring sensitive keys (`GEMINI_API_KEY`, `VAPI_PRIVATE_KEY`) never leak to the public bundle.

---

## Environment Variables

| Variable | Type in Vercel | Description |
|---|---|---|
| `VITE_VAPI_PUBLIC_KEY` | **Config** | Public key from Vapi Dashboard (*Org > API Keys*) |
| `VITE_VAPI_ASSISTANT_ID` | **Config** | Assistant identifier from Vapi Dashboard (*Assistants*) |
| `GEMINI_API_KEY` | **Secret** | API key from [Google AI Studio](https://aistudio.google.com) |
| `VAPI_PRIVATE_KEY` | **Secret** | Private API key from Vapi Dashboard (*Org > API Keys*) |

*(Note: The configuration service also supports variable names without the `VITE_` prefix)*

---

## Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm** / **yarn**

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/voiceagent.git
cd voiceagent

# Install dependencies
npm install
```

### 3. Configure Local Environment
Create a `.env` file in the root directory:
```env
VITE_VAPI_PUBLIC_KEY=your_vapi_public_key
VITE_VAPI_ASSISTANT_ID=your_vapi_assistant_id
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_VAPI_PRIVATE_KEY=your_vapi_private_key
```

### 4. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## Project Structure

```
├── api/
│   ├── recording.js      # Serverless endpoint for fetching Vapi call recordings
│   └── summary.js        # Serverless endpoint for Gemini 3.8 Flash summaries
├── src/
│   ├── components/
│   │   ├── AudioPlayer.jsx    # Custom audio player for call recordings
│   │   ├── BotAvatar.jsx      # Animated voicebot avatar with speaking indicators
│   │   ├── CallControls.jsx   # Start/End call action buttons with live timer
│   │   ├── ChatPanel.jsx      # Live scrolling conversation transcript
│   │   ├── ConsentBanner.jsx  # Call recording consent modal
│   │   ├── ErrorBanner.jsx    # User-facing error notifications
│   │   ├── SalesBadge.jsx     # Visual badge for sales status
│   │   ├── SetupScreen.jsx    # In-browser credential configuration screen
│   │   ├── StatusBadge.jsx    # Connection state indicator
│   │   ├── SummaryCard.jsx    # Post-call CRM intelligence report card
│   │   └── SummaryLoader.jsx  # Animated post-call processing skeleton
│   ├── hooks/
│   │   ├── useCallHistory.js  # Local storage call persistence hook
│   │   ├── useCallTimer.js    # Accurate active call timer hook
│   │   └── useVapi.js         # Vapi Web SDK integration and event handling
│   ├── pages/
│   │   └── CallHistory.jsx    # Historical call log review & playback
│   ├── services/
│   │   ├── config.js          # Unified environment & localStorage resolver
│   │   ├── geminiService.js   # Gemini AI summary client fallback
│   │   ├── publicConfig.js    # Backward-compatible public key wrapper
│   │   └── vapiRecording.js   # Call recording client fallback
│   ├── App.jsx                # Main application orchestrator
│   └── main.jsx               # React DOM entrypoint
├── public/                    # Static public assets
├── vercel.json                # Vercel serverless routing & SPA rewrites
├── vite.config.js             # Vite build & environment define configuration
└── package.json               # Project manifest & scripts
```

---

## Deployment to Vercel

1. Push your code to GitHub / GitLab / Bitbucket.
2. Import the repository in [Vercel](https://vercel.com).
3. Under **Project Settings > Environment Variables**, add:
   - `VITE_VAPI_PUBLIC_KEY` &rarr; Type: **Config**
   - `VITE_VAPI_ASSISTANT_ID` &rarr; Type: **Config**
   - `GEMINI_API_KEY` &rarr; Type: **Secret**
   - `VAPI_PRIVATE_KEY` &rarr; Type: **Secret**
4. Deploy the project. The included `vercel.json` ensures that both `/api/*` serverless functions and frontend client routes function seamlessly.

---

## Scripts

- `npm run dev`: Launch the local development server with Vite HMR.
- `npm run build`: Compile and optimize production assets into `dist/`.
- `npm run lint`: Fast code linting using Oxlint.
- `npm run preview`: Locally preview the compiled production build.

---

## License

MIT License. Designed and maintained for NexaCRM.
