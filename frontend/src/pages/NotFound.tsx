import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <h1 style={{ fontSize: '6rem', fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}>
        404
      </h1>
      <h2 style={{ fontSize: '2rem', fontWeight: 600 }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-secondary)', maxWidth: 400 }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
        Go Back Home
      </Link>
    </div>
  );
}
