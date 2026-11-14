import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, HelpCircle, Bot, User, Sparkles } from 'lucide-react';
import { ReportData, ChatMessage } from '../../types/report';
import { askAboutReport } from '../../services/reportService';

interface ReportChatProps {
  report: ReportData;
  initialQuestion?: string | null;
}

const SUGGESTED_QUESTIONS = [
  'What does my hemoglobin result mean?',
  'Which results are outside the reference range?',
  'What does this test measure?',
];

export const ReportChat: React.FC<ReportChatProps> = ({ report, initialQuestion }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialQuestion) {
      handleSend(`What does my ${initialQuestion} result mean?`);
    }
  }, [initialQuestion]);

  const handleSend = async (queryToSend?: string) => {
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
  };

  return (
    <div className="glass-card rounded-2xl border border-white/90 shadow-xl shadow-teal-950/5 overflow-hidden text-left">
      {/* Header */}
      <div className="border-b border-teal-100/70 bg-gradient-to-r from-teal-50/60 to-cyan-50/40 p-4.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-700 to-cyan-600 text-white shadow-xs">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-extrabold text-slate-900">
                Ask MediExplain Assistant
              </h3>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-teal-100/80 px-2 py-0.5 text-[10px] font-bold text-teal-800">
                <Sparkles className="h-2.5 w-2.5 text-teal-600" /> AI
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Ask specific questions about the values, terms, or reference ranges in your uploaded report.
            </p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="h-[340px] overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-slate-50/50">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 mb-3 border border-teal-200/60 shadow-2xs">
              <HelpCircle className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-slate-900">
              Have questions about this report?
            </p>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              Select one of the suggested questions below or type any question in your mind.
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-2 max-w-md">
              {SUGGESTED_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(q)}
                  className="rounded-xl border border-teal-200/70 bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:border-teal-500 hover:text-teal-900 hover:bg-teal-50/50 transition-all shadow-2xs active:scale-95"
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
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600 text-white shrink-0 mt-1 shadow-2xs">
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
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span
                      className={`block text-[10px] mt-1.5 text-right font-medium ${
                        isUser ? 'text-teal-200' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>

                  {isUser && (
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-white shrink-0 mt-1 shadow-2xs">
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
                  <span>Checking your report data and preparing answer...</span>
                </div>
              </div>
            )}
          </>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error alert */}
      {errorText && (
        <div className="border-t border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-900 font-medium">
          {errorText}
        </div>
      )}

      {/* Input container */}
      <div className="border-t border-teal-100/70 bg-white p-3.5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2.5"
        >
          <input
            type="text"
            placeholder="Ask a question about this report..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={isLoading}
            className="flex-1 rounded-xl border border-slate-200/90 bg-slate-50/80 px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden transition-all"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="btn-shimmer inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-700 to-cyan-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-700/20 hover:shadow-lg disabled:opacity-40 transition-all active:scale-95"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Ask</span>
          </button>
        </form>
      </div>
    </div>
  );
};
