
import { GoogleGenAI } from "@google/genai";

const apiKey = (typeof process !== 'undefined' && process.env ? process.env.GEMINI_API_KEY : '') || import.meta.env.VITE_GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey: apiKey as string });

export const getManagementAdvice = async (problem: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: { role: 'user', parts: [{ text: problem }] },
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

export const generateSmartSchedule = async (staffData: any, schoolHours: any, classesData?: any) => {
  try {
    let prompt = `Genera un orario settimanale ottimizzato. Orario scuola: ${schoolHours.opening}-${schoolHours.closing}.\n\n`;

    prompt += `**DOCENTI & DISPONIBILITÀ:**\n${JSON.stringify(staffData, null, 2)}\n\n`;

    if (classesData) {
      prompt += `**CONFIGURAZIONE CLASSI & TEAM DOCENTI:**\n${JSON.stringify(classesData, null, 2)}\n\n`;
      prompt += `**REQUSITI:**\n`;
      prompt += `1. Rispetta rigorosamente le assegnazioni di classe per ogni docente (Ruolo, Materia, Ore).\n`;
      prompt += `2. Gestisci le rotazioni se indicate.\n`;
      prompt += `3. Assicura che ogni classe abbia sempre copertura (Prevalente o Sostegno/Altri).\n`;
      prompt += `4. Ottimizza le compresenze dove utile (es. Sostegno).\n`;
    } else {
      prompt += `Assicurati che ogni classe abbia almeno un docente presente. Rispetta il monte ore settimanale di ciascuno.\n`;
    }

    prompt += `Formatta l'output come un report dettagliato: "Planning Settimanale per Sezione" e "Planning Individuale Docenti".`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: { role: 'user', parts: [{ text: prompt }] },
      config: {
        systemInstruction: "Sei un esperto di logistica scolastica e timetable management. Crea orari realistici, completi e ben formattati.",
        temperature: 0.4,
      },
    });
    return response.text;
  } catch (error) {
    console.error("AI Scheduling error:", error);
    return "Impossibile generare l'orario al momento. Riprova più tardi.";
  }
};

export const suggestPedagogicalAction = async (behavior: string, age: string) => {
  try {
    const prompt = `Un bambino di ${age} anni ha manifestato questo comportamento: "${behavior}". 
    Suggerisci una "conseguenza riparatoria" educativa (non una punizione fine a se stessa) adatta alla scuola dell'infanzia. 
    Spiega brevemente il valore pedagogico dell'azione scelta.`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: { role: 'user', parts: [{ text: prompt }] },
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
      model: "gemini-1.5-flash",
      contents: { role: 'user', parts: [{ text: prompt }] },
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
