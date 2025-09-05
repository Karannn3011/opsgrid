import React from 'react';
import { Bot, AlertTriangle } from 'lucide-react';

const AIDiagnosticsModal = ({ issue, aiResponse, isLoading, onCancel }) => {
  // Function to format the plain text response into paragraphs
  const formatResponse = (text) => {
    if (!text) return null;
    // Split by newline characters and filter out any empty lines
    return text.split('\n').filter(p => p).map((paragraph, index) => (
      <p key={index} className="mb-2">
        {paragraph}
      </p>
    ));
  };

  return (
    <div>
      <div className="mb-4">
        <h4 className="text-md font-semibold">Diagnosing Issue: "{issue?.title}"</h4>
        <p className="mt-1 text-sm text-gray-600">
          Using AI to analyze the reported issue and suggest next steps.
        </p>
      </div>
      
      <div className="mt-4 max-h-50 overflow-y-scroll rounded-lg border bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
        {isLoading && (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Bot className="mb-4 h-10 w-10 animate-pulse text-blue-500" />
            <p className="font-semibold">AI is analyzing the issue...</p>
            <p className="text-sm text-gray-500">This may take a moment.</p>
          </div>
        )}
        
        {!isLoading && aiResponse && (
          // Display the formatted plain text
          <div className="prose prose-sm max-w-none dark:prose-invert">
              {formatResponse(aiResponse)}
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
        <button type="button" onClick={onCancel} className="rounded-md bg-gray-200 px-4 py-2">
          Close
        </button>
      </div>
    </div>
  );
};

export default AIDiagnosticsModal;