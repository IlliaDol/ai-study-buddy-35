// Fallback service for generating deterministic content without API calls
import { AICourseStructure, AICourseModule } from '@/lib/aiAgent';

// Utility functions to create deterministic but varied content
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

const getSeededItem = <T>(arr: T[], seed: string): T => {
  const index = hashString(seed) % arr.length;
  return arr[index];
};

const getSeededItems = <T>(arr: T[], seed: string, count: number): T[] => {
  const result: T[] = [];
  for (let i = 0; i < count; i++) {
    result.push(getSeededItem(arr, `${seed}-${i}`));
  }
  return result;
};

// Content generation templates
const SUBJECTS = [
  'JavaScript', 'Python', 'Data Science', 'Machine Learning', 'Web Development',
  'React', 'Node.js', 'CSS', 'HTML', 'SQL', 'Database Design', 'Algorithms',
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Literature',
  'Art History', 'Music Theory', 'Psychology', 'Sociology', 'Economics',
  'Business Management', 'Marketing', 'UX Design', 'Graphic Design',
  'Photography', 'Film Studies', 'Creative Writing', 'Philosophy'
];

const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Japanese', 'Chinese', 'Korean'];

const DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;

const MODULE_TEMPLATES = [
  { prefix: 'Introduction to', suffix: 'Fundamentals' },
  { prefix: 'Understanding', suffix: 'Basics' },
  { prefix: 'Core Concepts in', suffix: 'Theory' },
  { prefix: 'Practical', suffix: 'Applications' },
  { prefix: 'Advanced', suffix: 'Techniques' },
  { prefix: 'Mastering', suffix: 'Skills' },
  { prefix: 'Professional', suffix: 'Development' },
  { prefix: 'Modern', suffix: 'Approaches' }
];

const CONCEPT_TEMPLATES = [
  'Understanding the core principles of',
  'How to implement',
  'Best practices for',
  'Common patterns in',
  'The history and evolution of',
  'Comparing different approaches to',
  'Troubleshooting issues with',
  'Performance optimization in',
  'Design patterns for',
  'Building applications with'
];

// Generate a quick content response for a topic query
export function generateQuickContent(query: string) {
  const seed = query.toLowerCase().trim();
  const mainTopic = getTopicFromQuery(seed);

  const flashcardCount = 10;
  const quizCount = 5;

  return {
    flashcards: generateFlashcards(mainTopic, seed, flashcardCount),
    quizQuestions: generateQuizQuestions(mainTopic, seed, quizCount)
  };
}

// Generate a complete course structure
export function generateCourseStructure(query: string): AICourseStructure {
  const seed = query.toLowerCase().trim();
  const mainTopic = getTopicFromQuery(seed);

  // Determine difficulty based on query keywords
  let difficulty: typeof DIFFICULTY_LEVELS[number] = 'beginner';
  if (seed.includes('advanced') || seed.includes('expert')) {
    difficulty = 'advanced';
  } else if (seed.includes('intermediate') || seed.includes('middle')) {
    difficulty = 'intermediate';
  }

  // Generate module count based on difficulty
  const moduleCount = difficulty === 'beginner' ? 4 : difficulty === 'intermediate' ? 5 : 6;

  // Generate modules
  const modules: AICourseModule[] = [];
  for (let i = 0; i < moduleCount; i++) {
    modules.push(generateModule(mainTopic, seed, i, difficulty));
  }

  return {
    title: `${mainTopic} ${difficulty === 'beginner' ? 'Fundamentals' : difficulty === 'intermediate' ? 'Intermediate Course' : 'Mastery Program'}`,
    description: `A comprehensive ${difficulty} course on ${mainTopic}, designed to help you build strong foundational knowledge and practical skills through structured learning and hands-on exercises.`,
    difficulty,
    estimatedTime: `${moduleCount * 2} hours`,
    prerequisites: generatePrerequisites(difficulty, mainTopic),
    learningObjectives: generateLearningObjectives(mainTopic, difficulty),
    modules
  };
}

// Generate language learning content
export function generateLanguageContent(language: string, level: string) {
  const seed = `${language}-${level}`.toLowerCase();
  const count = level === 'beginner' ? 10 : level === 'intermediate' ? 15 : 20;

  // Get common phrases and vocabulary based on language and level
  return generateLanguageFlashcards(language, level, seed, count);
}

// Helper functions

function getTopicFromQuery(query: string): string {
  // First try to match query with known subjects
  for (const subject of SUBJECTS) {
    if (query.toLowerCase().includes(subject.toLowerCase())) {
      return subject;
    }
  }

  // If no match, use a deterministic selection based on query hash
  return getSeededItem(SUBJECTS, query);
}

