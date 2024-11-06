import { JsonValue } from './types';

export const updateNestedValue = (
  data: JsonValue,
  path: string[],
  value: JsonValue
): JsonValue => {
  if (path.length === 0) {
    return value;
  }

  const [head, ...rest] = path;
  
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  if (Array.isArray(data)) {
    const index = parseInt(head, 10);
    if (isNaN(index)) return data;
    
    const newArray = [...data];
    newArray[index] = updateNestedValue(data[index], rest, value);
    return newArray;
  }

  return {
    ...data,
    [head]: updateNestedValue((data as any)[head], rest, value)
  };
};