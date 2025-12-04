import { GoogleGenAI } from "@google/genai";
import { Hotel, LocationType } from "../types";

// Initialize the API client. 
// Note: In a real production app, you might proxy this through a backend to hide the key, 
// or require the user to input their own key if it's a client-side tool.

// Safe access to process.env to prevent "process is not defined" errors in some browser environments
const getApiKey = () => {
  try {
    return typeof process !== 'undefined' ? process.env.API_KEY : '';
  } catch {
    return '';
  }
};

const apiKey = getApiKey() || '';

// We won't throw immediately to allow the UI to render, but requests will fail if empty.
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getTravelAdvice = async (location: LocationType): Promise<string> => {
  if (!ai) return "请配置 API KEY 以使用 AI 助手功能。";

  try {
    const prompt = `作为一个资深的东北旅游专家，请为游客介绍一下【${location}】的冬季旅游特色。
    请包含以下内容：
    1. 必去的一个核心景点。
    2. 当地的特色美食推荐（2-3种）。
    3. 冬季穿衣建议。
    请保持回答在200字以内，语气热情幽默。`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "AI 暂时无法回应，请稍后再试。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "获取 AI 建议时出现错误，请检查网络或 API Key。";
  }
};

export const getHotelReviewSummary = async (hotel: Hotel): Promise<string> => {
  if (!ai) return "请配置 API KEY 以使用 AI 助手功能。";

  try {
    const prompt = `请根据这家酒店的信息生成一段简短的推荐语（100字以内）：
    名称：${hotel.name}
    位置：${hotel.location}
    星级：${hotel.stars}星
    特点：${hotel.tags.join(', ')}
    描述：${hotel.description}
    
    重点突出它的适合人群和最大卖点。`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "暂无推荐语。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "获取推荐语失败。";
  }
};