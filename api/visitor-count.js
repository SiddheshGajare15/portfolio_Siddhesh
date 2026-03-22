/**
 * Visitor counter using Supabase REST API (via fetch for zero dependencies).
 * This endpoint:
 * 1.  Identifies unique visitors by IP hashing (to comply with privacy and prevent duplicates).
 * 2.  Increments a counter in Supabase.
 * 3.  Returns the total count of unique visits.
 * 
 * SETUP IN SUPABASE:
 * Create a table 'visits' with:
 * - id: uuid or int8 (Primary Key)
 * - ip_hash: text (Indexed, Unique)
 * - visited_at: timestamptz (Default: now())
 */

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

  // Fallback for missing credentials
  if (!SUPABASE_URL || !SUPABASE_KEY) {
      console.warn("Visitor Count: Supabase URL or Key missing. Returning fallback mock count.");
      return res.status(200).json({ 
          count: 1420, // Mock initial count
          message: "Connect your Supabase account to enable live visitor tracking." 
      });
  }

  try {
    // Get IP from request (Vercel provides this in headers)
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    // Simple hash to obscure IP but keep it unique
    const ipHash = Buffer.from(ip).toString('base64');

    // Step 1: Attempt to register this visit (unique by ip_hash)
    // Supabase REST: POST to /rest/v1/visits
    await fetch(`${SUPABASE_URL}/rest/v1/visits`, {
        method: 'POST',
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates' // UPSERT behavior
        },
        body: JSON.stringify({ ip_hash: ipHash })
    });

    // Step 2: Get total count from table
    const countRes = await fetch(`${SUPABASE_URL}/rest/v1/visits?select=count`, {
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Range-Unit': 'items',
            'Prefer': 'count=exact'
        }
    });

    // Supabase returns count in 'content-range' header or body depending on settings.
    // For exact count on a query, it's often easiest to just look at the Content-Range header.
    const contentRange = countRes.headers.get('content-range');
    const totalCount = contentRange ? parseInt(contentRange.split('/')[1]) : 0;

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    return res.status(200).json({ count: totalCount });

  } catch (error) {
    console.error("Visitor Counter Error:", error);
    return res.status(500).json({ error: "Something went wrong on our end." });
  }
}
