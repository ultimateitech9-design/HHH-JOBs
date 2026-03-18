import StatusPill from '../../../shared/components/StatusPill';
import { formatDateTime } from '../utils/dateFormat';

const PaymentMethodCard = ({ method }) => {
  return (
    <article className="panel-card">
      <div className="dash-card-head">
        <div>
          <h3>{method.title}</h3>
          <p>{method.provider} • {method.type}</p>
        </div>
        <StatusPill value={method.status || 'active'} />
      </div>

      <div style={{ display: 'grid', gap: '0.45rem' }}>
        <p><strong>Settlement:</strong> {method.settlementCycle || '-'}</p>
        <p><strong>Fee:</strong> {method.feeRate || '-'}</p>
        <p><strong>Descriptor:</strong> {method.descriptor || '-'}</p>
        <p><strong>Last used:</strong> {formatDateTime(method.lastUsedAt)}</p>
      </div>
    </article>
  );
};

export default PaymentMethodCard;
