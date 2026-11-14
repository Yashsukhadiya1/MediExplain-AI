import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Loader2, HelpCircle, Bot, User, Sparkles, X, Maximize2, Minimize2 } from 'lucide-react';
import { ReportData, ChatMessage } from '../../types/report';
import { askAboutReport } from '../../services/reportService';

interface ReportChatProps {
  report: ReportData;
  initialQuestion?: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const SUGGESTED_QUESTIONS = [
  'What does my hemoglobin result mean?',
  'Which results are outside the reference range?',
  'What does this test measure?',
];

export const ReportChat: React.FC<ReportChatProps> = ({
  report,
  initialQuestion,
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [drawerWidth, setDrawerWidth] = useState<number>(450);
  const [isWide, setIsWide] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isLoading, isOpen]);

  const handleSend = useCallback(async (queryToSend?: string) => {
    const text = (queryToSend || inputQuery).trim();
    if (!text || isLoading) return;

    setErrorText(null);
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const answer = await askAboutReport(text, report);
      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setErrorText(err.message || 'Unable to answer question right now.');
    } finally {
      setIsLoading(false);
    }
  }, [inputQuery, isLoading, report]);

  useEffect(() => {
    if (initialQuestion && isOpen) {
      handleSend(`What does my ${initialQuestion} result mean?`);
    }
  }, [initialQuestion, isOpen, handleSend]);

  // Drag to resize handler on left edge
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= 360 && newWidth <= Math.min(window.innerWidth * 0.9, 900)) {
        setDrawerWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      if (isDragging) setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const toggleWide = () => {
    if (isWide) {
      setDrawerWidth(450);
      setIsWide(false);
    } else {
      setDrawerWidth(Math.min(window.innerWidth * 0.85, 720));
      setIsWide(true);
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Slide-over Right Drawer */}
      <div
        style={{ width: typeof window !== 'undefined' && window.innerWidth < 640 ? '100%' : `${drawerWidth}px` }}
        className={`fixed inset-y-0 right-0 z-50 flex flex-col bg-white shadow-2xl border-l border-teal-100 transition-transform duration-300 ease-in-out text-left select-text ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Left resize handle (Desktop only) */}
        <div
          onMouseDown={handleMouseDown}
          className="hidden sm:flex absolute left-0 top-0 bottom-0 w-2 -translate-x-1/2 cursor-ew-resize items-center justify-center hover:bg-teal-500/40 active:bg-teal-600 transition-colors z-20 group"
          title="Drag to resize assistant panel"
        >
          <div className="h-8 w-1 rounded-full bg-slate-300 group-hover:bg-teal-600 transition-colors" />
        </div>

        {/* Drawer Header */}
        <div className="border-b border-teal-100/80 bg-gradient-to-r from-teal-50/70 via-cyan-50/50 to-white p-4 sm:p-4.5 flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-700 via-teal-600 to-cyan-600 text-white shadow-md shadow-teal-700/20 shrink-0">
              <Bot className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
                  MediExplain Assistant
                </h3>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-teal-100/90 px-2 py-0.5 text-[10px] font-bold text-teal-800">
                  <Sparkles className="h-2.5 w-2.5 text-teal-600" /> AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                Grounded in your uploaded medical report
              </p>
            </div>
          </div>

          {/* Action buttons (Resize & Close) */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Width Toggle (Desktop) */}
            <button
              type="button"
              onClick={toggleWide}
              className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title={isWide ? 'Compact view' : 'Wide view'}
            >
              {isWide ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Close assistant (Esc)"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-gradient-to-b from-slate-50/60 to-white">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 mb-3 border border-teal-200/60 shadow-2xs">
                <HelpCircle className="h-6 w-6" />
              </div>
              <p className="text-sm font-extrabold text-slate-900">
                How can I help you with this report?
              </p>
              <p className="text-xs text-slate-500 max-w-xs mt-1.5 leading-relaxed">
                Ask anything about your reported test values, reference limits, or medical terms.
              </p>

              <div className="mt-6 flex flex-col gap-2 w-full max-w-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-left">
                  Suggested Questions
                </span>
                {SUGGESTED_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(q)}
                    className="text-left rounded-xl border border-teal-100 bg-white/95 p-3 text-xs font-semibold text-slate-700 hover:border-teal-500 hover:text-teal-900 hover:bg-teal-50/60 transition-all shadow-2xs active:scale-[0.99]"
                  >
                    "{q}"
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600 text-white shrink-0 mt-0.5 shadow-2xs">
                        <Bot className="h-4 w-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                        isUser
                          ? 'bg-gradient-to-r from-teal-700 to-cyan-700 text-white rounded-tr-xs'
                          : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-xs'
                      }`}
                    >
                      <p className="whitespace-pre-line font-normal">{msg.text}</p>
                      <span
                        className={`block text-[10px] mt-1.5 text-right font-medium ${
                          isUser ? 'text-teal-200' : 'text-slate-400'
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>

                    {isUser && (
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-white shrink-0 mt-0.5 shadow-2xs">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-center gap-2.5 justify-start">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600 text-white shrink-0 shadow-2xs">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl bg-white border border-slate-200/90 p-3 text-xs text-slate-600 shadow-2xs flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-teal-700" />
                    <span>Analyzing your report findings...</span>
                  </div>
                </div>
              )}
            </>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Error Notification */}
        {errorText && (
          <div className="border-t border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-900 font-medium">
            {errorText}
          </div>
        )}

        {/* Input Bar pinned to the bottom */}
        <div className="border-t border-teal-100 bg-white p-3.5 sm:p-4 shrink-0 shadow-xs">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about this report..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={isLoading}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden transition-all"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="btn-shimmer inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-700 to-cyan-600 px-4.5 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-700/20 hover:shadow-lg disabled:opacity-40 transition-all active:scale-95"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Ask</span>
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
