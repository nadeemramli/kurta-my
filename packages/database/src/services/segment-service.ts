import { createClient } from '@supabase/supabase-js';
import { SegmentMembership, SegmentRule } from '../types';

/**
 * Service for handling segment-related operations
 * This can be used by both the application and edge functions
 */
export class SegmentService {
  private supabase;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Get all segments
   */
  async getAllSegments() {
    const { data, error } = await this.supabase
      .from('segments')
      .select('*');
    
    if (error) throw error;
    return data;
  }

  /**
   * Get segment by ID
   */
  async getSegmentById(id: string) {
    const { data, error } = await this.supabase
      .from('segments')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  /**
   * Get segment rules
   */
  async getSegmentRules(segmentId: string): Promise<SegmentRule[]> {
    const { data, error } = await this.supabase
      .from('segment_rules')
      .select('*')
      .eq('segment_id', segmentId);
    
    if (error) throw error;
    return data;
  }

  /**
   * Get customers in a segment
   */
  async getCustomersInSegment(segmentId: string) {
    const { data, error } = await this.supabase
      .from('segment_memberships')
      .select('customer_id')
      .eq('segment_id', segmentId);
    
    if (error) throw error;
    return data.map(item => item.customer_id);
  }

  /**
   * Update segment memberships based on rules
   * This is the core function used by the edge function
   */
  async updateSegmentMemberships(segmentId: string) {
    // 1. Get segment rules
    const rules = await this.getSegmentRules(segmentId);
    
    // 2. Build query to find matching customers
    let query = this.supabase.from('customers').select('id');
    
    // Apply each rule to the query
    rules.forEach((rule, index) => {
      const { field, operator, value } = rule;
      
      switch (operator) {
        case 'equals':
          query = query.eq(field, value);
          break;
        case 'not_equals':
          query = query.neq(field, value);
          break;
        case 'contains':
          query = query.ilike(field, `%${value}%`);
          break;
        case 'greater_than':
          query = query.gt(field, value);
          break;
        case 'less_than':
          query = query.lt(field, value);
          break;
      }
    });
    
    // 3. Execute query to get matching customers
    const { data: matchingCustomers, error } = await query;
    if (error) throw error;
    
    // 4. Get current segment memberships
    const { data: currentMemberships } = await this.supabase
      .from('segment_memberships')
      .select('customer_id')
      .eq('segment_id', segmentId);
    
    const currentCustomerIds = new Set(currentMemberships.map(m => m.customer_id));
    const newCustomerIds = new Set(matchingCustomers.map(c => c.id));
    
    // 5. Determine customers to add and remove
    const customersToAdd = [...newCustomerIds].filter(id => !currentCustomerIds.has(id));
    const customersToRemove = [...currentCustomerIds].filter(id => !newCustomerIds.has(id));
    
    // 6. Add new memberships
    if (customersToAdd.length > 0) {
      const newMemberships = customersToAdd.map(customerId => ({
        segment_id: segmentId,
        customer_id: customerId
      }));
      
      await this.supabase.from('segment_memberships').insert(newMemberships);
    }
    
    // 7. Remove old memberships
    if (customersToRemove.length > 0) {
      await this.supabase
        .from('segment_memberships')
        .delete()
        .eq('segment_id', segmentId)
        .in('customer_id', customersToRemove);
    }
    
    return {
      added: customersToAdd.length,
      removed: customersToRemove.length,
      total: newCustomerIds.size
    };
  }
} 