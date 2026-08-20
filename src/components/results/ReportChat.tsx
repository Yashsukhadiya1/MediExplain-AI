import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, HelpCircle, MessageSquare } from 'lucide-react';
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
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden text-left">
      {/* Header */}
      <div className="border-b border-slate-200 bg-slate-50 p-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-teal-800" />
            <h3 className="text-sm font-bold text-slate-900">
              Ask about your report
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Ask specific questions about the values, terms, or reference ranges in your uploaded report.
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="h-[320px] overflow-y-auto p-4 space-y-3 bg-slate-50/40">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center p-4">
            <HelpCircle className="h-8 w-8 text-teal-700/60 mb-2" />
            <p className="text-xs font-semibold text-slate-800">
              Have questions about this report?
            </p>
            <p className="text-[11px] text-slate-500 max-w-sm mt-1">
              Select one of the example questions below or type your own question.
            </p>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {SUGGESTED_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(q)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:border-teal-700 hover:text-slate-900 transition-colors shadow-2xs"
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
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl p-3 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-teal-800 text-white'
                        : 'bg-white border border-slate-200 text-slate-800 shadow-2xs'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span
                      className={`block text-[10px] mt-1 text-right ${
                        isUser ? 'text-teal-200' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-xl bg-white border border-slate-200 p-3 text-xs text-slate-500 shadow-2xs flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-teal-800" />
                  <span>Checking your report data...</span>
                </div>
              </div>
            )}
          </>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error alert */}
      {errorText && (
        <div className="border-t border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-900">
          {errorText}
        </div>
      )}

      {/* Input container */}
      <div className="border-t border-slate-200 bg-white p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask a question about this report..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={isLoading}
            className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-800 focus:bg-white focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="inline-flex items-center gap-1 rounded-lg bg-teal-800 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-900 disabled:opacity-40 transition-colors"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Ask</span>
          </button>
        </form>
      </div>
    </div>
  );
};
