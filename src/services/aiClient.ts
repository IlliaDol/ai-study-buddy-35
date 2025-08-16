// AI Client service for making calls to AI providers with error handling and timeouts
type AIProvider = 'deepseek' | 'openai';
type AIModel = 'deepseek-reasoner' | 'gpt-4o-mini' | string;
type AIMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type AIError =
  | { type: 'INVALID_KEY'; message: string }
  | { type: 'TIMEOUT'; message: string }
  | { type: 'NETWORK'; message: string }
  | { type: 'SERVER'; message: string; status?: number }
  | { type: 'PARSING'; message: string };

interface ChatOptions {
  provider?: AIProvider;
  model?: AIModel;
  timeoutMs?: number;
}

// Extract JSON from an AI response that might contain mixed content
const extractJsonFromText = (text: string): any => {
  // Try to find JSON blocks in the text
  const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
  if (jsonMatch && jsonMatch[1]) {
    try {
      return JSON.parse(jsonMatch[1]);
    } catch (e) {
      // Continue to next attempt if this parse fails
    }
  }

  // If no JSON blocks, try to parse the entire text as JSON
  try {
    return JSON.parse(text);
  } catch (e) {
    // If all parsing fails, throw an error
    throw { type: 'PARSING', message: 'Failed to parse JSON from response' };
  }
};

// Main function to chat with AI providers
export async function chat(
  messages: AIMessage[],
  options: ChatOptions = {}
): Promise<any> {
  const {
    provider = localStorage.getItem('AI_PROVIDER') as AIProvider || 'deepseek',
    model = provider === 'deepseek' ? 'deepseek-reasoner' : 'gpt-4o-mini',
    timeoutMs = 20000
  } = options;

  // Get API key from localStorage
  const apiKey = localStorage.getItem('AI_API_KEY') || localStorage.getItem('OPENAI_API_KEY') || '';

  if (!apiKey) {
    throw { type: 'INVALID_KEY', message: 'No API key provided' };
  }

  // Use proxy if configured
  const useProxy = !!(window as any).__USE_PROXY__;
  const baseUrl = useProxy
    ? '/api/ai'
    : provider === 'deepseek'
      ? 'https://api.deepseek.com/chat/completions'
      : 'https://api.openai.com/v1/chat/completions';

  // Create an AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // Prepare request body
    const requestBody = {
      model,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages,
    };

    // Make the API request
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        ...(useProxy ? { 'X-Provider': provider } : {})
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    // Clear the timeout
    clearTimeout(timeoutId);

    // Handle error responses
    if (!response.ok) {
      if (response.status === 401) {
        throw { type: 'INVALID_KEY', message: 'Invalid API key' };
      } else {
        throw {
          type: 'SERVER',
          message: `Server error: ${response.statusText}`,
          status: response.status
        };
      }
    }

    // Parse the response
    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;

    if (!text) {
      throw { type: 'SERVER', message: 'Empty response from API' };
    }

    // Try to extract JSON from the response
    try {
      return extractJsonFromText(text);
    } catch (error) {
      // If it's a parsing error but we have text, return the raw text
      if (text) {
        return { content: text };
      }
      throw error;
    }
  } catch (error) {
    // Clear the timeout
    clearTimeout(timeoutId);

    // Handle known errors
    if (error.name === 'AbortError') {
      throw { type: 'TIMEOUT', message: 'Request timed out' };
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes('network')) {
      throw { type: 'NETWORK', message: 'Network error' };
    }

    // If it's one of our typed errors, rethrow it
    if (error.type) {
      throw error;
    }

    // For any other errors
    throw { type: 'SERVER', message: error.message || 'Unknown error' };
  }
}
