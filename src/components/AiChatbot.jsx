import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiLoader, FiMessageCircle, FiSend, FiTrash2, FiX } from 'react-icons/fi';
import { apiFetch } from '../utils/api';
import { getCurrentUser } from '../utils/auth';

const starterMessage = {
  role: 'assistant',
  content:
    'Hi! Main HHH Job AI Assistant hoon. Aap jobs, ATS, resume, interview ya dashboard help puch sakte ho.'
};

const fallbackErrorReply = (errorMessage) => {
  if (/Missing XAI_API_KEY|AI request failed|AI provider request failed/i.test(errorMessage)) {
    return 'AI service configure nahi hai. Server me XAI_API_KEY set karo.';
  }

  if (/Missing server configuration/i.test(errorMessage)) {
    return 'Backend config incomplete lag raha hai. SUPABASE_SERVICE_ROLE_KEY aur JWT_SECRET check karo.';
  }

  if (/Failed to fetch|NetworkError/i.test(errorMessage)) {
    return 'Backend reachable nahi hai. API server run ho raha hai ya nahi verify karo.';
  }

  return 'Response abhi nahi aa paya. Thodi der baad retry karo.';
};

const AiChatbot = ({ hideToggleButton = false }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([starterMessage]);
  const [user, setUser] = useState(() => getCurrentUser());
  const messagesRef = useRef(null);

  useEffect(() => {
    const syncUser = () => setUser(getCurrentUser());
    window.addEventListener('auth-changed', syncUser);
    window.addEventListener('storage', syncUser);

    return () => {
      window.removeEventListener('auth-changed', syncUser);
      window.removeEventListener('storage', syncUser);
    };
  }, []);

  useEffect(() => {
    const openChat = () => setIsOpen(true);
    const toggleChat = () => setIsOpen((prev) => !prev);

    window.addEventListener('ai-chatbot:open', openChat);
    window.addEventListener('ai-chatbot:toggle', toggleChat);

    return () => {
      window.removeEventListener('ai-chatbot:open', openChat);
      window.removeEventListener('ai-chatbot:toggle', toggleChat);
    };
  }, []);

  useEffect(() => {
    if (!messagesRef.current) return;
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages, isOpen]);

  const canSend = useMemo(() => input.trim().length > 0 && !isLoading, [input, isLoading]);

  const resetChat = () => {
    setMessages([starterMessage]);
    setInput('');
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    const message = input.trim();
    if (!message || isLoading) return;

    const history = messages
      .filter((item) => item.role === 'user' || item.role === 'assistant')
      .slice(-8)
      .map((item) => ({ role: item.role, content: item.content }));

    setMessages((prev) => [...prev, { role: 'user', content: message }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await apiFetch('/ai/chatbot', {
        method: 'POST',
        body: JSON.stringify({
          message,
          history,
          pageContext: location.pathname,
          roleContext: user?.role || 'guest'
        })
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.message || 'Chatbot failed');
      }

      const answer = String(payload?.answer || '').trim();
      if (!answer) {
        throw new Error('Empty response from chatbot');
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: answer }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: fallbackErrorReply(error?.message || '') }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-3 right-3 z-50 flex flex-col items-end sm:bottom-4 sm:right-4">
      {isOpen ? (
        <section className="mb-2 flex h-[min(72vh,500px)] w-[min(96vw,380px)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:mb-3">
          <header className="flex items-center justify-between bg-[#1f2e4a] px-4 py-3 text-white">
            <div>
              <h3 className="text-base font-bold">HHH Job AI</h3>
              <p className="text-xs text-slate-200">
                {user ? `Signed in as ${user.role}` : 'Guest mode'} | Assistant
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={resetChat}
                className="rounded-md p-1 text-slate-200 hover:bg-white/20"
                title="Reset chat"
              >
                <FiTrash2 />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-md p-1 text-slate-200 hover:bg-white/20"
                title="Close chatbot"
              >
                <FiX />
              </button>
            </div>
          </header>

          {!user ? (
            <div className="border-b border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
              Better answers ke liye <Link to="/login" className="font-semibold underline">login</Link> karo.
            </div>
          ) : null}

          <div ref={messagesRef} className="flex-1 space-y-2 overflow-y-auto bg-slate-50 p-3">
            {messages.map((item, index) => (
              <div
                key={`${item.role}-${index}`}
                className={`max-w-[86%] rounded-xl px-3 py-2 text-sm leading-snug sm:max-w-[80%] ${
                  item.role === 'user'
                    ? 'ml-auto bg-[#236e9f] text-white'
                    : 'bg-slate-200 text-slate-800'
                }`}
              >
                {item.content}
              </div>
            ))}

            {isLoading ? (
              <div className="inline-flex items-center gap-2 rounded-xl bg-slate-200 px-3 py-2 text-sm text-slate-700">
                <FiLoader className="animate-spin" />
                <span>Thinking...</span>
              </div>
            ) : null}
          </div>

          <form onSubmit={sendMessage} className="flex items-center gap-2 border-t border-slate-200 bg-white p-3">
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about jobs, resume, ATS..."
              className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#236e9f]"
            />
            <button
              type="submit"
              disabled={!canSend}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#236e9f] text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiSend />
            </button>
          </form>
        </section>
      ) : null}

      {!hideToggleButton ? (
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#1f2e4a] text-white shadow-xl transition hover:scale-[1.03] sm:h-14 sm:w-14"
          title="Open AI assistant"
          aria-label="Open AI assistant"
        >
          <FiMessageCircle size={22} />
        </button>
      ) : null}
    </div>
  );
};

export default AiChatbot;
