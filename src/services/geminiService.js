// GeminiService - Complete AI integration for the application
import api from './apiService';

class GeminiService {
  constructor() {
    this.baseURL = '/api/gemini';
  }

  // Question Generation Services
  async generateQuestionsFromTopic(topic, count = 10, difficulty = 'MEDIUM') {
    try {
      const response = await api.post(`${this.baseURL}/generate-questions`, {
        topic,
        count,
        difficulty
      });
      return response.data;
    } catch (error) {
      console.error('Error generating questions from topic:', error);
      throw new Error(error.response?.data?.message || 'Failed to generate questions');
    }
  }

  async generateQuestionsFromText(text, count = 5, difficulty = 'MEDIUM') {
    try {
      const response = await api.post(`${this.baseURL}/generate-questions-from-text`, {
        text,
        count,
        difficulty
      });
      return response.data;
    } catch (error) {
      console.error('Error generating questions from text:', error);
      throw new Error(error.response?.data?.message || 'Failed to generate questions from text');
    }
  }

  async generateQuestionsFromSubject(subject, examType, count = 10, difficulty = 'MEDIUM') {
    try {
      const response = await api.post(`${this.baseURL}/generate-questions-by-subject`, {
        subject,
        examType,
        count,
        difficulty
      });
      return response.data;
    } catch (error) {
      console.error('Error generating questions by subject:', error);
      throw new Error(error.response?.data?.message || 'Failed to generate questions by subject');
    }
  }

  // Text Analysis Services
  async analyzeText(text, analysisType = 'COMPREHENSIVE') {
    try {
      const response = await api.post(`${this.baseURL}/analyze-text`, {
        text,
        analysisType // GRAMMAR, READABILITY, SENTIMENT, COMPREHENSIVE
      });
      return response.data;
    } catch (error) {
      console.error('Error analyzing text:', error);
      throw new Error(error.response?.data?.message || 'Failed to analyze text');
    }
  }

  async checkGrammar(text) {
    try {
      const response = await api.post(`${this.baseURL}/check-grammar`, {
        text
      });
      return response.data;
    } catch (error) {
      console.error('Error checking grammar:', error);
      throw new Error(error.response?.data?.message || 'Failed to check grammar');
    }
  }

  async analyzeSentiment(text) {
    try {
      const response = await api.post(`${this.baseURL}/analyze-sentiment`, {
        text
      });
      return response.data;
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      throw new Error(error.response?.data?.message || 'Failed to analyze sentiment');
    }
  }

  async getReadabilityScore(text) {
    try {
      const response = await api.post(`${this.baseURL}/readability-score`, {
        text
      });
      return response.data;
    } catch (error) {
      console.error('Error getting readability score:', error);
      throw new Error(error.response?.data?.message || 'Failed to get readability score');
    }
  }

  // Content Generation Services
  async generateStudyPlan(subject, examType, duration = 30, level = 'INTERMEDIATE') {
    try {
      const response = await api.post(`${this.baseURL}/generate-study-plan`, {
        subject,
        examType,
        duration, // in days
        level // BEGINNER, INTERMEDIATE, ADVANCED
      });
      return response.data;
    } catch (error) {
      console.error('Error generating study plan:', error);
      throw new Error(error.response?.data?.message || 'Failed to generate study plan');
    }
  }

  async generateTopicExplanation(topic, level = 'INTERMEDIATE', length = 'MEDIUM') {
    try {
      const response = await api.post(`${this.baseURL}/explain-topic`, {
        topic,
        level, // BEGINNER, INTERMEDIATE, ADVANCED
        length // SHORT, MEDIUM, DETAILED
      });
      return response.data;
    } catch (error) {
      console.error('Error generating topic explanation:', error);
      throw new Error(error.response?.data?.message || 'Failed to generate topic explanation');
    }
  }

  async generateQuestionExplanation(questionText, correctAnswer, options) {
    try {
      const response = await api.post(`${this.baseURL}/explain-question`, {
        questionText,
        correctAnswer,
        options
      });
      return response.data;
    } catch (error) {
      console.error('Error generating question explanation:', error);
      throw new Error(error.response?.data?.message || 'Failed to generate question explanation');
    }
  }

  // Content Summarization Services
  async summarizeText(text, summaryType = 'CONCISE', maxLength = 200) {
    try {
      const response = await api.post(`${this.baseURL}/summarize-text`, {
        text,
        summaryType, // CONCISE, DETAILED, BULLET_POINTS
        maxLength
      });
      return response.data;
    } catch (error) {
      console.error('Error summarizing text:', error);
      throw new Error(error.response?.data?.message || 'Failed to summarize text');
    }
  }

  async generateKeyPoints(text, count = 5) {
    try {
      const response = await api.post(`${this.baseURL}/extract-key-points`, {
        text,
        count
      });
      return response.data;
    } catch (error) {
      console.error('Error generating key points:', error);
      throw new Error(error.response?.data?.message || 'Failed to generate key points');
    }
  }

  async generateTags(text, maxTags = 10) {
    try {
      const response = await api.post(`${this.baseURL}/generate-tags`, {
        text,
        maxTags
      });
      return response.data;
    } catch (error) {
      console.error('Error generating tags:', error);
      throw new Error(error.response?.data?.message || 'Failed to generate tags');
    }
  }

  // Conversational AI
  async conversationalAI(message, context = null, conversationId = null) {
    try {
      const response = await api.post(`${this.baseURL}/conversational-ai`, {
        message,
        context,
        conversationId
      });
      return response.data;
    } catch (error) {
      console.error('Error in conversational AI:', error);
      throw new Error(error.response?.data?.message || 'Failed to process conversational AI request');
    }
  }

  // Utility Methods
  async getAICapabilities() {
    try {
      const response = await api.get(`${this.baseURL}/capabilities`);
      return response.data;
    } catch (error) {
      console.error('Error getting AI capabilities:', error);
      throw new Error(error.response?.data?.message || 'Failed to get AI capabilities');
    }
  }
}

// Create and export a singleton instance
export const geminiService = new GeminiService();
export default geminiService;
