import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      "app.title": "AI Study Buddy",
      "nav.topicLearning": "Topic Learning",
      "nav.courseGenerator": "Course Generator",
      "nav.languageLab": "Language Lab",
      "nav.settings": "Settings",

      // Main Screen
      "main.streak": "day streak",
      "main.xp": "XP",
      "main.topicCard.title": "Topic Learning",
      "main.topicCard.description": "Generate flashcards and quizzes for any topic you want to learn",
      "main.courseCard.title": "Course Generator",
      "main.courseCard.description": "Create complete courses with multiple modules and structured learning",
      "main.languageCard.title": "Language Lab",
      "main.languageCard.description": "Study vocabulary and phrases in different languages",
      "main.reviewSection.title": "Review Time!",
      "main.reviewSection.description_one": "You have cards due for review in {{count}} deck",
      "main.reviewSection.description_other": "You have cards due for review in {{count}} decks",
      "main.reviewSection.button": "Start Review",
      "main.savedContent.title": "Your Saved Content",

      // Topic Generator
      "topic.title": "Generate Learning Content",
      "topic.prompt": "What would you like to learn about?",
      "topic.placeholder": "Enter a topic (e.g., JavaScript Promises, Quantum Physics, etc.)",
      "topic.generate": "Generate Content",
      "topic.back": "Back",
      "topic.loading": "Generating content...",

      // Course Generator
      "course.title": "Generate a Course",
      "course.prompt": "What course would you like to create?",
      "course.placeholder": "Enter a course topic (e.g., Web Development with React)",
      "course.generate": "Generate Course",
      "course.back": "Back",
      "course.loading": "Building your course...",

      // Language Learning
      "language.title": "Language Learning",
      "language.prompt": "Select a language and level to learn:",
      "language.select": "Select Language",
      "language.level.beginner": "Beginner",
      "language.level.intermediate": "Intermediate",
      "language.level.advanced": "Advanced",
      "language.generate": "Generate Vocabulary",
      "language.back": "Back",
      "language.loading": "Creating language content...",

      // Study Mode
      "study.title": "Study: {{topic}}",
      "study.prompt": "Choose a study mode:",
      "study.flashcards": "Flashcards",
      "study.flashcards.description": "Practice with interactive flashcards",
      "study.quiz": "Quiz",
      "study.quiz.description": "Test your knowledge with a quiz",
      "study.save": "Save This Deck",
      "study.saved": "Saved",
      "study.back": "Back",

      // Flashcards
      "flashcards.title": "Flashcards: {{topic}}",
      "flashcards.card": "Card {{current}} of {{total}}",
      "flashcards.tap": "Tap to flip",
      "flashcards.again": "Again",
      "flashcards.hard": "Hard",
      "flashcards.good": "Good",
      "flashcards.easy": "Easy",
      "flashcards.previous": "Previous",
      "flashcards.next": "Next",
      "flashcards.back": "Back to Modes",

      // Quiz
      "quiz.title": "Quiz: {{topic}}",
      "quiz.question": "Question {{current}} of {{total}}",
      "quiz.next": "Next Question",
      "quiz.submit": "Submit Answer",
      "quiz.results": "Quiz Results",
      "quiz.score": "You scored {{score}} out of {{total}}",
      "quiz.correct": "Correct!",
      "quiz.incorrect": "Incorrect. The correct answer is:",
      "quiz.restart": "Restart Quiz",
      "quiz.back": "Back to Modes",

      // Course Player
      "coursePlayer.module": "Module {{number}}: {{title}}",
      "coursePlayer.progress": "{{completed}} of {{total}} modules completed",
      "coursePlayer.concepts": "Key Concepts",
      "coursePlayer.flashcards": "Flashcards Preview",
      "coursePlayer.flashcardsCount": "{{count}} flashcards in this module",
      "coursePlayer.quiz": "Quiz Preview",
      "coursePlayer.quizCount": "{{count}} quiz questions in this module",
      "coursePlayer.review": "Review This Module",
      "coursePlayer.markComplete": "Mark as Completed",
      "coursePlayer.completed": "Completed",
      "coursePlayer.previous": "Previous Module",
      "coursePlayer.next": "Next Module",
      "coursePlayer.back": "Back to Main",

      // Saved Decks
      "savedDecks.created": "Created {{time}}",
      "savedDecks.flashcards": "{{count}} flashcards",
      "savedDecks.quiz": "{{count}} quiz questions",
      "savedDecks.due": "{{count}} cards due for review",
      "savedDecks.review": "Review Deck",
      "savedDecks.delete": "Delete deck",

      // Settings
      "settings.title": "AI Settings",
      "settings.provider": "AI Provider",
      "settings.apiKey": "API Key",
      "settings.apiKeyStored": "Stored as: {{key}}",
      "settings.apiKeyNote": "Your API key is stored locally in your browser",
      "settings.save": "Save Settings",
      "settings.cancel": "Cancel",
      "settings.saved": "Settings saved",
      "settings.providerSet": "AI provider set to {{provider}}",
      "settings.error.invalidKey": "Invalid API Key",
      "settings.error.deepseekFormat": "DeepSeek API key should start with \"sk-\" and be at least 20 characters",

      // Errors
      "error.title": "Something went wrong",
      "error.tryAgain": "Try Again",
      "error.back": "Go Back",
      "error.apiTimeout": "The AI request timed out. Please try again or check your connection.",
      "error.apiError": "There was an error communicating with the AI service.",
      "error.invalidKey": "The API key appears to be invalid. Please check your settings.",

      // Common
      "common.loading": "Loading...",
      "common.saving": "Saving...",
      "common.success": "Success!",
      "common.error": "Error",
      "common.cancel": "Cancel",
      "common.confirm": "Confirm",
      "common.delete": "Delete",
      "common.save": "Save"
    }
  },
  uk: {
    translation: {
      // Navigation
      "app.title": "AI Помічник для навчання",
      "nav.topicLearning": "Вивчення теми",
      "nav.courseGenerator": "Створення курсу",
      "nav.languageLab": "Мовна лабораторія",
      "nav.settings": "Налаштування",

      // Main Screen
      "main.streak": "днів поспіль",
      "main.xp": "XP",
      "main.topicCard.title": "Вивчення теми",
      "main.topicCard.description": "Створюйте картки та тести для будь-якої теми, яку ви хочете вивчити",
      "main.courseCard.title": "Створення курсу",
      "main.courseCard.description": "Створюйте повні курси з кількома модулями та структурованим навчанням",
      "main.languageCard.title": "Мовна лабораторія",
      "main.languageCard.description": "Вивчайте словник та фрази різними мовами",
      "main.reviewSection.title": "Час повторення!",
      "main.reviewSection.description_one": "У вас є картки для повторення в {{count}} колоді",
      "main.reviewSection.description_other": "У вас є картки для повторення в {{count}} колодах",
      "main.reviewSection.button": "Почати повторення",
      "main.savedContent.title": "Ваш збережений контент",

      // Topic Generator
      "topic.title": "Створення навчального контенту",
      "topic.prompt": "Що б ви хотіли вивчити?",
      "topic.placeholder": "Введіть тему (наприклад, JavaScript Promises, квантова фізика тощо)",
      "topic.generate": "Створити контент",
      "topic.back": "Назад",
      "topic.loading": "Створення контенту...",

      // Course Generator
      "course.title": "Створення курсу",
      "course.prompt": "Який курс ви хочете створити?",
      "course.placeholder": "Введіть тему курсу (наприклад, веб-розробка з React)",
      "course.generate": "Створити курс",
      "course.back": "Назад",
      "course.loading": "Створення вашого курсу...",

      // Language Learning
      "language.title": "Вивчення мови",
      "language.prompt": "Виберіть мову та рівень для вивчення:",
      "language.select": "Виберіть мову",
      "language.level.beginner": "Початковий",
      "language.level.intermediate": "Середній",
      "language.level.advanced": "Просунутий",
      "language.generate": "Створити словник",
      "language.back": "Назад",
      "language.loading": "Створення мовного контенту...",

      // Study Mode
      "study.title": "Навчання: {{topic}}",
      "study.prompt": "Виберіть режим навчання:",
      "study.flashcards": "Картки",
      "study.flashcards.description": "Практикуйтесь з інтерактивними картками",
      "study.quiz": "Тест",
      "study.quiz.description": "Перевірте свої знання за допомогою тесту",
      "study.save": "Зберегти цю колоду",
      "study.saved": "Збережено",
      "study.back": "Назад",

      // Flashcards
      "flashcards.title": "Картки: {{topic}}",
      "flashcards.card": "Картка {{current}} з {{total}}",
      "flashcards.tap": "Натисніть, щоб перевернути",
      "flashcards.again": "Знову",
      "flashcards.hard": "Важко",
      "flashcards.good": "Добре",
      "flashcards.easy": "Легко",
      "flashcards.previous": "Попередня",
      "flashcards.next": "Наступна",
      "flashcards.back": "Назад до режимів",

      // Quiz
      "quiz.title": "Тест: {{topic}}",
      "quiz.question": "Питання {{current}} з {{total}}",
      "quiz.next": "Наступне питання",
      "quiz.submit": "Відправити відповідь",
      "quiz.results": "Результати тесту",
      "quiz.score": "Ви набрали {{score}} з {{total}}",
      "quiz.correct": "Правильно!",
      "quiz.incorrect": "Неправильно. Правильна відповідь:",
      "quiz.restart": "Перезапустити тест",
      "quiz.back": "Назад до режимів",

      // Course Player
      "coursePlayer.module": "Модуль {{number}}: {{title}}",
      "coursePlayer.progress": "{{completed}} з {{total}} модулів завершено",
      "coursePlayer.concepts": "Ключові концепції",
      "coursePlayer.flashcards": "Перегляд карток",
      "coursePlayer.flashcardsCount": "{{count}} карток у цьому модулі",
      "coursePlayer.quiz": "Перегляд тесту",
      "coursePlayer.quizCount": "{{count}} питань тесту в цьому модулі",
      "coursePlayer.review": "Повторити цей модуль",
      "coursePlayer.markComplete": "Позначити як завершене",
      "coursePlayer.completed": "Завершено",
      "coursePlayer.previous": "Попередній модуль",
      "coursePlayer.next": "Наступний модуль",
      "coursePlayer.back": "Назад до головної",

      // Saved Decks
      "savedDecks.created": "Створено {{time}}",
      "savedDecks.flashcards": "{{count}} карток",
      "savedDecks.quiz": "{{count}} питань тесту",
      "savedDecks.due": "{{count}} карток для повторення",
      "savedDecks.review": "Повторити колоду",
      "savedDecks.delete": "Видалити колоду",

      // Settings
      "settings.title": "Налаштування AI",
      "settings.provider": "Постачальник AI",
      "settings.apiKey": "API ключ",
      "settings.apiKeyStored": "Збережено як: {{key}}",
      "settings.apiKeyNote": "Ваш API ключ зберігається локально у вашому браузері",
      "settings.save": "Зберегти налаштування",
      "settings.cancel": "Скасувати",
      "settings.saved": "Налаштування збережені",
      "settings.providerSet": "Постачальник AI встановлено на {{provider}}",
      "settings.error.invalidKey": "Недійсний API ключ",
      "settings.error.deepseekFormat": "Ключ DeepSeek повинен починатися з \"sk-\" і мати довжину не менше 20 символів",

      // Errors
      "error.title": "Щось пішло не так",
      "error.tryAgain": "Спробувати ще раз",
      "error.back": "Повернутися назад",
      "error.apiTimeout": "Запит до AI перевищив час очікування. Спробуйте знову або перевірте своє з'єднання.",
      "error.apiError": "Виникла помилка під час спілкування з сервісом AI.",
      "error.invalidKey": "Схоже, що API ключ недійсний. Перевірте свої налаштування.",

      // Common
      "common.loading": "Завантаження...",
      "common.saving": "Збереження...",
      "common.success": "Успіх!",
      "common.error": "Помилка",
      "common.cancel": "Скасувати",
      "common.confirm": "Підтвердити",
      "common.delete": "Видалити",
      "common.save": "Зберегти"
    }
  },
  de: {
    translation: {
      // Navigation
      "app.title": "KI-Lernhelfer",
      "nav.topicLearning": "Themenlernen",
      "nav.courseGenerator": "Kursgenerator",
      "nav.languageLab": "Sprachlabor",
      "nav.settings": "Einstellungen",

      // Main Screen
      "main.streak": "Tage Serie",
      "main.xp": "EP",
      "main.topicCard.title": "Themenlernen",
      "main.topicCard.description": "Erstellen Sie Lernkarten und Quiz zu jedem Thema, das Sie lernen möchten",
      "main.courseCard.title": "Kursgenerator",
      "main.courseCard.description": "Erstellen Sie vollständige Kurse mit mehreren Modulen und strukturiertem Lernen",
      "main.languageCard.title": "Sprachlabor",
      "main.languageCard.description": "Lernen Sie Vokabeln und Redewendungen in verschiedenen Sprachen",
      "main.reviewSection.title": "Wiederholungszeit!",
      "main.reviewSection.description_one": "Sie haben Karten zur Wiederholung in {{count}} Deck",
      "main.reviewSection.description_other": "Sie haben Karten zur Wiederholung in {{count}} Decks",
      "main.reviewSection.button": "Wiederholung starten",
      "main.savedContent.title": "Ihre gespeicherten Inhalte",

      // Topic Generator
      "topic.title": "Lerninhalte erstellen",
      "topic.prompt": "Was möchten Sie lernen?",
      "topic.placeholder": "Geben Sie ein Thema ein (z.B. JavaScript Promises, Quantenphysik usw.)",
      "topic.generate": "Inhalte erstellen",
      "topic.back": "Zurück",
      "topic.loading": "Inhalte werden erstellt...",

      // Course Generator
      "course.title": "Kurs erstellen",
      "course.prompt": "Welchen Kurs möchten Sie erstellen?",
      "course.placeholder": "Geben Sie ein Kursthema ein (z.B. Webentwicklung mit React)",
      "course.generate": "Kurs erstellen",
      "course.back": "Zurück",
      "course.loading": "Ihr Kurs wird erstellt...",

      // Language Learning
      "language.title": "Sprachenlernen",
      "language.prompt": "Wählen Sie eine Sprache und ein Niveau zum Lernen:",
      "language.select": "Sprache auswählen",
      "language.level.beginner": "Anfänger",
      "language.level.intermediate": "Mittelstufe",
      "language.level.advanced": "Fortgeschritten",
      "language.generate": "Vokabeln erstellen",
      "language.back": "Zurück",
      "language.loading": "Sprachinhalte werden erstellt...",

      // Study Mode
      "study.title": "Lernen: {{topic}}",
      "study.prompt": "Wählen Sie einen Lernmodus:",
      "study.flashcards": "Lernkarten",
      "study.flashcards.description": "Üben Sie mit interaktiven Lernkarten",
      "study.quiz": "Quiz",
      "study.quiz.description": "Testen Sie Ihr Wissen mit einem Quiz",
      "study.save": "Dieses Deck speichern",
      "study.saved": "Gespeichert",
      "study.back": "Zurück",

      // Flashcards
      "flashcards.title": "Lernkarten: {{topic}}",
      "flashcards.card": "Karte {{current}} von {{total}}",
      "flashcards.tap": "Zum Umdrehen tippen",
      "flashcards.again": "Nochmal",
      "flashcards.hard": "Schwer",
      "flashcards.good": "Gut",
      "flashcards.easy": "Leicht",
      "flashcards.previous": "Vorherige",
      "flashcards.next": "Nächste",
      "flashcards.back": "Zurück zu Modi",

      // Quiz
      "quiz.title": "Quiz: {{topic}}",
      "quiz.question": "Frage {{current}} von {{total}}",
      "quiz.next": "Nächste Frage",
      "quiz.submit": "Antwort einreichen",
      "quiz.results": "Quizergebnisse",
      "quiz.score": "Sie haben {{score}} von {{total}} Punkten erreicht",
      "quiz.correct": "Richtig!",
      "quiz.incorrect": "Falsch. Die richtige Antwort ist:",
      "quiz.restart": "Quiz neu starten",
      "quiz.back": "Zurück zu Modi",

      // Course Player
      "coursePlayer.module": "Modul {{number}}: {{title}}",
      "coursePlayer.progress": "{{completed}} von {{total}} Modulen abgeschlossen",
      "coursePlayer.concepts": "Schlüsselkonzepte",
      "coursePlayer.flashcards": "Lernkarten-Vorschau",
      "coursePlayer.flashcardsCount": "{{count}} Lernkarten in diesem Modul",
      "coursePlayer.quiz": "Quiz-Vorschau",
      "coursePlayer.quizCount": "{{count}} Quizfragen in diesem Modul",
      "coursePlayer.review": "Dieses Modul wiederholen",
      "coursePlayer.markComplete": "Als abgeschlossen markieren",
      "coursePlayer.completed": "Abgeschlossen",
      "coursePlayer.previous": "Vorheriges Modul",
      "coursePlayer.next": "Nächstes Modul",
      "coursePlayer.back": "Zurück zur Hauptseite",

      // Saved Decks
      "savedDecks.created": "Erstellt {{time}}",
      "savedDecks.flashcards": "{{count}} Lernkarten",
      "savedDecks.quiz": "{{count}} Quizfragen",
      "savedDecks.due": "{{count}} Karten zur Wiederholung",
      "savedDecks.review": "Deck wiederholen",
      "savedDecks.delete": "Deck löschen",

      // Settings
      "settings.title": "KI-Einstellungen",
      "settings.provider": "KI-Anbieter",
      "settings.apiKey": "API-Schlüssel",
      "settings.apiKeyStored": "Gespeichert als: {{key}}",
      "settings.apiKeyNote": "Ihr API-Schlüssel wird lokal in Ihrem Browser gespeichert",
      "settings.save": "Einstellungen speichern",
      "settings.cancel": "Abbrechen",
      "settings.saved": "Einstellungen gespeichert",
      "settings.providerSet": "KI-Anbieter auf {{provider}} gesetzt",
      "settings.error.invalidKey": "Ungültiger API-Schlüssel",
      "settings.error.deepseekFormat": "DeepSeek-API-Schlüssel sollte mit \"sk-\" beginnen und mindestens 20 Zeichen lang sein",

      // Errors
      "error.title": "Etwas ist schief gelaufen",
      "error.tryAgain": "Erneut versuchen",
      "error.back": "Zurück gehen",
      "error.apiTimeout": "Die KI-Anfrage hat das Zeitlimit überschritten. Bitte versuchen Sie es erneut oder überprüfen Sie Ihre Verbindung.",
      "error.apiError": "Es gab einen Fehler bei der Kommunikation mit dem KI-Dienst.",
      "error.invalidKey": "Der API-Schlüssel scheint ungültig zu sein. Bitte überprüfen Sie Ihre Einstellungen.",

      // Common
      "common.loading": "Laden...",
      "common.saving": "Speichern...",
      "common.success": "Erfolg!",
      "common.error": "Fehler",
      "common.cancel": "Abbrechen",
      "common.confirm": "Bestätigen",
      "common.delete": "Löschen",
      "common.save": "Speichern"
    }
  }
};

// Configure i18n
i18n
  .use(LanguageDetector) // Detect browser language
  .use(initReactI18next) // Pass i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'uk', 'de'],

    interpolation: {
      escapeValue: false // React already escapes values
    },

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    }
  });

export default i18n;
