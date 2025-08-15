import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, Target, BookOpen, Plus } from "lucide-react";

interface LanguageLearningProps {
  onLanguageSelect: (language: string, level: string) => void;
  onLevelTest: (language: string) => void;
  onCustomVocab: (language: string) => void;
}

const languages = [
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
];

const levels = [
  { value: "beginner", label: "Beginner (A1-A2)", description: "Basic words and phrases" },
  { value: "intermediate", label: "Intermediate (B1-B2)", description: "Conversational vocabulary" },
  { value: "advanced", label: "Advanced (C1-C2)", description: "Complex and specialized terms" },
];

export const LanguageLearning = ({ onLanguageSelect, onLevelTest, onCustomVocab }: LanguageLearningProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");

  const handleStartLearning = () => {
    if (selectedLanguage && selectedLevel) {
      onLanguageSelect(selectedLanguage, selectedLevel);
    }
  };

  const selectedLangData = languages.find(lang => lang.code === selectedLanguage);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Globe className="text-primary" size={32} />
          <h2 className="text-3xl font-bold">Language Learning</h2>
        </div>
        <p className="text-muted-foreground text-lg">
          Master vocabulary in your target language with AI-generated study materials
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Start with Level */}
        <Card className="study-card p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Target className="text-primary" size={24} />
              <h3 className="text-xl font-semibold">Quick Start</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Choose Language</label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <span className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Your Level</label>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your level" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        <div>
                          <div className="font-medium">{level.label}</div>
                          <div className="text-xs text-muted-foreground">{level.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleStartLearning}
                disabled={!selectedLanguage || !selectedLevel}
                className="w-full"
              >
                Start Learning
              </Button>
            </div>
          </div>
        </Card>

        {/* Level Assessment */}
        <Card className="study-card p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <BookOpen className="text-primary" size={24} />
              <h3 className="text-xl font-semibold">Level Test</h3>
            </div>
            
            <p className="text-muted-foreground">
              Not sure about your level? Take a quick assessment to find the perfect starting point.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2">Test Language</label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <span className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={() => selectedLanguage && onLevelTest(selectedLanguage)}
                disabled={!selectedLanguage}
                variant="outline"
                className="w-full"
              >
                Take Level Test
              </Button>
            </div>
          </div>
        </Card>

        {/* Custom Vocabulary */}
        <Card className="study-card p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Plus className="text-primary" size={24} />
              <h3 className="text-xl font-semibold">Custom Vocabulary</h3>
            </div>
            
            <p className="text-muted-foreground">
              Add your own words, phrases, or vocabulary lists to create personalized study sessions.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2">Target Language</label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <span className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={() => selectedLanguage && onCustomVocab(selectedLanguage)}
                disabled={!selectedLanguage}
                variant="outline"
                className="w-full"
              >
                Add Vocabulary
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {selectedLangData && (
        <Card className="study-card p-6">
          <div className="flex items-center gap-4">
            <div className="text-4xl">{selectedLangData.flag}</div>
            <div>
              <h4 className="text-xl font-semibold">{selectedLangData.name}</h4>
              <p className="text-muted-foreground">
                Ready to enhance your {selectedLangData.name} vocabulary with AI-powered study tools
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};