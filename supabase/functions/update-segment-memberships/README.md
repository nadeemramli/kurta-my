# Update Segment Memberships Edge Function

This edge function updates segment memberships based on segment rules. It uses the shared database package to handle the core logic.

## Overview

The function:
1. Receives a segment ID in the request body
2. Retrieves segment rules from the database
3. Finds customers that match the rules
4. Updates segment memberships accordingly (adding and removing customers as needed)
5. Returns statistics about the update operation

## Usage

### Request

```http
POST /functions/v1/update-segment-memberships
Content-Type: application/json
Authorization: Bearer <supabase-anon-key>

{
  "segmentId": "123e4567-e89b-12d3-a456-426614174000"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "added": 5,
    "removed": 2,
    "total": 10
  },
  "requestId": "123e4567-e89b-12d3-a456-426614174000"
}
```

## Development

To run the function locally:

```bash
cd supabase/functions/update-segment-memberships
deno task dev
```

## Deployment

To deploy the function:

```bash
cd supabase/functions/update-segment-memberships
deno task deploy
```

## Dependencies

This function depends on the shared database package, which provides:
- Segment service for database operations
- Edge function handlers
- Type definitions

The import map in `import_map.json` is used to resolve these dependencies. 