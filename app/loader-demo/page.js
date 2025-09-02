"use client";
import React, { useState } from 'react';
import { PageLoader, Spinner, Skeleton } from '../Components/Loader';

export default function LoaderDemo() {
  const [showPageLoader, setShowPageLoader] = useState(false);
  const [loadingStates, setLoadingStates] = useState({
    button1: false,
    button2: false,
    button3: false
  });

  const handleButtonClick = (buttonName) => {
    setLoadingStates(prev => ({ ...prev, [buttonName]: true }));
    setTimeout(() => {
      setLoadingStates(prev => ({ ...prev, [buttonName]: false }));
    }, 2000);
  };

  const togglePageLoader = () => {
    setShowPageLoader(true);
    setTimeout(() => setShowPageLoader(false), 3000);
  };

  if (showPageLoader) {
    return <PageLoader text="Loading demo page..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Loader Components Showcase</h1>
          <p className="text-lg text-slate-600">Explore all the different loading states and animations</p>
        </div>

        {/* Page Loader Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">Page Loader</h2>
          <p className="text-slate-600 mb-6">Full-screen loader with backdrop blur and animated elements</p>
          <button
            onClick={togglePageLoader}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Show Page Loader (3 seconds)
          </button>
        </div>

        {/* Spinner Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">Spinner Components</h2>
          <p className="text-slate-600 mb-6">Different sized spinners for buttons and inline elements</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <h3 className="font-medium text-slate-700 mb-3">Small</h3>
              <Spinner size="small" />
            </div>
            <div className="text-center">
              <h3 className="font-medium text-slate-700 mb-3">Default</h3>
              <Spinner size="default" />
            </div>
            <div className="text-center">
              <h3 className="font-medium text-slate-700 mb-3">Large</h3>
              <Spinner size="large" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="font-medium text-slate-700 mb-3">Blue</h3>
              <Spinner size="default" color="blue" />
            </div>
            <div className="text-center">
              <h3 className="font-medium text-slate-700 mb-3">White</h3>
              <div className="bg-slate-800 p-4 rounded-lg inline-block">
                <Spinner size="default" color="white" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-medium text-slate-700 mb-3">Gray</h3>
              <Spinner size="default" color="gray" />
            </div>
          </div>
        </div>

        {/* Button Loading States */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">Button Loading States</h2>
          <p className="text-slate-600 mb-6">Interactive buttons with loading spinners</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleButtonClick('button1')}
              disabled={loadingStates.button1}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full"
            >
              {loadingStates.button1 && <Spinner size="small" color="white" />}
              {loadingStates.button1 ? 'Loading...' : 'Click Me'}
            </button>

            <button
              onClick={() => handleButtonClick('button2')}
              disabled={loadingStates.button2}
              className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full"
            >
              {loadingStates.button2 && <Spinner size="small" color="white" />}
              {loadingStates.button2 ? 'Processing...' : 'Save Data'}
            </button>

            <button
              onClick={() => handleButtonClick('button3')}
              disabled={loadingStates.button3}
              className="flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full"
            >
              {loadingStates.button3 && <Spinner size="small" color="white" />}
              {loadingStates.button3 ? 'Sending...' : 'Submit Form'}
            </button>
          </div>
        </div>

        {/* Skeleton Loading */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">Skeleton Loading</h2>
          <p className="text-slate-600 mb-6">Content placeholders while data is loading</p>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-slate-700 mb-3">Single Line</h3>
              <Skeleton />
            </div>
            
            <div>
              <h3 className="font-medium text-slate-700 mb-3">Multiple Lines</h3>
              <Skeleton lines={3} />
            </div>
            
            <div>
              <h3 className="font-medium text-slate-700 mb-3">Custom Width</h3>
              <Skeleton className="w-1/2" />
              <Skeleton className="w-3/4" />
              <Skeleton className="w-1/3" />
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">Usage Examples</h2>
          <p className="text-slate-600 mb-6">How to implement these loaders in your components</p>
          
          <div className="bg-slate-900 rounded-lg p-6 text-slate-100 font-mono text-sm overflow-x-auto">
            <pre>{`// Import the loader components
import { PageLoader, Spinner, Skeleton } from '../Components/Loader';

// Page loader for full-screen loading
if (loading) {
  return <PageLoader text="Loading..." />;
}

// Spinner for buttons
<button disabled={submitting}>
  {submitting ? <Spinner size="small" /> : null}
  {submitting ? 'Saving...' : 'Save'}
</button>

// Skeleton for content
{tasksLoading ? (
  <Skeleton lines={5} />
) : (
  // Your actual content
)}`}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
