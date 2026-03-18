import { formatDateTime } from '../utils/formatDate';

const ChatMessage = ({ message }) => {
  const isAgent = message.role === 'agent';

  return (
    <article className="panel-card" style={{ background: isAgent ? '#eef7f4' : '#f7f8fb' }}>
      <div className="dash-card-head">
        <div>
          <h3>{message.author}</h3>
          <p>{isAgent ? 'Support' : 'Customer'}</p>
        </div>
        <span className="module-note">{formatDateTime(message.createdAt)}</span>
      </div>
      <p>{message.text || message.message}</p>
    </article>
  );
};

export default ChatMessage;
