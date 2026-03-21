import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export const getGeminiModel = (instruction = "") => {
  return genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: instruction || "You are an expert AI Assistant."
  });
};

export const isApiKeySet = () => {
  return API_KEY && API_KEY !== "YOUR_GEMINI_API_KEY_HERE";
};