function generateModule(
  topic: string,
  seed: string,
  index: number,
  difficulty: typeof DIFFICULTY_LEVELS[number]
): AICourseModule {
  const moduleTemplate = getSeededItem(MODULE_TEMPLATES, `${seed}-module-${index}`);
  const moduleTitle = index === 0
    ? `Introduction to ${topic}`
    : `${moduleTemplate.prefix} ${topic} ${moduleTemplate.suffix}`;

  // Generate 3-5 concepts based on difficulty
  const conceptCount = difficulty === 'beginner' ? 3 : difficulty === 'intermediate' ? 4 : 5;
  const concepts = Array.from({length: conceptCount}).map((_, i) => {
    const template = getSeededItem(CONCEPT_TEMPLATES, `${seed}-concept-${index}-${i}`);
    return `${template} ${topic}`;
  });

  // Generate flashcards and quizzes
  const flashcardCount = difficulty === 'beginner' ? 5 : difficulty === 'intermediate' ? 8 : 10;
  const quizCount = difficulty === 'beginner' ? 3 : difficulty === 'intermediate' ? 4 : 5;

  return {
    title: moduleTitle,
    description: `This module covers essential aspects of ${topic} with a focus on ${concepts[0].toLowerCase()}.`,
    concepts,
    flashcards: generateModuleFlashcards(topic, concepts, `${seed}-module-${index}`, flashcardCount, difficulty),
    quizQuestions: generateModuleQuizQuestions(topic, concepts, `${seed}-module-${index}`, quizCount, difficulty)
  };
}

function generateFlashcards(topic: string, seed: string, count: number) {
  const results = [];

  for (let i = 0; i < count; i++) {
    const concepts = [
      `Definition of ${topic}`,
      `Key principles in ${topic}`,
      `${topic} best practices`,
      `Common ${topic} patterns`,
      `${topic} frameworks and tools`,
      `${topic} implementation strategies`,
      `Challenges in ${topic}`,
      `History of ${topic}`,
      `Future trends in ${topic}`,
      `${topic} in real-world applications`
    ];

    const concept = getSeededItem(concepts, `${seed}-fc-concept-${i}`);

    results.push({
      front: `What are the ${concept}?`,
      back: `The ${concept} include understanding the core fundamentals, applying practical techniques, and developing problem-solving skills specific to this domain.`
    });
  }

  return results;
}

function generateModuleFlashcards(
  topic: string,
  concepts: string[],
  seed: string,
  count: number,
  difficulty: typeof DIFFICULTY_LEVELS[number]
) {
  const results = [];

  for (let i = 0; i < count; i++) {
    const concept = getSeededItem(concepts, `${seed}-flashcard-${i}`);
    const difficultyLevel = i < count / 3 ? 'easy' : i < (count * 2 / 3) ? 'medium' : 'hard';

    results.push({
      front: `Explain the concept: ${concept}`,
      back: `${concept} refers to the systematic approach to solving problems in ${topic} by applying structured methodologies and best practices. This is essential for building robust solutions.`,
      difficulty: difficultyLevel
    });
  }

  return results;
}

function generateQuizQuestions(topic: string, seed: string, count: number) {
  const results = [];
  const concepts = [
    `${topic} fundamentals`,
    `${topic} implementation`,
    `${topic} best practices`,
    `${topic} common issues`,
    `${topic} advanced techniques`
  ];

  for (let i = 0; i < count; i++) {
    const concept = getSeededItem(concepts, `${seed}-quiz-${i}`);

    results.push({
      question: `Which of the following is NOT a key aspect of ${concept}?`,
      options: [
        `Structured approach to problem-solving`,
        `Understanding core principles`,
        `Relying solely on intuition rather than methodology`,
        `Applying systematic techniques`
      ],
      correctAnswer: 2, // The third option (index 2) is designed to be incorrect
      explanation: `While intuition can be helpful, ${concept} requires a structured methodology rather than relying solely on intuition.`
    });
  }

  return results;
}

function generateModuleQuizQuestions(
  topic: string,
  concepts: string[],
  seed: string,
  count: number,
  difficulty: typeof DIFFICULTY_LEVELS[number]
) {
  const results = [];

  for (let i = 0; i < count; i++) {
    const concept = getSeededItem(concepts, `${seed}-quiz-${i}`);
    const difficultyLevel = i < count / 3 ? 'easy' : i < (count * 2 / 3) ? 'medium' : 'hard';

    results.push({
      question: `Which of the following best describes the main purpose of ${concept}?`,
      options: [
        `To provide a structured approach to ${topic} problems`,
        `To ignore established methodologies in ${topic}`,
        `To avoid documentation in ${topic} projects`,
        `To complicate the development process in ${topic}`
      ],
      correctAnswer: 0, // First option is always correct
      explanation: `The main purpose of ${concept} is to provide a structured approach to solving problems in ${topic}, which helps create more robust and maintainable solutions.`,
      difficulty: difficultyLevel
    });
  }

  return results;
}

