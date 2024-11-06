import React from 'react';
import { JsonNode } from './JsonNode';
import { JsonValue } from './types';

interface JsonEditorProps {
  data: JsonValue;
  onChange: (newData: JsonValue) => void;
}

export const JsonEditor: React.FC<JsonEditorProps> = ({ data, onChange }) => {
  return (
    <div className="w-full">
      <JsonNode data={data} onChange={onChange} isRoot />
    </div>
  );
};