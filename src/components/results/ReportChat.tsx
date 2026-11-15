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
  { text: 'What does my hemoglobin result mean?', badge: 'Hemoglobin', color: 'border-teal-200 bg-teal-50/90 text-teal-950 hover:bg-teal-100/80' },
  { text: 'Which results are outside the reference range?', badge: 'Review Range', color: 'border-amber-200 bg-amber-50/90 text-amber-950 hover:bg-amber-100/80' },
  { text: 'What questions should I ask my doctor about this report?', badge: 'Doctor Questions', color: 'border-cyan-200 bg-cyan-50/90 text-cyan-950 hover:bg-cyan-100/80' },
];

/**
 * Parses inline **bold**, *italic*, and `code` formatting in Gemini responses.
 */
function formatInlineMarkdown(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={match.index} className="font-extrabold text-black">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={match.index} className="italic text-slate-800">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code key={match.index} className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] text-slate-900 border border-slate-200">
          {token.slice(1, -1)}
        </code>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}

/**
 * Renders structured Gemini AI responses with clean headings, bullet lists,
 * and pure black typography exactly like Gemini web UI.
 */
function renderGeminiFormattedResponse(text: string): React.ReactNode {
  const paragraphs = text.split(/\n\n+/);

  return paragraphs.map((block, pIdx) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    // Heading 3 or 2
    if (trimmed.startsWith('### ')) {
      return (
        <h4 key={pIdx} className="text-xs sm:text-sm font-black text-black mt-3 mb-1.5 pb-1 border-b border-slate-100">
          {trimmed.replace(/^###\s+/, '')}
        </h4>
      );
    }
    if (trimmed.startsWith('## ')) {
      return (
        <h3 key={pIdx} className="text-sm sm:text-base font-black text-black mt-3.5 mb-1.5 pb-1 border-b border-slate-200">
          {trimmed.replace(/^##\s+/, '')}
        </h3>
      );
    }

    // List items (* item, - item, • item)
    const lines = trimmed.split('\n');
    const isList = lines.length > 0 && lines.every((l) => /^[\*\-•\d+\.]\s+/.test(l.trim()));

    if (isList) {
      return (
        <ul key={pIdx} className="my-2 space-y-1.5 pl-0.5">
          {lines.map((line, lIdx) => {
            const clean = line.trim().replace(/^([\*\-•]|\d+\.)\s+/, '');
            return (
              <li key={lIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-950 leading-relaxed">
                <span className="text-teal-600 font-bold shrink-0 mt-0.5 text-xs">•</span>
                <span className="flex-1 text-slate-950 font-normal">{formatInlineMarkdown(clean)}</span>
              </li>
            );
          })}
        </ul>
      );
    }

    // Regular paragraphs with inline formatting
    return (
      <p key={pIdx} className="my-1.5 text-xs sm:text-sm text-slate-950 leading-relaxed font-normal">
        {lines.map((line, lIdx) => (
          <React.Fragment key={lIdx}>
            {lIdx > 0 && <br />}
            {formatInlineMarkdown(line)}
          </React.Fragment>
        ))}
      </p>
    );
  });
}

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
      {/* Click-outside backdrop catcher - COMPLETELY TRANSPARENT, NO black shadow at top */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-transparent transition-opacity duration-200 ${
          isOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      />

      {/* Slide-over Right Drawer - Starts right under navbar on mobile (top-16) with NO top black shadow */}
      <div
        style={{ width: typeof window !== 'undefined' && window.innerWidth < 640 ? '100%' : `${drawerWidth}px`, maxWidth: '100vw' }}
        className={`fixed top-16 sm:top-0 bottom-0 right-0 z-50 flex flex-col bg-white border-l border-teal-200/80 shadow-xl shadow-teal-950/10 transition-transform duration-300 ease-in-out text-left select-text ${
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

        {/* Drawer Header - Clean & compact without dark shadows */}
        <div className="border-b border-teal-100 bg-gradient-to-r from-teal-50/80 via-cyan-50/50 to-white p-2.5 sm:p-4 flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="relative flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-700 via-teal-600 to-cyan-600 text-white shadow-md shadow-teal-700/20 shrink-0">
              <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-cyan-400"></span>
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs sm:text-base font-extrabold text-slate-900 truncate">
                  MediExplain Assistant
                </h3>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-teal-100/90 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-teal-800">
                  <Sparkles className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-teal-600" /> AI
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">
                Grounded in your report data
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
              className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Close assistant (Esc)"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>

        {/* Chat Messages Body with overscroll containment */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3 sm:space-y-4 overscroll-contain bg-gradient-to-b from-slate-50/40 via-white to-slate-50/20">
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

              <div className="mt-6 flex flex-col gap-2.5 w-full max-w-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-left">
                  Suggested Questions
                </span>
                {SUGGESTED_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(q.text)}
                    className={`text-left rounded-xl border p-3 transition-all shadow-2xs active:scale-[0.99] group ${q.color}`}
                  >
                    <span className="text-[10px] font-extrabold uppercase tracking-wider block opacity-75 mb-0.5">
                      {q.badge}
                    </span>
                    <span className="text-xs font-semibold block leading-snug">
                      "{q.text}"
                    </span>
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
                      className={`max-w-[88%] rounded-2xl p-3 sm:p-4 text-xs sm:text-sm leading-relaxed shadow-sm transition-all ${
                        isUser
                          ? 'bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 text-white rounded-tr-xs border border-teal-500/30'
                          : 'bg-white border border-slate-200/90 text-slate-950 rounded-tl-xs shadow-xs'
                      }`}
                    >
                      {/* USER QUESTION: Distinct colorful background with white text */}
                      {isUser ? (
                        <p className="font-semibold text-white whitespace-pre-line text-xs sm:text-sm">
                          {msg.text}
                        </p>
                      ) : (
                        /* GEMINI ANSWER: Pure crisp black text with markdown headings, bold items & bullets */
                        <div className="text-slate-950">
                          {renderGeminiFormattedResponse(msg.text)}
                        </div>
                      )}

                      <span
                        className={`block text-[10px] mt-2 text-right font-medium ${
                          isUser ? 'text-teal-100' : 'text-slate-400'
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>

                    {isUser && (
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-800 text-white shrink-0 mt-0.5 shadow-2xs">
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
                  <div className="rounded-2xl bg-white border border-slate-200/90 p-3 text-xs text-slate-900 shadow-2xs flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-teal-700" />
                    <span>Analyzing with Gemini AI...</span>
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

        {/* Input Bar pinned to the bottom - Ultra compact on mobile to avoid keyboard lag */}
        <div className="border-t border-teal-100 bg-white p-2 sm:p-3.5 shrink-0 shadow-xs pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-1.5 sm:gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about this report..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={isLoading}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden transition-all"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="btn-shimmer inline-flex items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-teal-700 to-cyan-600 px-3 py-2 sm:px-4 sm:py-2 text-xs font-bold text-white shadow-md shadow-teal-700/20 hover:shadow-lg disabled:opacity-40 transition-all active:scale-95 shrink-0"
              title="Send question"
            >
              <Send className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Ask</span>
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
