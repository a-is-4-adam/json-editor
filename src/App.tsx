import React, { useState } from 'react';
import { JsonEditor } from './components/JsonEditor';

const initialJson = {
  name: "John Doe",
  age: 30,
  hobbies: ["reading", "gaming"],
  address: {
    street: "123 Main St",
    city: "New York"
  }
};

function App() {
  const [jsonData, setJsonData] = useState(initialJson);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">JSON Editor</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <JsonEditor 
            data={jsonData} 
            onChange={setJsonData}
          />
        </div>
        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <pre className="text-green-400 overflow-auto">
            {JSON.stringify(jsonData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default App;