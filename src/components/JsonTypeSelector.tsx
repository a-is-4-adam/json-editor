import React from 'react';
import { Type } from 'lucide-react';

export type JsonValueType = 'string' | 'number' | 'boolean' | 'null' | 'array' | 'object';

interface JsonTypeSelectorProps {
  onSelect: (type: JsonValueType) => void;
}

export const getInitialValueForType = (type: JsonValueType): any => {
  switch (type) {
    case 'string':
      return '';
    case 'number':
      return 0;
    case 'boolean':
      return false;
    case 'null':
      return null;
    case 'array':
      return [];
    case 'object':
      return {};
  }
};

export const JsonTypeSelector: React.FC<JsonTypeSelectorProps> = ({ onSelect }) => {
  const types: JsonValueType[] = ['string', 'number', 'boolean', 'null', 'array', 'object'];

  return (
    <div className="flex gap-2 items-center">
      <Type size={16} className="text-gray-400" />
      <div className="flex gap-2 flex-wrap">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className="px-3 py-1 text-sm rounded border hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
};