import React from 'react';

const JsonViewer = ({ data }) => {
  const renderValue = (value, key) => {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return <span className="text-green-400">"{String(value)}"</span>;
    }
    if (Array.isArray(value)) {
      return (
        <>
          <span>[</span>
          <div className="pl-4">
            {value.map((item, index) => (
              <div key={`${key}-${index}`}>{renderValue(item, index)},</div>
            ))}
          </div>
          <span>]</span>
        </>
      );
    }
    if (typeof value === 'object' && value !== null) {
      return <JsonObject object={value} />;
    }
    return <span className="text-gray-500">null</span>;
  };

  const JsonObject = ({ object }) => (
    <>
      <span>{"{"}</span>
      <div className="pl-4">
        {Object.entries(object).map(([key, value]) => (
          <div key={key}>
            <span className="text-blue-400">"{key}"</span>: {renderValue(value, key)},
          </div>
        ))}
      </div>
      <span>{"}"}</span>
    </>
  );

  return (
    <pre className="whitespace-pre-wrap rounded-md bg-gray-900 p-4 text-sm font-mono text-white">
      <code>
        <JsonObject object={data} />
      </code>
    </pre>
  );
};

export default JsonViewer;