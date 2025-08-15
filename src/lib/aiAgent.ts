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

class AICourseAgent {
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
  
  private generateCourseStructure(analysis: QueryAnalysis): AICourseStructure {
    const { subject, level, focus, intent } = analysis;
    
    // Generate comprehensive course structure based on analysis
    const modules = this.generateModules(analysis);
    
    return {
      title: this.generateCourseTitle(analysis),
      description: this.generateCourseDescription(analysis),
      difficulty: level,
      estimatedTime: this.estimateTime(modules.length, level),
      prerequisites: this.generatePrerequisites(analysis),
      learningObjectives: this.generateLearningObjectives(analysis),
      modules
    };
  }
  
  private generateCourseTitle(analysis: QueryAnalysis): string {
    const { subject, level, intent } = analysis;
    const levelText = level === 'beginner' ? 'Fundamentals' : 
                     level === 'intermediate' ? 'Intermediate' : 'Advanced';
    
    if (intent === 'review') return `${subject} Review Course`;
    if (intent === 'test') return `${subject} Test Preparation`;
    if (intent === 'explore') return `Exploring ${subject}`;
    
    return `${subject} ${levelText} Course`;
  }
  
  private generateCourseDescription(analysis: QueryAnalysis): string {
    const { subject, level, focus } = analysis;
    const focusText = focus.length > 0 ? ` with focus on ${focus.join(', ')}` : '';
    
    return `A comprehensive ${level} course on ${subject}${focusText}. This course provides structured learning with practical examples, interactive exercises, and real-world applications to help you master the subject effectively.`;
  }
  
