import ChatMessage from './ChatMessage';
import EmptyState from './EmptyState';

const ChatWindow = ({ chat }) => {
  if (!chat) {
    return <EmptyState title="No active chat selected." description="Open a conversation to review customer messages." />;
  }

  return (
    <section className="panel-card">
      <div className="dash-card-head">
        <div>
          <h3>{chat.visitor}</h3>
          <p>{chat.company} | Assigned to {chat.assignedTo}</p>
        </div>
      </div>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {(chat.messages || []).map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>
    </section>
  );
};

export default ChatWindow;
