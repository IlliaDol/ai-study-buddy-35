import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function QuickStudyCard() {
  return (
    <Card className="w-full max-w-sm mx-auto hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <Zap className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <CardTitle className="text-xl font-semibold">Швидке вивчення</CardTitle>
        <CardDescription className="text-sm">
          Створюйте персоналізовані картки та тести для швидкого засвоєння та закріплення знань з будь-якої конкретної теми
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Link to="/quick-study">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            <Brain className="h-4 w-4 mr-2" />
            Почати швидке вивчення
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
