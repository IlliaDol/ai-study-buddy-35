import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // App title and navigation
      "app.title": "AI Study Buddy",
      "nav.settings": "Settings",
      "nav.back": "Back to Home",

      // Main page
      "main.hero.subtitle": "Your AI Learning Companion",
      "main.hero.description": "Master any topic or language with structured flashcards and quizzes. Powered by AI when connected.",
      
      // Stats
      "main.stats.streak": "Streak",
      "main.stats.xp": "Experience",
      "main.stats.days_one": "{{count}} day",
      "main.stats.days_other": "{{count}} days",
      "main.stats.level": "Level",
      "main.stats.totalDecks": "Total Decks",
      
      // Status
      "main.status.noKey": "No API key",
      "main.status.connected": "Connected",
      
      // Actions
      "main.actions.startLearning": "Start Learning",
      "main.actions.createCourse": "Create Course",
      "main.actions.learnLanguages": "Learn Languages",
      "main.actions.quickStudy": "Quick Study",
      "main.actions.startReview": "Start Review",
      
      // Cards
      "main.topicCard.title": "Topic Learning",
      "main.topicCard.description": "Generate personalized flashcards and quizzes from any topic or subject you want to learn.",
      
      "main.languageCard.title": "Language Learning",
      "main.languageCard.description": "Master new languages with vocabulary flashcards, phrases, and pronunciation practice.",
      
      "main.courseCard.title": "Course Generation",
      "main.courseCard.description": "Create comprehensive learning courses with multiple modules and structured content.",
      
      "main.quickStudyCard.title": "Quick Study",
      "main.quickStudyCard.description": "Create personalized cards and tests for quick learning and knowledge reinforcement on any specific topic.",
      
      // Features section
      "main.features.title": "Why Choose AI Study Buddy?",
      "main.features.subtitle": "Discover the features that make learning more effective",
      "main.features.aiPowered.title": "AI-Powered",
      "main.features.aiPowered.description": "Generate personalized content with advanced AI",
      "main.features.smartLearning.title": "Smart Learning",
      "main.features.smartLearning.description": "Adaptive spaced repetition for optimal retention",
      "main.features.multiLanguage.title": "Multi-Language",
      "main.features.multiLanguage.description": "Support for English, Ukrainian, and German",
      
      // Review section
      "main.reviewSection.title": "Review Time!",
      "main.reviewSection.description": "You have cards due for review in {{count}} {{count, plural, one {deck} other {decks}}}.",
      "main.reviewSection.button": "Start Review",
      
      // Saved content
      "main.savedContent.title": "Your Study Decks",
      
      // Topic Generator
      "topic.title": "Generate Learning Content",
      "topic.prompt": "What would you like to learn about?",
      "topic.placeholder": "Enter a topic, concept, or subject...",
      "topic.generate": "Generate Content",
      "topic.generating": "Generating...",
      "topic.back": "Back to Main",
      
      // Course Generator
      "course.title": "Create Learning Course",
      "course.prompt": "What course would you like to create?",
      "course.placeholder": "Enter course topic or subject...",
      "course.generate": "Create Course",
      "course.generating": "Creating course...",
      "course.back": "Back to Main",
      
      // Language Learning
      "language.title": "Language Learning",
      "language.select": "Select a language to learn:",
      "language.english": "English",
      "language.ukrainian": "Ukrainian",
      "language.german": "German",
      "language.spanish": "Spanish",
      "language.french": "French",
      "language.back": "Back to Main",
      
      // Study Modes
      "studyMode.title": "Choose Study Mode",
      "studyMode.flashcards": "Flashcards",
      "studyMode.quiz": "Quiz",
      "studyMode.save": "Save Deck",
      "studyMode.saved": "Deck Saved",
      "studyMode.back": "Back to Main",
      
      // Flashcards
      "flashcards.next": "Next",
      "flashcards.previous": "Previous",
      "flashcards.flip": "Flip",
      "flashcards.back": "Back to Study Mode",
      
      // Quiz
      "quiz.question": "Question",
      "quiz.submit": "Submit Answer",
      "quiz.next": "Next Question",
      "quiz.complete": "Quiz Complete",
      "quiz.score": "Score: {{score}}/{{total}}",
      "quiz.back": "Back to Study Mode",
      
      // Settings
      "settings.title": "Settings",
      "settings.aiProvider": "AI Provider",
      "settings.apiKey": "API Key",
      "settings.language": "Language",
      "settings.theme": "Theme",
      "settings.close": "Close",
      
      // Common
      "common.loading": "Loading...",
      "common.error": "An error occurred",
      "common.success": "Success",
      "common.cancel": "Cancel",
      "common.save": "Save",
      "common.delete": "Delete",
      "common.edit": "Edit",
      "common.back": "Back",
      "common.next": "Next",
      "common.previous": "Previous",
      "common.close": "Close",
    }
  },
  uk: {
    translation: {
      // App title and navigation
      "app.title": "AI Помічник для навчання",
      "nav.settings": "Налаштування",
      "nav.back": "Назад до головної",

      // Main page
      "main.hero.subtitle": "Ваш AI навчальний помічник",
      "main.hero.description": "Опануйте будь-яку тему або мову за допомогою структурованих карток та тестів. Працює на AI при підключенні.",
      
      // Stats
      "main.stats.streak": "Серія",
      "main.stats.xp": "Досвід",
      "main.stats.days_one": "{{count}} день",
      "main.stats.days_other": "{{count}} днів",
      "main.stats.level": "Рівень",
      "main.stats.totalDecks": "Всього колод",
      
      // Status
      "main.status.noKey": "Немає API ключа",
      "main.status.connected": "Підключено",
      
      // Actions
      "main.actions.startLearning": "Почати навчання",
      "main.actions.createCourse": "Створити курс",
      "main.actions.learnLanguages": "Вивчати мови",
      "main.actions.quickStudy": "Швидке вивчення",
      "main.actions.startReview": "Почати повторення",
      
      // Cards
      "main.topicCard.title": "Вивчення тем",
      "main.topicCard.description": "Створюйте персоналізовані картки та тести з будь-якої теми або предмета, який ви хочете вивчити.",
      
      "main.languageCard.title": "Вивчення мов",
      "main.languageCard.description": "Опануйте нові мови за допомогою карток зі словниковим запасом, фразами та практикою вимови.",
      
      "main.courseCard.title": "Створення курсів",
      "main.courseCard.description": "Створюйте комплексні навчальні курси з кількома модулями та структурованим контентом.",
      
      "main.quickStudyCard.title": "Швидке вивчення",
      "main.quickStudyCard.description": "Створюйте персоналізовані картки та тести для швидкого засвоєння та закріплення знань з будь-якої конкретної теми.",
      
      // Features section
      "main.features.title": "Чому обирати AI Study Buddy?",
      "main.features.subtitle": "Відкрийте функції, які роблять навчання більш ефективним",
      "main.features.aiPowered.title": "AI-підтримка",
      "main.features.aiPowered.description": "Створюйте персоналізований контент за допомогою передового AI",
      "main.features.smartLearning.title": "Розумне навчання",
      "main.features.smartLearning.description": "Адаптивне інтервальне повторення для оптимального запам'ятовування",
      "main.features.multiLanguage.title": "Багатомовність",
      "main.features.multiLanguage.description": "Підтримка англійської, української та німецької мов",
      
      // Review section
      "main.reviewSection.title": "Час повторення!",
      "main.reviewSection.description": "У вас є картки для повторення в {{count}} {{count, plural, one {колоді} few {колодах} other {колодах}}}.",
      "main.reviewSection.button": "Почати повторення",
      
      // Saved content
      "main.savedContent.title": "Ваші навчальні колоди",
      
      // Topic Generator
      "topic.title": "Створення навчального контенту",
      "topic.prompt": "Що б ви хотіли вивчити?",
      "topic.placeholder": "Введіть тему, концепцію або предмет...",
      "topic.generate": "Створити контент",
      "topic.generating": "Створення...",
      "topic.back": "Назад до головної",
      
      // Course Generator
      "course.title": "Створення навчального курсу",
      "course.prompt": "Який курс ви хочете створити?",
      "course.placeholder": "Введіть тему або предмет курсу...",
      "course.generate": "Створити курс",
      "course.generating": "Створення курсу...",
      "course.back": "Назад до головної",
      
      // Language Learning
      "language.title": "Вивчення мов",
      "language.select": "Виберіть мову для вивчення:",
      "language.english": "Англійська",
      "language.ukrainian": "Українська",
      "language.german": "Німецька",
      "language.spanish": "Іспанська",
      "language.french": "Французька",
      "language.back": "Назад до головної",
      
      // Study Modes
      "studyMode.title": "Виберіть режим навчання",
      "studyMode.flashcards": "Картки",
      "studyMode.quiz": "Тест",
      "studyMode.save": "Зберегти колоду",
      "studyMode.saved": "Колоду збережено",
      "studyMode.back": "Назад до головної",
      
      // Flashcards
      "flashcards.next": "Далі",
      "flashcards.previous": "Назад",
      "flashcards.flip": "Перевернути",
      "flashcards.back": "Назад до режиму навчання",
      
      // Quiz
      "quiz.question": "Питання",
      "quiz.submit": "Відправити відповідь",
      "quiz.next": "Наступне питання",
      "quiz.complete": "Тест завершено",
      "quiz.score": "Результат: {{score}}/{{total}}",
      "quiz.back": "Назад до режиму навчання",
      
      // Settings
      "settings.title": "Налаштування",
      "settings.aiProvider": "AI провайдер",
      "settings.apiKey": "API ключ",
      "settings.language": "Мова",
      "settings.theme": "Тема",
      "settings.close": "Закрити",
      
      // Common
      "common.loading": "Завантаження...",
      "common.error": "Сталася помилка",
      "common.success": "Успішно",
      "common.cancel": "Скасувати",
      "common.save": "Зберегти",
      "common.delete": "Видалити",
      "common.edit": "Редагувати",
      "common.back": "Назад",
      "common.next": "Далі",
      "common.previous": "Назад",
      "common.close": "Закрити",
    }
  },
  de: {
    translation: {
      // App title and navigation
      "app.title": "AI Lernbegleiter",
      "nav.settings": "Einstellungen",
      "nav.back": "Zurück zur Startseite",

      // Main page
      "main.hero.subtitle": "Ihr KI-Lernbegleiter",
      "main.hero.description": "Meistern Sie jedes Thema oder jede Sprache mit strukturierten Karteikarten und Quiz. Unterstützt von KI bei Verbindung.",
      
      // Stats
      "main.stats.streak": "Serie",
      "main.stats.xp": "Erfahrung",
      "main.stats.days_one": "{{count}} Tag",
      "main.stats.days_other": "{{count}} Tage",
      "main.stats.level": "Level",
      "main.stats.totalDecks": "Gesamte Decks",
      
      // Status
      "main.status.noKey": "Kein API-Schlüssel",
      "main.status.connected": "Verbunden",
      
      // Actions
      "main.actions.startLearning": "Lernen beginnen",
      "main.actions.createCourse": "Kurs erstellen",
      "main.actions.learnLanguages": "Sprachen lernen",
      "main.actions.quickStudy": "Schnell lernen",
      "main.actions.startReview": "Wiederholung beginnen",
      
      // Cards
      "main.topicCard.title": "Themen lernen",
      "main.topicCard.description": "Generieren Sie personalisierte Karteikarten und Quiz aus jedem Thema oder Fach, das Sie lernen möchten.",
      
      "main.languageCard.title": "Sprachen lernen",
      "main.languageCard.description": "Meistern Sie neue Sprachen mit Vokabelkarten, Phrasen und Ausspracheübungen.",
      
      "main.courseCard.title": "Kurserstellung",
      "main.courseCard.description": "Erstellen Sie umfassende Lernkurse mit mehreren Modulen und strukturiertem Inhalt.",
      
      "main.quickStudyCard.title": "Schnell lernen",
      "main.quickStudyCard.description": "Erstellen Sie personalisierte Karten und Tests für schnelles Lernen und Wissensfestigung zu jedem spezifischen Thema.",
      
      // Features section
      "main.features.title": "Warum AI Study Buddy wählen?",
      "main.features.subtitle": "Entdecken Sie die Funktionen, die das Lernen effektiver machen",
      "main.features.aiPowered.title": "KI-gestützt",
      "main.features.aiPowered.description": "Generieren Sie personalisierten Inhalt mit fortschrittlicher KI",
      "main.features.smartLearning.title": "Intelligentes Lernen",
      "main.features.smartLearning.description": "Adaptive Intervallwiederholung für optimale Retention",
      "main.features.multiLanguage.title": "Mehrsprachig",
      "main.features.multiLanguage.description": "Unterstützung für Englisch, Ukrainisch und Deutsch",
      
      // Review section
      "main.reviewSection.title": "Wiederholungszeit!",
      "main.reviewSection.description": "Sie haben Karten zur Wiederholung in {{count}} {{count, plural, one {Deck} other {Decks}}}.",
      "main.reviewSection.button": "Wiederholung beginnen",
      
      // Saved content
      "main.savedContent.title": "Ihre Lern-Decks",
      
      // Topic Generator
      "topic.title": "Lerninhalt generieren",
      "topic.prompt": "Was möchten Sie lernen?",
      "topic.placeholder": "Geben Sie ein Thema, Konzept oder Fach ein...",
      "topic.generate": "Inhalt generieren",
      "topic.generating": "Generierung...",
      "topic.back": "Zurück zur Startseite",
      
      // Course Generator
      "course.title": "Lernkurs erstellen",
      "course.prompt": "Welchen Kurs möchten Sie erstellen?",
      "course.placeholder": "Geben Sie Kursthema oder Fach ein...",
      "course.generate": "Kurs erstellen",
      "course.generating": "Kurs wird erstellt...",
      "course.back": "Zurück zur Startseite",
      
      // Language Learning
      "language.title": "Sprachen lernen",
      "language.select": "Wählen Sie eine Sprache zum Lernen:",
      "language.english": "Englisch",
      "language.ukrainian": "Ukrainisch",
      "language.german": "Deutsch",
      "language.spanish": "Spanisch",
      "language.french": "Französisch",
      "language.back": "Zurück zur Startseite",
      
      // Study Modes
      "studyMode.title": "Lernmodus wählen",
      "studyMode.flashcards": "Karteikarten",
      "studyMode.quiz": "Quiz",
      "studyMode.save": "Deck speichern",
      "studyMode.saved": "Deck gespeichert",
      "studyMode.back": "Zurück zur Startseite",
      
      // Flashcards
      "flashcards.next": "Weiter",
      "flashcards.previous": "Zurück",
      "flashcards.flip": "Umdrehen",
      "flashcards.back": "Zurück zum Lernmodus",
      
      // Quiz
      "quiz.question": "Frage",
      "quiz.submit": "Antwort senden",
      "quiz.next": "Nächste Frage",
      "quiz.complete": "Quiz abgeschlossen",
      "quiz.score": "Punktzahl: {{score}}/{{total}}",
      "quiz.back": "Zurück zum Lernmodus",
      
      // Settings
      "settings.title": "Einstellungen",
      "settings.aiProvider": "KI-Anbieter",
      "settings.apiKey": "API-Schlüssel",
      "settings.language": "Sprache",
      "settings.theme": "Thema",
      "settings.close": "Schließen",
      
      // Common
      "common.loading": "Laden...",
      "common.error": "Ein Fehler ist aufgetreten",
      "common.success": "Erfolg",
      "common.cancel": "Abbrechen",
      "common.save": "Speichern",
      "common.delete": "Löschen",
      "common.edit": "Bearbeiten",
      "common.back": "Zurück",
      "common.next": "Weiter",
      "common.previous": "Zurück",
      "common.close": "Schließen",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('LANG') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
