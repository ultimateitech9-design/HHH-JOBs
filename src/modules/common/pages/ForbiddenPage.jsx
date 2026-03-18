import { Link } from 'react-router-dom';

const ForbiddenPage = () => {
  return (
    <div className="simple-page">
      <div className="simple-card">
        <p className="simple-kicker">403</p>
        <h1>Access Forbidden</h1>
        <p>You do not have permission to access this module with your current role.</p>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    </div>
  );
};

export default ForbiddenPage;
