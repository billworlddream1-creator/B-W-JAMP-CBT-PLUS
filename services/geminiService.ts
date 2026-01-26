
import { GoogleGenAI } from "@google/genai";
import { Question } from "../types";

export const getExplanation = async (question: Question): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    You are an expert Nigerian JAMB (Joint Admissions and Matriculation Board) tutor. 
    Explain this ${question.subject} question clearly and concisely to a student.
    
    Question: ${question.question}
    Options:
    A) ${question.options.A}
    B) ${question.options.B}
    C) ${question.options.C}
    D) ${question.options.D}
    
    Correct Answer: ${question.correctAnswer}
    
    Provide a step-by-step breakdown of why ${question.correctAnswer} is correct and why the other options are wrong. Keep the tone encouraging and academic.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Sorry, I couldn't generate an explanation at this time.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error connecting to AI tutor. Please check your connection.";
  }
};

export const chatWithTutor = async (
  message: string, 
  history: { role: 'user' | 'model', parts: { text: string }[] }[],
  context: { question: Question, subject: string }
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    You are "SabiTutor", an elite AI assistant for the B&W JAMB CBT PLUS platform. 
    Your goal is to help Nigerian students pass JAMB with scores above 300.
    
    Current Context:
    Subject: ${context.subject}
    Topic: ${context.question.topic || 'General'}
    Question being viewed: ${context.question.question}
    Correct Answer: ${context.question.correctAnswer}
    
    Rules:
    1. Be encouraging, professional, and use Nigerian academic context.
    2. Explain complex concepts using relatable Nigerian examples where possible.
    3. Keep answers concise but thorough.
    4. If the student asks something unrelated to JAMB or their studies, politely redirect them back to their mission.
  `;

  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction,
      },
      history: history.length > 0 ? history : undefined
    });

    const response = await chat.sendMessage({ message });
    return response.text || "I'm processing that. One moment...";
  } catch (error) {
    console.error("Chat Error:", error);
    return "I hit a snag connecting to the brain center. Please try again in a second.";
  }
};
