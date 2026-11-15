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

  handleResetAndReload = () => {
    try {
      const keysToClear = [];
      for (let i = 0; i < window.sessionStorage.length; i += 1) {
        const k = window.sessionStorage.key(i);
        if (k && k.startsWith('nl_v4_')) keysToClear.push(k);
      }
      keysToClear.forEach((k) => window.sessionStorage.removeItem(k));
    } catch {
      // Ignore storage errors
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '2rem',
            color: 'var(--danger, #f87171)',
            background: 'var(--bg, #09090b)',
            minHeight: '100vh',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          <h2 style={{ color: 'var(--text, #f8fafc)', marginTop: 0 }}>🚨 เกิดข้อผิดพลาดในระบบ (System Crash)</h2>
          <p style={{ color: 'var(--text-sub, #cbd5e1)' }}>กรุณาแคปหน้าจอนี้ส่งให้ผู้พัฒนา หรือลองกดล้างสถานะค้างเพื่อกลับหน้าหลัก:</p>
          <pre style={{ background: 'rgba(15, 23, 42, 0.85)', padding: '1rem', borderRadius: '8px', overflowX: 'auto', color: '#fca5a5', fontSize: '0.85rem' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            <button
              className="btn btn-primary"
              style={{ padding: '0.6rem 1.1rem', borderRadius: '8px', cursor: 'pointer' }}
              onClick={this.handleResetAndReload}
            >
              กลับหน้าหลักและล้างสถานะค้าง
            </button>
            <button
              className="btn btn-outline"
              style={{ padding: '0.6rem 1.1rem', borderRadius: '8px', cursor: 'pointer' }}
              onClick={() => window.location.reload()}
            >
              รีเฟรชหน้าเว็บ
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
