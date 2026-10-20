import { useState, useCallback } from 'react';
import { useVapi } from './hooks/useVapi';
import { useCallTimer } from './hooks/useCallTimer';
import { useCallHistory } from './hooks/useCallHistory';
import { generateCallSummary } from './services/geminiService';
import { fetchRecordingUrl } from './services/vapiRecording';
import SetupScreen from './components/SetupScreen';
import StatusBadge from './components/StatusBadge';
import BotAvatar from './components/BotAvatar';
import ChatPanel from './components/ChatPanel';
import CallControls from './components/CallControls';
import SummaryCard from './components/SummaryCard';
import SummaryLoader from './components/SummaryLoader';
import ConsentBanner from './components/ConsentBanner';
import ErrorBanner from './components/ErrorBanner';
import CallHistory from './pages/CallHistory';

function VoiceAgentApp() {
  const [activeTab, setActiveTab] = useState('call');
  const [showConsent, setShowConsent] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [currentSummary, setCurrentSummary] = useState(null);
  const [currentRecordingUrl, setCurrentRecordingUrl] = useState(null);
  const [summaryError, setSummaryError] = useState(null);

  const {
    status,
    messages,
    callId,
    isSpeaking,
    error: vapiError,
    startCall,
    endCall,
    setStatus,
  } = useVapi();

  const { formatted: timerFormatted } = useCallTimer(status === 'live');
  const { history, addCall, clearHistory } = useCallHistory();

  const handleStartRequest = () => {
    setCurrentSummary(null);
    setCurrentRecordingUrl(null);
    setSummaryError(null);
    setShowConsent(true);
  };

  const handleConsentAccept = () => {
    setShowConsent(false);
    startCall();
  };

  const handleConsentDecline = () => {
    setShowConsent(false);
  };

  const handleEndCall = useCallback(async () => {
    const currentCallId = callId;
    const currentMessages = [...messages];
    const duration = timerFormatted;

    endCall();

    if (currentMessages.length === 0) {
      return;
    }

    setIsGeneratingSummary(true);
    setSummaryError(null);

    try {
      const [summary, recordingUrl] = await Promise.all([
        generateCallSummary(currentMessages).catch((err) => {
          console.error('Summary generation failed:', err);
          setSummaryError(err.message);
          return null;
        }),
        fetchRecordingUrl(currentCallId).catch((err) => {
          console.error('Recording fetch failed:', err);
          return null;
        }),
      ]);

      setCurrentSummary(summary);
      setCurrentRecordingUrl(recordingUrl);

      addCall({
        id: currentCallId || Date.now().toString(),
        date: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
        duration,
        transcript: currentMessages,
        recordingUrl,
        summary,
        salesStatus: summary?.salesStatus || 'No Response',
      });
    } catch (err) {
      console.error('Post-call processing failed:', err);
      setSummaryError(err.message);
    } finally {
      setIsGeneratingSummary(false);
    }
  }, [callId, messages, timerFormatted, endCall, addCall]);

  const handleNewCall = () => {
    setCurrentSummary(null);
    setCurrentRecordingUrl(null);
    setSummaryError(null);
    setStatus('idle');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Consent Banner */}
      {showConsent && (
        <ConsentBanner onAccept={handleConsentAccept} onDecline={handleConsentDecline} />
      )}

      {/* Navigation */}
      <nav className="border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </div>
              <h1 className="text-lg font-bold tracking-tight">
                AI Sales Bot
                <span className="text-slate-500 font-normal text-sm ml-2">by NexaCRM</span>
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <StatusBadge status={status} />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 -mb-px">
            <button
              onClick={() => setActiveTab('call')}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'call'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              Live Call
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              Call History
              {history.length > 0 && (
                <span className="bg-slate-700 text-slate-300 text-xs px-1.5 py-0.5 rounded-full">
                  {history.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-5xl mx-auto w-full">
        {activeTab === 'call' ? (
          <div className="flex-1 flex flex-col">
            {/* Error Banner */}
            {(vapiError || summaryError) && (
              <div className="p-4">
                <ErrorBanner
                  message={vapiError || summaryError}
                  onDismiss={() => setSummaryError(null)}
                />
              </div>
            )}

            {/* Bot Avatar Section */}
            <div className="flex justify-center py-8">
              <BotAvatar isSpeaking={isSpeaking} status={status} />
            </div>

            {/* Chat Panel */}
            <div className="flex-1 flex flex-col min-h-0 border-t border-slate-800">
              <ChatPanel messages={messages} />
            </div>

            {/* Summary Section */}
            {(isGeneratingSummary || currentSummary) && (
              <div className="p-4">
                {isGeneratingSummary ? (
                  <SummaryLoader />
                ) : (
                  <>
                    <SummaryCard summary={currentSummary} recordingUrl={currentRecordingUrl} />
                    <div className="mt-4 flex justify-center">
                      <button
                        onClick={handleNewCall}
                        className="btn-primary bg-blue-600 hover:bg-blue-500 text-white"
                      >
                        Start New Call
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Controls */}
            <CallControls
              status={status}
              onStart={handleStartRequest}
              onEnd={handleEndCall}
              timerFormatted={timerFormatted}
            />
          </div>
        ) : (
          <CallHistory history={history} onClear={clearHistory} />
        )}
      </main>
    </div>
  );
}

export default function App() {
  if (!import.meta.env.VITE_VAPI_PUBLIC_KEY) {
    return <SetupScreen />;
  }

  return <VoiceAgentApp />;
}
