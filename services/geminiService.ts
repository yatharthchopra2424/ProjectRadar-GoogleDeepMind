import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Retry configuration
const RETRY_DELAYS = [5000, 10000, 15000]; // 5s, 10s, 15s

// Helper function for retrying API calls with exponential backoff
const withRetry = async <T>(
  fn: () => Promise<T>,
  onRetry?: (attempt: number, delay: number) => void
): Promise<T> => {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < RETRY_DELAYS.length) {
        const delay = RETRY_DELAYS[attempt];
        console.log(`API call failed, retrying in ${delay / 1000}s... (attempt ${attempt + 1}/${RETRY_DELAYS.length})`);
        onRetry?.(attempt + 1, delay);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
};

// Helper to convert File to Base64
export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Module 1 & 4: Analyze Report / Provide Feedback
export const analyzeReport = async (
  files: File[], 
  prompt: string, 
  systemInstruction: string,
  modelId: string = 'gemini-2.5-flash',
  onRetry?: (attempt: number, delay: number) => void
): Promise<string> => {
  const parts = await Promise.all(files.map(fileToGenerativePart));
  
  return withRetry(async () => {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelId,
      contents: {
        role: 'user',
        parts: [...parts, { text: prompt }]
      },
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.4,
      }
    });

    if (!response.text) {
      throw new Error("No analysis generated.");
    }
    
    return response.text;
  }, onRetry);
};

// Module 2: Faculty Recall (Comparison)
export const compareReports = async (
  oldFile: File, 
  newFile: File, 
  systemInstruction: string,
  onRetry?: (attempt: number, delay: number) => void
): Promise<string> => {
  const oldPart = await fileToGenerativePart(oldFile);
  const newPart = await fileToGenerativePart(newFile);

  const prompt = `
  Compare these two documents. 
  Document 1 is the PREVIOUS MONTH report. 
  Document 2 is the CURRENT MONTH report.
  Perform the Faculty Recall analysis.
  `;

  return withRetry(async () => {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // High context window for multiple docs
      contents: {
        role: 'user',
        parts: [oldPart, { text: " [END OF PREVIOUS REPORT] " }, newPart, { text: prompt }]
      },
      config: {
        systemInstruction: systemInstruction,
      }
    });

    if (!response.text) {
      throw new Error("No comparison generated.");
    }
    
    return response.text;
  }, onRetry);
};

// Module 3: Project Search (simulated DB search via context)
export const searchProjectsAI = async (query: string, projectData: string): Promise<string> => {
  try {
    const prompt = `
    You are an intelligent database interface.
    Here is the current project database in JSON format:
    ${projectData}

    The user is searching for: "${query}"

    Return a list of matching projects with a brief summary for each.
    Also suggest 2-3 faculty members who might be experts in these domains.
    Format as Markdown.
    If no matches, suggest related topics.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { role: 'user', parts: [{ text: prompt }] },
    });

    return response.text || "No results found.";
  } catch (error) {
    console.error("Search Error:", error);
    return `Error: ${(error as Error).message}`;
  }
};

// Module: Creative Studio (Image Editing)
export const editImage = async (imageFile: File, prompt: string): Promise<string> => {
  try {
    const imagePart = await fileToGenerativePart(imageFile);

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [imagePart, { text: prompt }]
      },
    });

    // Extract image from response
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
        for (const part of candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
    }
    
    // Fallback if no image but text is returned (sometimes happens on error or specific prompts)
    if (response.text) {
        throw new Error(`Model returned text instead of image: ${response.text}`);
    }

    throw new Error("No image generated.");
  } catch (error) {
    console.error("Image Edit Error:", error);
    throw error;
  }
};
