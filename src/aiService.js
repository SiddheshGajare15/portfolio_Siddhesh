import { GoogleGenerativeAI } from "@google/generative-ai";

// Use a live getter to ensure we always have the freshest value from import.meta.env
const getApiKey = () => import.meta.env.VITE_GEMINI_API_KEY || "";

export const getGeminiModel = (instruction = "") => {
  const key = getApiKey();
  const genAI = new GoogleGenerativeAI(key);
  return genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: instruction || "You are an expert AI Assistant."
  });
};

export const isApiKeySet = () => {
  const key = getApiKey();
  return key && key !== "YOUR_GEMINI_API_KEY_HERE" && key !== "";
};
