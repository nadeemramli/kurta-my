import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Database } from '../../../packages/database/index.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient<Database>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get all segments
    const { data: segments, error: segmentsError } = await supabaseClient
      .from('customer_segments')
      .select('*')

    if (segmentsError) throw segmentsError

    // Process each segment
    for (const segment of segments) {
      // Clear existing memberships for this segment
      const { error: clearError } = await supabaseClient
        .from('customer_segment_memberships')
        .delete()
        .eq('segment_id', segment.id)

      if (clearError) throw clearError

      // Build query based on segment criteria
      let query = supabaseClient.from('customers').select('id')
      const { conditions, match_type } = segment.criteria

      const filterConditions = conditions.map((condition) => {
        const { field, operator, value } = condition
        
        switch (operator) {
          case 'equals':
            return `${field}.eq.${value}`
          case 'not_equals':
            return `${field}.neq.${value}`
          case 'greater_than':
            return `${field}.gt.${value}`
          case 'less_than':
            return `${field}.lt.${value}`
          case 'contains':
            return `${field}.ilike.%${value}%`
          case 'not_contains':
            return `${field}.not.ilike.%${value}%`
          case 'in':
            return `${field}.in.(${(value as any[]).join(',')})`
          case 'not_in':
            return `${field}.not.in.(${(value as any[]).join(',')})`
          default:
            return null
        }
      }).filter(Boolean)

      // Apply filters based on match type
      query = match_type === 'all'
        ? query.or(filterConditions.join(','))
        : query.or(filterConditions.join(','))

      const { data: customers, error: customersError } = await query

      if (customersError) throw customersError

      if (customers && customers.length > 0) {
        // Insert new memberships
        const memberships = customers.map((customer) => ({
          customer_id: customer.id,
          segment_id: segment.id,
        }))

        const { error: insertError } = await supabaseClient
          .from('customer_segment_memberships')
          .insert(memberships)

        if (insertError) throw insertError
      }
    }

    return new Response(
      JSON.stringify({ message: 'Segment memberships updated successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
}) 