function generateLanguageFlashcards(language: string, level: string, seed: string, count: number) {
  const phraseSets = {
    beginner: [
      { front: 'Hello', back: 'Hola/Bonjour/Hallo/Ciao/你好' },
      { front: 'Goodbye', back: 'Adiós/Au revoir/Auf Wiedersehen/Addio/再见' },
      { front: 'Thank you', back: 'Gracias/Merci/Danke/Grazie/谢谢' },
      { front: 'Yes', back: 'Sí/Oui/Ja/Sì/是' },
      { front: 'No', back: 'No/Non/Nein/No/不' },
      { front: 'Please', back: 'Por favor/S\'il vous plaît/Bitte/Per favore/请' },
      { front: 'Sorry', back: 'Lo siento/Désolé/Entschuldigung/Mi dispiace/对不起' },
      { front: 'Excuse me', back: 'Disculpe/Excusez-moi/Entschuldigung/Scusi/对不起' },
      { front: 'How are you?', back: '¿Cómo estás?/Comment ça va?/Wie geht es dir?/Come stai?/你好吗?' },
      { front: 'My name is...', back: 'Me llamo.../Je m\'appelle.../Mein Name ist.../Mi chiamo.../我的名字是...' }
    ],
    intermediate: [
      { front: 'What time is it?', back: '¿Qué hora es?/Quelle heure est-il?/Wie spät ist es?/Che ora è?/几点了?' },
      { front: 'Where is the bathroom?', back: '¿Dónde está el baño?/Où sont les toilettes?/Wo ist die Toilette?/Dov\'è il bagno?/洗手间在哪里?' },
      { front: 'I don\'t understand', back: 'No entiendo/Je ne comprends pas/Ich verstehe nicht/Non capisco/我不明白' },
      { front: 'I would like...', back: 'Me gustaría.../Je voudrais.../Ich möchte.../Vorrei.../我想要...' },
      { front: 'How much does it cost?', back: '¿Cuánto cuesta?/Combien ça coûte?/Wie viel kostet das?/Quanto costa?/多少钱?' }
    ],
    advanced: [
      { front: 'I\'ve been learning this language for...', back: 'He estado aprendiendo este idioma por.../J\'apprends cette langue depuis.../Ich lerne diese Sprache seit.../Sto imparando questa lingua da.../我学习这种语言已经...' },
      { front: 'Could you speak more slowly, please?', back: '¿Podría hablar más despacio, por favor?/Pourriez-vous parler plus lentement, s\'il vous plaît?/Könnten Sie bitte langsamer sprechen?/Potrebbe parlare più lentamente, per favore?/请您说慢一点好吗?' },
      { front: 'What\'s the difference between...?', back: '¿Cuál es la diferencia entre...?/Quelle est la différence entre...?/Was ist der Unterschied zwischen...?/Qual è la differenza tra...?/...之间有什么区别?' }
    ]
  };

  // Map the language to the correct index for translations
  const langIndex = {
    'Spanish': 0,
    'French': 1,
    'German': 2,
    'Italian': 3,
    'Chinese': 4
  }[language] || 0;

  const results = [];

  // Select appropriate phrase sets based on level
  let availablePhrases = [...phraseSets.beginner];
  if (level === 'intermediate' || level === 'advanced') {
    availablePhrases = [...availablePhrases, ...phraseSets.intermediate];
  }
  if (level === 'advanced') {
    availablePhrases = [...availablePhrases, ...phraseSets.advanced];
  }

  // Generate count flashcards
  for (let i = 0; i < count; i++) {
    const phraseIndex = i % availablePhrases.length;
    const phrase = availablePhrases[phraseIndex];

    // Get the appropriate translation for the selected language
    const translations = phrase.back.split('/');
    const translation = langIndex < translations.length ? translations[langIndex] : translations[0];

    results.push({
      front: phrase.front,
      back: translation
    });
  }

  return results;
}

function generatePrerequisites(difficulty: typeof DIFFICULTY_LEVELS[number], topic: string): string[] {
  if (difficulty === 'beginner') {
    return [
      'No prior experience with ' + topic + ' required',
      'Basic computer literacy',
      'Interest in learning ' + topic
    ];
  } else if (difficulty === 'intermediate') {
    return [
      'Fundamental understanding of ' + topic + ' basics',
      'Some practical experience with ' + topic,
      'Familiarity with related concepts and terminology'
    ];
  } else {
    return [
      'Strong understanding of ' + topic + ' principles',
      'Practical experience implementing ' + topic + ' in real projects',
      'Ability to solve complex problems independently',
      'Familiarity with advanced concepts in the field'
    ];
  }
}

function generateLearningObjectives(topic: string, difficulty: typeof DIFFICULTY_LEVELS[number]): string[] {
  const baseObjectives = [
    `Understand core concepts and principles of ${topic}`,
    `Apply ${topic} techniques to solve practical problems`,
    `Develop skills to implement ${topic} effectively`,
    `Analyze and evaluate different approaches to ${topic}`
  ];

  if (difficulty === 'intermediate') {
    baseObjectives.push(
      `Design robust solutions using ${topic}`,
      `Integrate ${topic} with other technologies and systems`
    );
  }

  if (difficulty === 'advanced') {
    baseObjectives.push(
      `Master advanced ${topic} patterns and architectures`,
      `Optimize ${topic} implementations for performance and scalability`,
      `Contribute to the evolution of ${topic} best practices`
    );
  }

  return baseObjectives;
}
