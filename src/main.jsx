import React, { Component } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class GlobalErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Global React Runtime Error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[#0A0A0E] text-white p-8 flex flex-col items-center justify-center text-center font-mono">
                    <div className="max-w-2xl w-full bg-[#14141B] p-6 rounded-2xl border border-red-500/30 shadow-2xl text-left">
                        <div className="flex items-center gap-3 text-red-400 mb-4 font-bold text-lg">
                            <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                            <span>Application Diagnostic Info</span>
                        </div>
                        <p className="text-sm text-amber-300 font-semibold mb-2">{this.state.error?.toString()}</p>
                        <pre className="text-xs text-gray-400 bg-black/60 p-4 rounded-lg overflow-auto max-h-64 whitespace-pre-wrap font-mono">
                            {this.state.error?.stack || this.state.errorInfo?.componentStack || 'No stack trace available'}
                        </pre>
                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={() => {
                                    localStorage.clear();
                                    sessionStorage.clear();
                                    window.location.reload();
                                }}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
                            >
                                Clear Local Cache & Reload
                            </button>
                        </div>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <GlobalErrorBoundary>
        <App />
    </GlobalErrorBoundary>,
)
