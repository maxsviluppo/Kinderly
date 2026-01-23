
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getManagementAdvice = async (problem: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: problem,
      config: {
        systemInstruction: "Agisci come un esperto consulente amministrativo e pedagogico per scuole dell'infanzia paritarie in Italia. Analizza il seguente problema e fornisci suggerimenti pratici, normativi (MIUR/USR) e gestionali. Sii conciso e strutturato in punti.",
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Errore di connessione al consulente AI.";
  }
};

export const generateSmartSchedule = async (staffData: any, schoolHours: any) => {
  try {
    const prompt = `Genera un orario settimanale per questi docenti: ${JSON.stringify(staffData)}. Orario scuola: ${schoolHours.opening}-${schoolHours.closing}. 
    Assicurati che ogni classe abbia almeno un docente presente. Rispetta il monte ore settimanale di ciascuno. 
    Formatta l'output come un elenco strutturato per giorno e docente.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: "Sei un esperto di logistica scolastica. Crea orari ottimizzati che minimizzino i buchi e garantiscano la continuità didattica.",
        temperature: 0.4,
      },
    });
    return response.text;
  } catch (error) {
    console.error("AI Scheduling error:", error);
    return "Impossibile generare l'orario al momento.";
  }
};

export const suggestPedagogicalAction = async (behavior: string, age: string) => {
  try {
    const prompt = `Un bambino di ${age} anni ha manifestato questo comportamento: "${behavior}". 
    Suggerisci una "conseguenza riparatoria" educativa (non una punizione fine a se stessa) adatta alla scuola dell'infanzia. 
    Spiega brevemente il valore pedagogico dell'azione scelta.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "Sei un pedagogista esperto nel metodo Montessori e Reggio Children. Fornisci consigli per trasformare i conflitti in opportunità di crescita.",
        temperature: 0.6,
      },
    });
    return response.text;
  } catch (error) {
    console.error("AI Pedagogy error:", error);
    return "Consulenza non disponibile.";
  }
};

export const generateDisciplinaryLetter = async (studentName: string, description: string, consequence: string) => {
  try {
    const prompt = `Scrivi una bozza di lettera ufficiale per i genitori dell'alunno ${studentName}. 
    L'episodio accaduto è: "${description}". 
    Il provvedimento preso è: "${consequence}". 
    Usa un tono professionale, empatico e orientato alla collaborazione scuola-famiglia. 
    Includi spazi per la data e la firma della direzione.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "Sei la segreteria amministrativa di una scuola dell'infanzia d'eccellenza. Scrivi comunicazioni formali perfette.",
        temperature: 0.5,
      },
    });
    return response.text;
  } catch (error) {
    console.error("AI Letter error:", error);
    return "Errore nella generazione della lettera.";
  }
};
