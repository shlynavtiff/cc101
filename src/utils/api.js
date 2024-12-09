import axios from 'axios';

const apiBase = "https://api.openai.com/v1/chat/completions";
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

export const openaiApi = axios.create({
  baseURL: apiBase,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  }
});

