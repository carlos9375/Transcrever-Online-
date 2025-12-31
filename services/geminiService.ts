
import { GoogleGenAI } from "@google/genai";

export const transcribeWithSynonyms = async (text: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.error("API_KEY não encontrada no ambiente.");
    throw new Error("Configuração da API pendente.");
  }

  // Inicialização obrigatória usando named parameter apiKey
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    // Para solicitações simples de texto, passamos o prompt diretamente em contents
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: text,
      config: {
        systemInstruction: "Aja como um redator profissional. Sua tarefa é reescrever o texto do usuário utilizando sinônimos mais sofisticados e variados, mantendo o sentido original, a pontuação e os parágrafos. Retorne APENAS o texto aprimorado, sem introduções ou explicações.",
        temperature: 0.7,
        topP: 0.95,
      }
    });

    // Acessando a propriedade .text (getter) diretamente conforme diretrizes
    const resultText = response.text;
    
    if (!resultText) {
      throw new Error("A IA não gerou conteúdo.");
    }

    return resultText.trim();
  } catch (error: any) {
    console.error("Erro na transcrição:", error);
    
    if (error.status === 403 || error.status === 401) {
      throw new Error("Erro de autorização. Verifique sua chave de API.");
    }
    
    throw new Error("Falha ao processar o texto. Verifique sua conexão ou tente novamente mais tarde.");
  }
};
