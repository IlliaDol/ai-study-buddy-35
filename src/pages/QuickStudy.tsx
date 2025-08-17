import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, Image, Link, Camera, Brain, Zap, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExtractedContent {
  title: string;
  topics: string[];
  keyConcepts: string[];
  summary: string;
}

export default function QuickStudy() {
  const [activeTab, setActiveTab] = useState('text');
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedContent, setExtractedContent] = useState<ExtractedContent | null>(null);
  const [inputText, setInputText] = useState('');
  const [url, setUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockExtractedContent: ExtractedContent = {
        title: `Аналіз файлу: ${file.name}`,
        topics: ['Основні концепції', 'Ключові принципи', 'Практичні застосування'],
        keyConcepts: ['Концепція 1', 'Концепція 2', 'Концепція 3', 'Концепція 4'],
        summary: 'AI проаналізував ваш файл та виявив ключові теми та концепції для створення навчальних матеріалів.'
      };
      
      setExtractedContent(mockExtractedContent);
      toast({
        title: "Файл оброблено!",
        description: "AI витягнув ключові концепції з вашого файлу.",
      });
    } catch (error) {
      toast({
        title: "Помилка обробки",
        description: "Не вдалося обробити файл. Спробуйте ще раз.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextProcess = async () => {
    if (!inputText.trim()) return;

    setIsProcessing(true);
    
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockExtractedContent: ExtractedContent = {
        title: 'Аналіз тексту',
        topics: ['Основні ідеї', 'Важливі моменти', 'Ключові терміни'],
        keyConcepts: ['Ідея 1', 'Ідея 2', 'Ідея 3', 'Ідея 4'],
        summary: 'AI проаналізував ваш текст та створив структуру для навчальних матеріалів.'
      };
      
      setExtractedContent(mockExtractedContent);
      toast({
        title: "Текст оброблено!",
        description: "AI витягнув ключові концепції з вашого тексту.",
      });
    } catch (error) {
      toast({
        title: "Помилка обробки",
        description: "Не вдалося обробити текст. Спробуйте ще раз.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUrlProcess = async () => {
    if (!url.trim()) return;

    setIsProcessing(true);
    
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const mockExtractedContent: ExtractedContent = {
        title: `Аналіз веб-сторінки: ${url}`,
        topics: ['Основні розділи', 'Ключові теми', 'Важливі концепції'],
        keyConcepts: ['Концепція A', 'Концепція B', 'Концепція C', 'Концепція D'],
        summary: 'AI проаналізував веб-сторінку та виявив основні теми для створення навчальних матеріалів.'
      };
      
      setExtractedContent(mockExtractedContent);
      toast({
        title: "Веб-сторінку оброблено!",
        description: "AI витягнув ключові концепції з веб-сторінки.",
      });
    } catch (error) {
      toast({
        title: "Помилка обробки",
        description: "Не вдалося обробити веб-сторінку. Спробуйте ще раз.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const createStudyMaterials = async () => {
    if (!extractedContent) return;

    setIsProcessing(true);
    
    try {
      // Simulate creating study materials
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Навчальні матеріали створено!",
        description: "Картки та тести готові для вивчення.",
      });
      
      // Here you would navigate to the study materials
      console.log('Study materials created:', extractedContent);
    } catch (error) {
      toast({
        title: "Помилка створення",
        description: "Не вдалося створити навчальні матеріали.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Швидке вивчення</h1>
          <p className="text-lg text-gray-600">
            Створюйте персоналізовані картки та тести для швидкого засвоєння та закріплення знань з будь-якої конкретної теми
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Завантаження контенту
              </CardTitle>
              <CardDescription>
                Виберіть спосіб завантаження матеріалу для обробки
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="text" className="flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    Текст
                  </TabsTrigger>
                  <TabsTrigger value="file" className="flex items-center">
                    <Upload className="h-4 w-4 mr-1" />
                    Файл
                  </TabsTrigger>
                  <TabsTrigger value="url" className="flex items-center">
                    <Link className="h-4 w-4 mr-1" />
                    URL
                  </TabsTrigger>
                  <TabsTrigger value="camera" className="flex items-center">
                    <Camera className="h-4 w-4 mr-1" />
                    Камера
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="text" className="space-y-4">
                  <div>
                    <Label htmlFor="text-input">Вставте текст для аналізу</Label>
                    <Textarea
                      id="text-input"
                      placeholder="Вставте ваш текст тут..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="min-h-[200px] mt-2"
                    />
                  </div>
                  <Button 
                    onClick={handleTextProcess} 
                    disabled={!inputText.trim() || isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <Brain className="h-4 w-4 mr-2 animate-spin" />
                        Обробка...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Аналізувати текст
                      </>
                    )}
                  </Button>
                </TabsContent>

                <TabsContent value="file" className="space-y-4">
                  <div>
                    <Label>Завантажте файл</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mt-2">
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Підтримувані формати: PDF, DOC, DOCX, TXT, PPT, PPTX
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isProcessing}
                      >
                        Обрати файл
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
                        onChange={handleFileUpload}
                        className="hidden"
                        aria-label="Завантажити файл"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="url" className="space-y-4">
                  <div>
                    <Label htmlFor="url-input">URL веб-сторінки</Label>
                    <Input
                      id="url-input"
                      type="url"
                      placeholder="https://example.com/article"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <Button 
                    onClick={handleUrlProcess} 
                    disabled={!url.trim() || isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <Brain className="h-4 w-4 mr-2 animate-spin" />
                        Обробка...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Аналізувати веб-сторінку
                      </>
                    )}
                  </Button>
                </TabsContent>

                <TabsContent value="camera" className="space-y-4">
                  <div>
                    <Label>Сканування документів</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mt-2">
                      <Camera className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Скануйте документи камерою для автоматичного розпізнавання тексту
                      </p>
                      <Button variant="outline" disabled>
                        Відкрити камеру
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Результати аналізу
              </CardTitle>
              <CardDescription>
                AI витягнув ключові концепції та теми з вашого матеріалу
              </CardDescription>
            </CardHeader>
            <CardContent>
              {extractedContent ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{extractedContent.title}</h3>
                    <p className="text-sm text-gray-600">{extractedContent.summary}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Основні теми:</h4>
                    <div className="flex flex-wrap gap-2">
                      {extractedContent.topics.map((topic, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Ключові концепції:</h4>
                    <div className="space-y-2">
                      {extractedContent.keyConcepts.map((concept, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 p-3 rounded-lg text-sm"
                        >
                          {concept}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={createStudyMaterials} 
                    disabled={isProcessing}
                    className="w-full"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <Zap className="h-4 w-4 mr-2 animate-spin" />
                        Створення матеріалів...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Створити навчальні матеріали
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Завантажте матеріал для початку аналізу</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
