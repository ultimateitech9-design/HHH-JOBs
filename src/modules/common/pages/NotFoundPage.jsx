import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="simple-page">
      <div className="simple-card">
        <p className="simple-kicker">404</p>
        <h1>Route Not Found</h1>
        <p>The page you requested does not exist in the new module-wise UI.</p>
        <Link to="/" className="btn-primary">Go to Home</Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
