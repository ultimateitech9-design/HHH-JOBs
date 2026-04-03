import ChatWindow from '../components/ChatWindow';
import SupportHeader from '../components/SupportHeader';
import useChat from '../hooks/useChat';

const LiveChat = () => {
  const { chats, loading, error, isDemo } = useChat();
  const activeChat = chats[0] || null;

  return (
    <div className="module-page module-page--platform">
      <SupportHeader title="Live Chat" subtitle="Review active customer chat sessions and respond to real-time support requests." />
      {isDemo ? <p className="module-note">Demo chat conversations are shown.</p> : null}
      {error ? <p className="form-error">{error}</p> : null}
      {loading ? <p className="module-note">Loading live chat...</p> : null}
      {!loading ? <ChatWindow chat={activeChat} /> : null}
    </div>
  );
};

export default LiveChat;
