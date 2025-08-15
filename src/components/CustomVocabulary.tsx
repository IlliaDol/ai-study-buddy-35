import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Trash2, BookOpen, Brain } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface VocabEntry {
  id: string;
  word: string;
  translation: string;
}

interface CustomVocabularyProps {
  language: string;
  onBack: () => void;
  onStartStudy: (vocabulary: VocabEntry[]) => void;
}

const getLanguageFlag = (langCode: string): string => {
  const flags: Record<string, string> = {
    es: "🇪🇸", fr: "🇫🇷", de: "🇩🇪", it: "🇮🇹", pt: "🇵🇹",
    ja: "🇯🇵", ko: "🇰🇷", zh: "🇨🇳", ru: "🇷🇺", ar: "🇸🇦"
  };
  return flags[langCode] || "🌍";
};

const getLanguageName = (langCode: string): string => {
  const names: Record<string, string> = {
    es: "Spanish", fr: "French", de: "German", it: "Italian", pt: "Portuguese",
    ja: "Japanese", ko: "Korean", zh: "Chinese", ru: "Russian", ar: "Arabic"
  };
  return names[langCode] || "Language";
};

export const CustomVocabulary = ({ language, onBack, onStartStudy }: CustomVocabularyProps) => {
  const [vocabulary, setVocabulary] = useState<VocabEntry[]>([]);
  const [newWord, setNewWord] = useState("");
  const [newTranslation, setNewTranslation] = useState("");
  const [bulkText, setBulkText] = useState("");
  const [addMode, setAddMode] = useState<'single' | 'bulk'>('single');

  const addSingleWord = () => {
    if (!newWord.trim() || !newTranslation.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter both the word and its translation.",
        variant: "destructive",
      });
      return;
    }

    const newEntry: VocabEntry = {
      id: Date.now().toString(),
      word: newWord.trim(),
      translation: newTranslation.trim(),
    };

    setVocabulary([...vocabulary, newEntry]);
    setNewWord("");
    setNewTranslation("");

    toast({
      title: "Word added!",
      description: `Added "${newWord}" to your vocabulary list.`,
    });
  };

  const addBulkWords = () => {
    if (!bulkText.trim()) {
      toast({
        title: "No text provided",
        description: "Please enter some text to extract vocabulary from.",
        variant: "destructive",
      });
      return;
    }

    const lines = bulkText.split('\n');
    const newEntries: VocabEntry[] = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (trimmedLine) {
        // Try to parse different formats: "word - translation", "word: translation", "word = translation"
        const separators = [' - ', ': ', ' = ', ' | '];
        let parsed = false;

        for (const separator of separators) {
          if (trimmedLine.includes(separator)) {
            const [word, translation] = trimmedLine.split(separator, 2);
            if (word && translation) {
              newEntries.push({
                id: `${Date.now()}-${index}`,
                word: word.trim(),
                translation: translation.trim(),
              });
              parsed = true;
              break;
            }
          }
        }

        // If no separator found, treat as word without translation
        if (!parsed) {
          newEntries.push({
            id: `${Date.now()}-${index}`,
            word: trimmedLine,
            translation: "[Add translation]",
          });
        }
      }
    });

    setVocabulary([...vocabulary, ...newEntries]);
    setBulkText("");

    toast({
      title: "Vocabulary added!",
      description: `Added ${newEntries.length} words to your list.`,
    });
  };

  const removeWord = (id: string) => {
    setVocabulary(vocabulary.filter(entry => entry.id !== id));
  };

  const updateWord = (id: string, field: 'word' | 'translation', value: string) => {
    setVocabulary(vocabulary.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  const startStudying = () => {
    if (vocabulary.length === 0) {
      toast({
        title: "No vocabulary",
        description: "Please add some words before starting to study.",
        variant: "destructive",
      });
      return;
    }

    onStartStudy(vocabulary);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getLanguageFlag(language)}</span>
          <div>
            <h2 className="text-2xl font-bold">Custom {getLanguageName(language)} Vocabulary</h2>
            <p className="text-muted-foreground">Add your own words to create personalized study sessions</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Vocabulary Section */}
        <div className="space-y-6">
          <Card className="study-card p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Plus className="text-primary" size={20} />
                <h3 className="text-lg font-semibold">Add Vocabulary</h3>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={addMode === 'single' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAddMode('single')}
                >
                  Single Word
                </Button>
                <Button
                  variant={addMode === 'bulk' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAddMode('bulk')}
                >
                  Bulk Add
                </Button>
              </div>

              {addMode === 'single' ? (
                <div className="space-y-3">
                  <Input
                    placeholder={`Word in ${getLanguageName(language)}`}
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && newTranslation && addSingleWord()}
                  />
                  <Input
                    placeholder="English translation"
                    value={newTranslation}
                    onChange={(e) => setNewTranslation(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && newWord && addSingleWord()}
                  />
                  <Button onClick={addSingleWord} className="w-full">
                    Add Word
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Textarea
                    placeholder={`Paste your vocabulary list here. Supported formats:
word - translation
word: translation
word = translation
word | translation

Or just words (you can add translations later)`}
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    rows={6}
                  />
                  <Button onClick={addBulkWords} className="w-full">
                    Add Words
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {vocabulary.length > 0 && (
            <Card className="study-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Ready to Study</h3>
                <span className="text-sm text-muted-foreground">{vocabulary.length} words</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={startStudying} className="gap-2">
                  <BookOpen size={16} />
                  Flashcards
                </Button>
                <Button onClick={startStudying} variant="outline" className="gap-2">
                  <Brain size={16} />
                  Quiz Mode
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Vocabulary List */}
        <Card className="study-card p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Your Vocabulary ({vocabulary.length})</h3>
            
            {vocabulary.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No words added yet.</p>
                <p className="text-sm">Start building your vocabulary list!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {vocabulary.map((entry) => (
                  <div key={entry.id} className="flex gap-2 items-center p-3 bg-background/50 rounded-lg">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <Input
                        value={entry.word}
                        onChange={(e) => updateWord(entry.id, 'word', e.target.value)}
                        className="text-sm"
                      />
                      <Input
                        value={entry.translation}
                        onChange={(e) => updateWord(entry.id, 'translation', e.target.value)}
                        className="text-sm"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeWord(entry.id)}
                      className="text-destructive hover:text-destructive-foreground hover:bg-destructive/10"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};