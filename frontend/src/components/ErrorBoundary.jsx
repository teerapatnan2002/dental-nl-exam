import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', color: 'var(--danger)', background: 'var(--bg)', minHeight: '100vh' }}>
          <h2>🚨 เกิดข้อผิดพลาดในระบบ (System Crash)</h2>
          <p>กรุณาแคปหน้าจอนี้ส่งให้ผู้พัฒนา:</p>
          <pre style={{ background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '8px', overflowX: 'auto', color: '#ff8a8a', fontSize: '0.85rem' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
          <button 
            className="btn btn-outline" 
            style={{ marginTop: '1rem' }}
            onClick={() => window.location.reload()}
          >
            รีเฟรชหน้าเว็บ
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
