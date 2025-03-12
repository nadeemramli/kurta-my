/**
 * Utility functions for database operations
 */

/**
 * Converts snake_case database column names to camelCase
 */
export function snakeToCamel(obj: Record<string, any>): Record<string, any> {
  if (!obj || typeof obj !== 'object') return obj;
  
  return Object.keys(obj).reduce((result, key) => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    const value = obj[key];
    
    result[camelKey] = value && typeof value === 'object' 
      ? snakeToCamel(value) 
      : value;
    
    return result;
  }, {} as Record<string, any>);
}

/**
 * Converts camelCase object keys to snake_case for database operations
 */
export function camelToSnake(obj: Record<string, any>): Record<string, any> {
  if (!obj || typeof obj !== 'object') return obj;
  
  return Object.keys(obj).reduce((result, key) => {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    const value = obj[key];
    
    result[snakeKey] = value && typeof value === 'object' 
      ? camelToSnake(value) 
      : value;
    
    return result;
  }, {} as Record<string, any>);
}

/**
 * Formats a date for database operations
 */
export function formatDate(date: Date): string {
  return date.toISOString();
}

/**
 * Parses a database date string
 */
export function parseDate(dateString: string): Date {
  return new Date(dateString);
} 