export interface AICourseStructure {
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  prerequisites: string[];
  learningObjectives: string[];
  modules: AICourseModule[];
}

export interface AICourseModule {
  title: string;
  description: string;
  concepts: string[];
  flashcards: Array<{ front: string; back: string; difficulty: 'easy' | 'medium' | 'hard' }>;
  quizQuestions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }>;
}

export interface QueryAnalysis {
  intent: 'learn' | 'review' | 'test' | 'explore';
  subject: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  focus: string[];
  context: string;
}

import { chat } from '@/services/aiClient';
import * as fallback from '@/services/fallback';

class AICourseAgent {
  private async tryAIorFallback<T>(
    fn: () => Promise<T>,
    fallbackFn: () => T
  ): Promise<T> {
    try {
      // Check if AI key is available
      const key = localStorage.getItem('AI_API_KEY') || localStorage.getItem('OPENAI_API_KEY');
      if (!key) return fallbackFn();

      return await fn();
    } catch (error) {
      console.log('AI error, using fallback:', error);
      return fallbackFn();
    }
  }

  private validateCourseStructure(course: any): course is AICourseStructure {
    return (
      course &&
      typeof course.title === 'string' &&
      Array.isArray(course.modules) &&
      course.modules.length > 0 &&
      course.modules.every(module =>
        Array.isArray(module.flashcards) &&
        Array.isArray(module.quizQuestions)
      )
    );
  }

  private analyzeQuery(query: string): QueryAnalysis {
    const lowerQuery = query.toLowerCase();
    
    // Intent detection
    let intent: QueryAnalysis['intent'] = 'learn';
    if (lowerQuery.includes('review') || lowerQuery.includes('refresh')) intent = 'review';
    if (lowerQuery.includes('test') || lowerQuery.includes('quiz') || lowerQuery.includes('exam')) intent = 'test';
    if (lowerQuery.includes('explore') || lowerQuery.includes('discover')) intent = 'explore';
    
    // Level detection
    let level: QueryAnalysis['level'] = 'beginner';
    if (lowerQuery.includes('advanced') || lowerQuery.includes('expert') || lowerQuery.includes('professional')) level = 'advanced';
    else if (lowerQuery.includes('intermediate') || lowerQuery.includes('intermediate') || lowerQuery.includes('intermediate')) level = 'intermediate';
    
    // Subject extraction
    const subjects = this.extractSubject(query);
    
    // Focus areas
    const focus = this.extractFocusAreas(query);
    
    return {
      intent,
      subject: subjects[0] || 'General Topic',
      level,
      focus,
      context: query
    };
  }
  
  private extractSubject(query: string): string[] {
    const subjects = [
      'programming', 'javascript', 'python', 'react', 'typescript', 'node.js', 'web development',
      'mathematics', 'calculus', 'algebra', 'geometry', 'statistics',
      'science', 'physics', 'chemistry', 'biology', 'astronomy',
      'history', 'world war', 'ancient', 'medieval', 'modern',
      'language', 'english', 'spanish', 'french', 'german', 'chinese',
      'business', 'marketing', 'finance', 'economics', 'management',
      'art', 'music', 'literature', 'philosophy', 'psychology'
    ];
    
    return subjects.filter(subject => 
      query.toLowerCase().includes(subject.toLowerCase())
    );
  }
  
  private extractFocusAreas(query: string): string[] {
    const focusKeywords = [
      'basics', 'fundamentals', 'principles', 'concepts', 'theory',
      'practical', 'hands-on', 'applications', 'real-world', 'examples',
      'advanced', 'complex', 'detailed', 'comprehensive', 'complete',
      'quick', 'fast', 'overview', 'summary', 'essentials'
    ];
    
    return focusKeywords.filter(keyword => 
      query.toLowerCase().includes(keyword.toLowerCase())
    );
  }
  
  async generateContent(query: string) {
    return this.tryAIorFallback(
      async () => {
        // Real AI call using aiClient
        const messages = [
          {
            role: 'system',
            content: `You are an educational content creator. Generate concise, accurate flashcards and quiz questions about the given topic.
            Return a JSON object with two arrays: "flashcards" (each with "front" and "back") and "quizQuestions" (each with "question", "options" array, "correctAnswer" index, and "explanation").`
          },
          {
            role: 'user',
            content: `Create educational content about: ${query}`
          }
        ];

        const response = await chat(messages);

        // Validate the response has the expected structure
        if (response && Array.isArray(response.flashcards) && Array.isArray(response.quizQuestions)) {
          return response;
        }

        throw new Error('Invalid response structure');
      },
      () => fallback.generateQuickContent(query)
    );
  }
  
  async generateCourse(query: string): Promise<AICourseStructure> {
    return this.tryAIorFallback(
      async () => {
        const analysis = this.analyzeQuery(query);

        // Real AI call using aiClient
        const messages = [
          {
            role: 'system',
            content: `You are an educational course creator. Design a comprehensive course about the topic.
            Return a JSON object following this structure:
            {
              "title": "Course Title",
              "description": "Comprehensive description",
              "difficulty": "beginner|intermediate|advanced",
              "estimatedTime": "X hours",
              "prerequisites": ["prerequisite 1", "prerequisite 2"],
              "learningObjectives": ["objective 1", "objective 2"],
              "modules": [
                {
                  "title": "Module Title",
                  "description": "Module description",
                  "concepts": ["concept 1", "concept 2"],
                  "flashcards": [{"front": "question", "back": "answer", "difficulty": "easy|medium|hard"}],
                  "quizQuestions": [{"question": "quiz question", "options": ["option 1", "option 2", "option 3", "option 4"], "correctAnswer": 0, "explanation": "why this answer", "difficulty": "easy|medium|hard"}]
                }
              ]
            }`
          },
          {
            role: 'user',
            content: `Create a ${analysis.level} level course about: ${query}`
          }
        ];

        const response = await chat(messages);

        // Validate the response has the expected structure
        if (this.validateCourseStructure(response)) {
          return response;
        }

        throw new Error('Invalid course structure in response');
      },
      () => fallback.generateCourseStructure(query)
    );
  }
  
  async generateLanguageContent(language: string, level: string) {
    return this.tryAIorFallback(
      async () => {
        // Real AI call using aiClient
        const messages = [
          {
            role: 'system',
            content: `You are a language learning expert. Create flashcards for learning ${language} at ${level} level.
            Return a JSON array of objects, each with "front" (in English) and "back" (in ${language}) properties.`
          },
          {
            role: 'user',
            content: `Generate ${level} level vocabulary and phrases for learning ${language}.`
          }
        ];

        const response = await chat(messages);

        // Validate the response structure
        if (response && Array.isArray(response)) {
          return response;
        }

        throw new Error('Invalid language content structure');
      },
      () => fallback.generateLanguageContent(language, level)
    );
  }
}

export const aiAgent = new AICourseAgent();
