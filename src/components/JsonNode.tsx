import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Trash2, Type } from 'lucide-react';
import { JsonTypeSelector, JsonValueType, getInitialValueForType } from './JsonTypeSelector';
import { JsonValue } from './types';
import { updateNestedValue } from './utils';

interface JsonNodeProps {
  data: JsonValue;
  onChange: (newData: JsonValue) => void;
  path?: string[];
  onDelete?: () => void;
  isRoot?: boolean;
}

export const JsonNode: React.FC<JsonNodeProps> = ({ 
  data, 
  onChange, 
  path = [], 
  onDelete, 
  isRoot = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [newKey, setNewKey] = useState('');
  const [showTypeSelector, setShowTypeSelector] = useState(false);

  const handleValueChange = (value: string, currentPath: string[]) => {
    let parsedValue: JsonValue = value;
    try {
      if (value === 'true') parsedValue = true;
      else if (value === 'false') parsedValue = false;
      else if (value === 'null') parsedValue = null;
      else if (!isNaN(Number(value)) && value.trim() !== '') parsedValue = Number(value);
    } catch {
      parsedValue = value;
    }

    if (typeof data === 'object' && data !== null) {
      const newData = { ...data };
      let current = newData;
      
      for (let i = 0; i < currentPath.length - 1; i++) {
        current = current[currentPath[i]] as any;
      }
      
      current[currentPath[currentPath.length - 1]] = parsedValue;
      onChange(newData);
    } else {
      onChange(parsedValue);
    }
  };

  const addNewItem = (type: JsonValueType) => {
    const initialValue = getInitialValueForType(type);
    
    if (Array.isArray(data)) {
      onChange([...data, initialValue]);
    } else if (typeof data === 'object' && data !== null && newKey) {
      const newData = { ...data };
      newData[newKey] = initialValue;
      onChange(newData);
      setNewKey('');
    }
    setShowTypeSelector(false);
  };

  const deleteItem = (key: string) => {
    if (Array.isArray(data)) {
      onChange(data.filter((_, i) => i !== Number(key)));
    } else if (typeof data === 'object' && data !== null) {
      const newData = { ...data };
      delete newData[key];
      onChange(newData);
    }
  };

  const renderValue = (value: JsonValue, currentPath: string[]) => {
    if (typeof value !== 'object' || value === null) {
      return (
        <div className="flex items-center gap-2 group">
          <Type size={16} className="text-gray-400" />
          <input
            type="text"
            value={String(value)}
            onChange={(e) => handleValueChange(e.target.value, currentPath)}
            className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />
          {!isRoot && onDelete && (
            <button
              onClick={onDelete}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-red-500"
              aria-label="Delete item"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      );
    }
    return null;
  };

  if (typeof data !== 'object' || data === null) {
    return renderValue(data, path);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 group">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-gray-100 rounded"
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        <span className="font-medium">
          {Array.isArray(data) ? 'Array' : 'Object'} ({Object.keys(data).length})
        </span>
        {!isRoot && onDelete && (
          <button
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-red-500"
            aria-label="Delete item"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="pl-6 space-y-2">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <div className="min-w-[100px] font-mono text-sm">
                {!Array.isArray(data) && (
                  <input
                    type="text"
                    value={key}
                    onChange={(e) => {
                      const newData = { ...data };
                      const newKey = e.target.value;
                      delete newData[key];
                      newData[newKey] = value;
                      onChange(newData);
                    }}
                    className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  />
                )}
              </div>
              <div className="flex-1">
                <JsonNode
                  data={value}
                  onChange={(newValue) => {
                    const newData = Array.isArray(data) ? [...data] : { ...data };
                    newData[key] = newValue;
                    onChange(newData);
                  }}
                  path={[...path, key]}
                  onDelete={() => deleteItem(key)}
                />
              </div>
            </div>
          ))}

          <div className="space-y-2">
            {!Array.isArray(data) && (
              <input
                type="text"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="New key"
                className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
            
            {showTypeSelector ? (
              <JsonTypeSelector onSelect={addNewItem} />
            ) : (
              <button
                onClick={() => setShowTypeSelector(true)}
                className="flex items-center gap-1 px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                disabled={!Array.isArray(data) && !newKey}
              >
                <Plus size={16} />
                Add {Array.isArray(data) ? 'item' : 'property'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};