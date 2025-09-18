import React from 'react';

class ErrorBoundary extends React.Component {
 constructor(props) {
 super(props);
 this.state = { hasError: false, error: null, errorInfo: null };
 }

 static getDerivedStateFromError(error) {
 // Update state so the next render will show the fallback UI
 return { hasError: true };
 }

 componentDidCatch(error, errorInfo) {
 // Log the error to console for debugging
 console.error('Error caught by boundary:', error, errorInfo);
 this.setState({
 error: error,
 errorInfo: errorInfo
 });
 }

 render() {
 if (this.state.hasError) {
 // You can render any custom fallback UI
 return (
 <div className="min-h-screen flex items-center justify-center bg-gray-50">
 <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
 <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
 <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
 </svg>
 </div>
 <div className="mt-4 text-center">
 <h3 className="text-lg font-medium text-gray-900">Something went wrong</h3>
 <p className="mt-2 text-sm text-gray-500">
 An error occurred while rendering this component. Please try refreshing the page.
 </p>
 <div className="mt-4">
 <button
 onClick={() => window.location.reload()}
 className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
 >
 Refresh Page
 </button>
 </div>
 </div>
 {process.env.NODE_ENV === 'development' && this.state.error && (
 <details className="mt-4 text-sm">
 <summary className="cursor-pointer text-gray-600">Error Details (Development)</summary>
 <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
 {this.state.error && this.state.error.toString()}
 <br />
 {this.state.errorInfo.componentStack}
 </pre>
 </details>
 )}
 </div>
 </div>
 );
 }

 return this.props.children;
 }
}

export default ErrorBoundary;
