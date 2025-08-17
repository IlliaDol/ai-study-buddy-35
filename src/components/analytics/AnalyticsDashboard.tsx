import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Target, TrendingUp, BookOpen, CheckCircle, XCircle, Star, Users, Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface StudySession {
  id: string;
  date: string;
  duration: number;
  cardsStudied: number;
  correctAnswers: number;
  totalAnswers: number;
  topic: string;
  mode: 'flashcards' | 'quiz' | 'review';
}

interface LearningStats {
  totalSessions: number;
  totalTime: number;
  totalCards: number;
  averageAccuracy: number;
  currentStreak: number;
  longestStreak: number;
  topicsStudied: string[];
  weeklyProgress: Array<{ date: string; sessions: number; accuracy: number }>;
  monthlyProgress: Array<{ month: string; totalTime: number; totalCards: number }>;
}

export const AnalyticsDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [loading, setLoading] = useState(true);

  // Mock data - в реальному додатку це буде завантажуватися з API
  useEffect(() => {
    const mockStats: LearningStats = {
      totalSessions: 47,
      totalTime: 2840, // minutes
      totalCards: 1250,
      averageAccuracy: 87.5,
      currentStreak: 12,
      longestStreak: 23,
      topicsStudied: ['JavaScript', 'React', 'TypeScript', 'Node.js', 'Python'],
      weeklyProgress: [
        { date: 'Mon', sessions: 3, accuracy: 85 },
        { date: 'Tue', sessions: 2, accuracy: 90 },
        { date: 'Wed', sessions: 4, accuracy: 88 },
        { date: 'Thu', sessions: 1, accuracy: 92 },
        { date: 'Fri', sessions: 5, accuracy: 87 },
        { date: 'Sat', sessions: 3, accuracy: 89 },
        { date: 'Sun', sessions: 2, accuracy: 91 },
      ],
      monthlyProgress: [
        { month: 'Jan', totalTime: 420, totalCards: 180 },
        { month: 'Feb', totalTime: 380, totalCards: 165 },
        { month: 'Mar', totalTime: 450, totalCards: 200 },
        { month: 'Apr', totalTime: 520, totalCards: 230 },
        { month: 'May', totalTime: 480, totalCards: 210 },
        { month: 'Jun', totalTime: 590, totalCards: 265 },
      ]
    };

    setTimeout(() => {
      setStats(mockStats);
      setLoading(false);
    }, 1000);
  }, []);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('analytics.title', 'Analytics Dashboard')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('analytics.subtitle', 'Track your learning progress and performance')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedPeriod === 'week' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('week')}
          >
            {t('analytics.week', 'Week')}
          </Button>
          <Button
            variant={selectedPeriod === 'month' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('month')}
          >
            {t('analytics.month', 'Month')}
          </Button>
          <Button
            variant={selectedPeriod === 'year' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('year')}
          >
            {t('analytics.year', 'Year')}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('analytics.totalSessions', 'Total Sessions')}
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSessions}</div>
            <p className="text-xs text-muted-foreground">
              {t('analytics.sessionsDescription', 'Learning sessions completed')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('analytics.totalTime', 'Total Time')}
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(stats.totalTime)}</div>
            <p className="text-xs text-muted-foreground">
              {t('analytics.timeDescription', 'Time spent learning')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('analytics.accuracy', 'Accuracy')}
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageAccuracy}%</div>
            <p className="text-xs text-muted-foreground">
              {t('analytics.accuracyDescription', 'Average correct answers')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('analytics.currentStreak', 'Current Streak')}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.currentStreak}</div>
            <p className="text-xs text-muted-foreground">
              {t('analytics.streakDescription', 'Days in a row')}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">{t('analytics.overview', 'Overview')}</TabsTrigger>
          <TabsTrigger value="progress">{t('analytics.progress', 'Progress')}</TabsTrigger>
          <TabsTrigger value="topics">{t('analytics.topics', 'Topics')}</TabsTrigger>
          <TabsTrigger value="performance">{t('analytics.performance', 'Performance')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.weeklyProgress', 'Weekly Progress')}</CardTitle>
                <CardDescription>
                  {t('analytics.weeklyDescription', 'Your learning activity this week')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats.weeklyProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="sessions" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="accuracy" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.monthlyProgress', 'Monthly Progress')}</CardTitle>
                <CardDescription>
                  {t('analytics.monthlyDescription', 'Learning time and cards per month')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.monthlyProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="totalTime" fill="#8884d8" />
                    <Bar dataKey="totalCards" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.learningStreak', 'Learning Streak')}</CardTitle>
              <CardDescription>
                {t('analytics.streakDescription', 'Maintain your daily learning habit')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('analytics.currentStreak', 'Current Streak')}</span>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {stats.currentStreak} {t('analytics.days', 'days')}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('analytics.longestStreak', 'Longest Streak')}</span>
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {stats.longestStreak} {t('analytics.days', 'days')}
                </Badge>
              </div>
              <Progress value={(stats.currentStreak / stats.longestStreak) * 100} className="w-full" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="topics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.topicsStudied', 'Topics Studied')}</CardTitle>
              <CardDescription>
                {t('analytics.topicsDescription', 'Distribution of your learning focus')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={stats.topicsStudied.map((topic, index) => ({
                          name: topic,
                          value: Math.floor(Math.random() * 30) + 10
                        }))}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {stats.topicsStudied.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {stats.topicsStudied.map((topic, index) => (
                    <div key={topic} className="flex items-center justify-between">
                      <span className="text-sm">{topic}</span>
                      <Badge variant="outline">{Math.floor(Math.random() * 30) + 10}%</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.performanceMetrics', 'Performance Metrics')}</CardTitle>
              <CardDescription>
                {t('analytics.performanceDescription', 'Detailed analysis of your learning performance')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.averageAccuracy}%</div>
                  <div className="text-sm text-gray-600">{t('analytics.averageAccuracy', 'Average Accuracy')}</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalCards}</div>
                  <div className="text-sm text-gray-600">{t('analytics.totalCards', 'Total Cards')}</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{formatTime(stats.totalTime)}</div>
                  <div className="text-sm text-gray-600">{t('analytics.totalTime', 'Total Time')}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
