"use client";
import React from 'react';

// Main page loader with pulsing dots
export const PageLoader = ({ size = "default", text = "Loading..." }) => {
  const sizeClasses = {
    small: "w-16 h-16",
    default: "w-24 h-24", 
    large: "w-32 h-32"
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm">
      <div className={`${sizeClasses[size]} relative`}>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse"></div>
        <div className="absolute inset-2 rounded-full bg-white animate-pulse"></div>
        <div className="absolute inset-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-600 animate-spin"></div>
      </div>
      
      {text && (
        <div className="mt-6 text-center">
          <p className="text-lg font-medium text-slate-700">{text}</p>
          <div className="mt-2 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

// Inline spinner for buttons
export const Spinner = ({ size = "default", color = "blue" }) => {
  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-5 h-5",
    large: "w-6 h-6"
  };

  const colorClasses = {
    blue: "text-blue-600",
    white: "text-white",
    gray: "text-gray-600"
  };

  return (
    <div className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`}>
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
      </svg>
    </div>
  );
};

// Skeleton loader for content
export const Skeleton = ({ className = "", lines = 1 }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className="h-4 bg-gray-200 rounded mb-2 last:mb-0"
          style={{ 
            width: `${Math.random() * 40 + 60}%`,
            animationDelay: `${i * 100}ms`
          }}
        />
      ))}
    </div>
  );
};

export default PageLoader;
