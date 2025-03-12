import { SegmentService } from '../services';
import { EdgeFunctionContext } from '../types';

/**
 * Handler for the update-segment-memberships edge function
 * This extracts the core logic that would otherwise be duplicated
 */
export async function handleUpdateSegmentMemberships(
  segmentId: string,
  supabaseUrl: string,
  supabaseKey: string,
  context: EdgeFunctionContext
) {
  try {
    // Create segment service
    const segmentService = new SegmentService(supabaseUrl, supabaseKey);
    
    // Update segment memberships
    const result = await segmentService.updateSegmentMemberships(segmentId);
    
    // Return success response
    return {
      statusCode: 200,
      body: {
        success: true,
        data: result,
        requestId: context.requestId
      }
    };
  } catch (error) {
    // Return error response
    return {
      statusCode: 500,
      body: {
        success: false,
        error: error.message,
        requestId: context.requestId
      }
    };
  }
} 