/**
 * Central types file for database entities
 * These types are shared between the application and edge functions
 */

// Re-export types from the types directory
export * from '../../../types';

// Add any additional types needed for edge functions
export interface EdgeFunctionContext {
  auth: {
    userId?: string;
    role?: string;
  };
  requestId: string;
  timestamp: number;
}

// Add types specific to segment memberships
export interface SegmentMembership {
  id: string;
  customerId: string;
  segmentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SegmentRule {
  id: string;
  segmentId: string;
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: string | number | boolean;
} 