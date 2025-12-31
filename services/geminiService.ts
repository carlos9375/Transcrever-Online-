
import { GoogleGenAI } from "@google/genai";

export const transcribeWithSynonyms = async (text: string): Promise<string> => {
  // Inicialização direta conforme diretrizes, assumindo que process.env.API_KEY está disponível
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: text }] }],
      config: {
        systemInstruction: "Você é um redator sênior. Sua tarefa é reescrever o texto do usuário utilizando sinônimos mais ricos e vocabulário elevado, mantendo rigorosamente o sentido original, o tom, a pontuação e a estrutura de parágrafos. Retorne APENAS o texto aprimorado, sem qualquer comentário adicional ou introdução.",
        temperature: 0.8,
        topP: 0.95,
      }
    });

    // Acessando a propriedade .text (getter) diretamente
    const resultText = response.text;
    
    if (!resultText) {
      throw new Error("Não foi possível gerar a transcrição.");
    }

    return resultText.trim();
  } catch (error: any) {
    console.error("Erro na API Gemini:", error);
    throw new Error("Falha ao processar a transcrição. Por favor, tente novamente em alguns instantes.");
  }
};
