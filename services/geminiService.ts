
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
