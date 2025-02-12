addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
  })
  
  async function handleRequest(request) {
    // Retrieve the API key from Cloudflare Workers Secrets
    const API_KEY = await BOT_API_KEY
  
    // Validate the origin of the request
    if (request.headers.get("Origin") !== "https://yourusername.github.io") {
      return new Response("Unauthorized", { status: 403 })
    }
  
    // Parse the incoming request
    const { message } = await request.json()
  
    // Here you would typically call your chatbot API
    // For this example, we'll just echo the message
    const botReply = `You said: ${message}`
  
    // Return the response
    return new Response(JSON.stringify({ reply: botReply }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }
  