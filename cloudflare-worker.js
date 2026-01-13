/**
 * Cloudflare Worker Proxy for Gemini API
 * This worker hides the API key from the client-side code
 */

export default {
  async fetch(request, env) {
    // CORS headers for GitHub Pages
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405,
        headers: corsHeaders
      });
    }

    try {
      // Get API key from environment secret
      const apiKey = env.GEMINI_API_KEY;
      if (!apiKey) {
        return new Response(
          JSON.stringify({ error: 'API key not configured' }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Parse the request body
      const body = await request.json();
      const { message, history, systemInstruction } = body;

      if (!message) {
        return new Response(
          JSON.stringify({ error: 'Message is required' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Build Gemini API request payload
      const geminiPayload = {
        contents: [
          ...(history || []),
          {
            role: 'user',
            parts: [{ text: message }],
          },
        ],
      };

      // Add system instruction if provided
      if (systemInstruction) {
        geminiPayload.systemInstruction = {
          parts: [{ text: systemInstruction }],
        };
      }

      // Forward to Gemini API
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      
      const geminiResponse = await fetch(geminiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(geminiPayload),
      });

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        console.error('Gemini API error:', errorText);
        return new Response(
          JSON.stringify({ error: 'Gemini API error', details: errorText }),
          { 
            status: geminiResponse.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      const geminiData = await geminiResponse.json();
      
      // Extract the response text
      const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';

      return new Response(
        JSON.stringify({ text: responseText }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error', message: error.message }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
  },
};
