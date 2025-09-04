import React from 'react';
import { Bot, AlertTriangle, ListChecks } from 'lucide-react'; // Icons

const AIDiagnosticsModal = ({ issue, aiResponse, isLoading, onCancel }) => {
  // A simple function to format the AI's text response into paragraphs
  const formatResponse = (text) => {
    if (!text) return null;
    return text.split('\n').map((paragraph, index) => (
      <p key={index} className="mb-2">
        {paragraph}
      </p>
    ));
  };

  return (
    <div>
      <div className="mb-4">
        <h4 className="text-md font-semibold text-gray-800 dark:text-white">Diagnosing Issue: "{issue?.title}"</h4>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Using AI to analyze the reported issue and suggest next steps.
        </p>
      </div>
      
      <div className="mt-4 rounded-lg border bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
        {isLoading && (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Bot className="mb-4 h-10 w-10 animate-pulse text-blue-500" />
            <p className="font-semibold text-gray-700 dark:text-gray-300">AI is analyzing the issue...</p>
            <p className="text-sm text-gray-500">This may take a moment.</p>
          </div>
        )}
        
        {!isLoading && aiResponse && (
          <div>
            {/* We can improve formatting later, for now, just display the text */}
            <div className="prose prose-sm max-w-none dark:prose-invert">
                {formatResponse(aiResponse)}
            </div>
          </div>
        )}
         {!isLoading && !aiResponse && (
            <div className="text-center text-red-500">
                <AlertTriangle className="mx-auto mb-2 h-8 w-8" />
                <p>Failed to get a response from the AI service.</p>
            </div>
         )}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AIDiagnosticsModal;