// Service to communicate with our backend AI endpoint
const API_URL = '/api/ai-explain';

export const callAiBackend = async (input, mode = 'explain') => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input, mode }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch AI response');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('AI Service Error:', error);
    throw error;
  }
};

export const isApiKeySet = () => {
  // Now we check if the backend is configured, but from frontend we just return true
  // since the key is now in the backend's .env
  return true;
};
