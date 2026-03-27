export async function onRequestPost(context) {
const corsHeaders = {
“Access-Control-Allow-Origin”: “*”,
“Access-Control-Allow-Methods”: “POST, OPTIONS”,
“Access-Control-Allow-Headers”: “Content-Type”,
“Content-Type”: “application/json”
};

```
try {
    const body = await context.request.json();
    const userMsg = body.userMsg;
    const systemPrompt = body.systemPrompt;

    if (!userMsg) {
        return new Response(JSON.stringify({ error: "No message provided" }), { status: 400, headers: corsHeaders });
    }

    const apiKey = context.env.CLAUDE_API_KEY;
    if (!apiKey) {
        return new Response(JSON.stringify({ error: "Service unavailable" }), { status: 500, headers: corsHeaders });
    }

    const claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            system: systemPrompt || "You are CoachTee. You know PE protocols, pelvic health, and male performance inside out. Talk like a knowledgeable friend. Keep it relaxed, direct, and real. No markdown, no bullet points. 2-4 sentences unless they really need more.",
            messages: [{ role: "user", content: userMsg }]
        })
    });

    const data = await claudeResponse.json();

    if (!claudeResponse.ok) {
        return new Response(JSON.stringify({ error: data.error ? data.error.message : "Claude error" }), { status: claudeResponse.status, headers: corsHeaders });
    }

    let text = "";
    if (data.content && data.content.length > 0) {
        for (const block of data.content) {
            if (block.type === "text") {
                text += block.text;
            }
        }
    }

    return new Response(JSON.stringify({ text: text }), { status: 200, headers: corsHeaders });

} catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
}
```

}

export async function onRequestOptions() {
return new Response(null, {
headers: {
“Access-Control-Allow-Origin”: “*”,
“Access-Control-Allow-Methods”: “POST, OPTIONS”,
“Access-Control-Allow-Headers”: “Content-Type”
}
});
}
