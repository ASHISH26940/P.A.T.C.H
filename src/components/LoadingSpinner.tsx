/**
 * t3-chat-frontend/components/chat/LoadingSpinner.tsx
 *
 * A simple, reusable loading spinner component made with Tailwind CSS.
 * This will be used to indicate when the application is waiting for an API response.
 */
import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div
      className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
      role="status"
      aria-label="Loading..."
    ></div>
  );
};