  private estimateTime(moduleCount: number, level: string): string {
    const baseTime = moduleCount * 30; // 30 minutes per module
    const multiplier = level === 'beginner' ? 1 : level === 'intermediate' ? 1.5 : 2;
    const totalMinutes = Math.round(baseTime * multiplier);
    
    if (totalMinutes < 60) return `${totalMinutes} minutes`;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours} hours`;
  }
  
  private generatePrerequisites(analysis: QueryAnalysis): string[] {
    const { level, subject } = analysis;
    
    if (level === 'beginner') return ['No prior knowledge required', 'Basic computer skills'];
    if (level === 'intermediate') return [`Basic understanding of ${subject}`, 'Some practical experience'];
    return [`Strong foundation in ${subject}`, 'Previous practical experience', 'Willingness to tackle complex concepts'];
  }
  
  private generateLearningObjectives(analysis: QueryAnalysis): string[] {
    const { subject, level, focus } = analysis;
    
    const objectives = [
      `Understand the core concepts of ${subject}`,
      `Apply ${subject} principles in practical scenarios`,
      `Develop problem-solving skills related to ${subject}`,
      `Build confidence in using ${subject} effectively`
    ];
    
    if (level === 'advanced') {
      objectives.push(`Master advanced ${subject} techniques`);
      objectives.push(`Create innovative solutions using ${subject}`);
    }
    
    if (focus.includes('practical')) {
      objectives.push(`Gain hands-on experience with ${subject}`);
    }
    
    return objectives;
  }
  
  private generateModules(analysis: QueryAnalysis): AICourseModule[] {
    const { subject, level, focus } = analysis;
    
    // Generate appropriate number of modules based on level and focus
    const moduleCount = level === 'beginner' ? 4 : level === 'intermediate' ? 6 : 8;
    
    const modules: AICourseModule[] = [];
    
    for (let i = 0; i < moduleCount; i++) {
      modules.push(this.generateModule(analysis, i + 1, moduleCount));
    }
    
    return modules;
  }
  
  private generateModule(analysis: QueryAnalysis, moduleNumber: number, totalModules: number): AICourseModule {
    const { subject, level } = analysis;
    
    const moduleTitles = this.getModuleTitles(analysis, totalModules);
    const title = moduleTitles[moduleNumber - 1];
    
    const concepts = this.generateConcepts(analysis, moduleNumber);
    const flashcards = this.generateFlashcards(analysis, concepts, moduleNumber);
    const quizQuestions = this.generateQuizQuestions(analysis, concepts, moduleNumber);
    
    return {
      title,
      description: `Module ${moduleNumber}: ${title}. This module covers essential concepts and provides practical exercises to reinforce your understanding.`,
      concepts,
      flashcards,
      quizQuestions
    };
  }
  
  private getModuleTitles(analysis: QueryAnalysis, count: number): string[] {
    const { subject, level } = analysis;
    
    const baseTitles = [
      `Introduction to ${subject}`,
      `Core Concepts of ${subject}`,
      `Practical Applications of ${subject}`,
      `Advanced Techniques in ${subject}`,
      `Problem Solving with ${subject}`,
      `Real-world ${subject} Projects`,
      `${subject} Best Practices`,
      `Mastering ${subject}`
    ];
    
    if (level === 'beginner') {
      return baseTitles.slice(0, 4).map(title => 
        title.replace('Advanced', 'Basic').replace('Mastering', 'Understanding')
      );
    }
    
    return baseTitles.slice(0, count);
  }
  
  private generateConcepts(analysis: QueryAnalysis, moduleNumber: number): string[] {
    const { subject, level } = analysis;
    
    const conceptTemplates = {
      beginner: [
        `What is ${subject}?`,
        `Basic principles of ${subject}`,
        `Key terminology in ${subject}`,
        `Simple applications of ${subject}`
      ],
      intermediate: [
        `Advanced concepts in ${subject}`,
        `${subject} methodologies`,
        `Complex problem-solving with ${subject}`,
        `Integration of ${subject} with other fields`
      ],
      advanced: [
        `Expert-level ${subject} techniques`,
        `Innovation in ${subject}`,
        `Cutting-edge ${subject} applications`,
        `Future trends in ${subject}`
      ]
    };
    
    return conceptTemplates[level] || conceptTemplates.beginner;
  }
  
  private generateFlashcards(analysis: QueryAnalysis, concepts: string[], moduleNumber: number): Array<{ front: string; back: string; difficulty: 'easy' | 'medium' | 'hard' }> {
    const { subject, level } = analysis;
    
    const flashcards = [];
    
    for (const concept of concepts) {
      const difficulty = this.getDifficulty(level, moduleNumber);
      
      flashcards.push({
        front: `What is ${concept.toLowerCase()}?`,
        back: `${concept} is a fundamental aspect of ${subject} that involves understanding core principles and their practical applications.`,
        difficulty
      });
      
      flashcards.push({
        front: `How does ${concept.toLowerCase()} relate to ${subject}?`,
        back: `${concept} provides the foundation for understanding more complex ${subject} concepts and enables practical problem-solving.`,
        difficulty
      });
    }
    
    return flashcards;
  }
  
  private generateQuizQuestions(analysis: QueryAnalysis, concepts: string[], moduleNumber: number): Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }> {
    const { subject, level } = analysis;
    
    const questions = [];
    
    for (const concept of concepts) {
      const difficulty = this.getDifficulty(level, moduleNumber);
      
      questions.push({
        question: `Which of the following best describes ${concept.toLowerCase()}?`,
        options: [
          `A fundamental principle in ${subject}`,
          `An optional technique`,
          `A completely unrelated concept`,
          `A temporary trend`
        ],
        correctAnswer: 0,
        explanation: `${concept} is indeed a fundamental principle in ${subject} that forms the basis for understanding more advanced topics.`,
        difficulty
      });
      
      questions.push({
        question: `What is the primary purpose of studying ${concept.toLowerCase()}?`,
        options: [
          `To memorize facts`,
          `To understand principles and applications`,
          `To pass exams only`,
          `To impress others`
        ],
        correctAnswer: 1,
        explanation: `The main goal is to understand the underlying principles and how they can be applied practically in ${subject}.`,
        difficulty
      });
    }
    
    return questions;
  }
  
  private getDifficulty(level: string, moduleNumber: number): 'easy' | 'medium' | 'hard' {
    if (level === 'beginner') return 'easy';
    if (level === 'intermediate') return moduleNumber <= 3 ? 'medium' : 'hard';
    return 'hard';
  }
  
  public async generateComprehensiveCourse(userQuery: string): Promise<AICourseStructure> {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const analysis = this.analyzeQuery(userQuery);
    return this.generateCourseStructure(analysis);
  }
  
  public async generateQuickContent(userQuery: string): Promise<{
    flashcards: Array<{ front: string; back: string }>;
    quizQuestions: Array<{
      question: string;
      options: string[];
      correctAnswer: number;
      explanation?: string;
    }>;
  }> {
    const analysis = this.analyzeQuery(userQuery);
    const concepts = this.generateConcepts(analysis, 1);
    
    const flashcards = this.generateFlashcards(analysis, concepts, 1).map(fc => ({
      front: fc.front,
      back: fc.back
    }));
    
    const quizQuestions = this.generateQuizQuestions(analysis, concepts, 1).map(q => ({
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation
    }));
    
    return { flashcards, quizQuestions };
  }
}

export const aiAgent = new AICourseAgent();
