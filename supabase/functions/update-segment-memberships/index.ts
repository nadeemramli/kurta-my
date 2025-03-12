// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.land/manual/examples/deploy_node_app

// Import from our shared database package using the import map
import { handleUpdateSegmentMemberships } from 'database/edge-functions/segment-membership.ts';
import { EdgeFunctionContext } from 'database/types/index.ts';

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-user-id, x-user-role',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

// Handle requests
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Method not allowed' 
      }),
      { headers: { ...corsHeaders }, status: 405 }
    );
  }

  try {
    // Get segment ID from request
    const { segmentId } = await req.json();
    
    if (!segmentId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Segment ID is required' 
        }),
        { headers: { ...corsHeaders }, status: 400 }
      );
    }
    
    // Get Supabase credentials from environment
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing Supabase credentials' 
        }),
        { headers: { ...corsHeaders }, status: 500 }
      );
    }
    
    // Create context for the edge function
    const context: EdgeFunctionContext = {
      auth: {
        userId: req.headers.get('x-user-id') || undefined,
        role: req.headers.get('x-user-role') || undefined,
      },
      requestId: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    
    // Use the shared handler from our database package
    const result = await handleUpdateSegmentMemberships(
      segmentId,
      supabaseUrl,
      supabaseKey,
      context
    );
    
    // Return the response
    return new Response(
      JSON.stringify(result.body),
      { 
        headers: { ...corsHeaders },
        status: result.statusCode
      }
    );
  } catch (error) {
    console.error('Error in update-segment-memberships function:', error);
    
    // Handle any unexpected errors
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'An unexpected error occurred',
        requestId: crypto.randomUUID()
      }),
      { headers: { ...corsHeaders }, status: 500 }
    );
  }
}); 