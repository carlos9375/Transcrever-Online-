
import { GoogleGenAI } from "@google/genai";

export const transcribeWithSynonyms = async (text: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `Aja como um especialista em linguística e redator profissional. 
  Sua tarefa é reescrever o texto fornecido pelo usuário, substituindo palavras e expressões comuns por sinônimos mais ricos e variados, melhorando a fluidez e o vocabulário, mas mantendo estritamente o sentido original e o tom. 
  
  Regras:
  1. Forneça apenas o texto reescrito.
  2. Não adicione comentários, explicações ou notas.
  3. Mantenha a formatação original (parágrafos, pontuação).
  
  Texto para transformar:
  "${text}"`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      }
    });

    return response.text || "Não foi possível gerar a transcrição no momento.";
  } catch (error) {
    console.error("Erro na API Gemini:", error);
    throw new Error("Falha ao processar o texto. Verifique sua conexão ou tente novamente mais tarde.");
  }
};
