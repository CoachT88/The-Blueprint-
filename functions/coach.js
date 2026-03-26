export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    // 1. Get the data sent from your index.html
    const { userMsg, systemPrompt } = await request.json();

    // 2. Access the Secret Key from Cloudflare Settings
    const API_KEY = env.CLAUDE_API_KEY;

    // 3. Forward the request to Anthropic
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: "user", content: userMsg }]
      }),
    });

    const data = await response.json();
    
    // 4. Return Claude's answer back to your app
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
