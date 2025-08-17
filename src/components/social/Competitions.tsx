import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Users, Clock, Target, TrendingUp, Star, Award, Calendar, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Competition {
  id: string;
  name: string;
  description: string;
  topic: string;
  type: 'quiz' | 'streak' | 'speed' | 'accuracy';
  status: 'upcoming' | 'active' | 'completed';
  startDate: string;
  endDate: string;
  participants: number;
  maxParticipants: number;
  prize: string;
  leaderboard: Array<{
    rank: number;
    userId: string;
    name: string;
    avatar: string;
    score: number;
    maxScore: number;
    progress: number;
  }>;
  myRank?: number;
  myScore?: number;
  myProgress?: number;
}

export const Competitions: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('active');

  // Mock data
  const competitions: Competition[] = [
    {
      id: '1',
      name: 'JavaScript Speed Challenge',
      description: 'Complete JavaScript quizzes as fast as possible while maintaining accuracy',
      topic: 'JavaScript',
      type: 'speed',
      status: 'active',
      startDate: '2024-01-15',
      endDate: '2024-01-22',
      participants: 156,
      maxParticipants: 200,
      prize: 'Premium subscription for 3 months',
      leaderboard: [
        { rank: 1, userId: '1', name: 'Maria Garcia', avatar: '', score: 95, maxScore: 100, progress: 95 },
        { rank: 2, userId: '2', name: 'Alex Chen', avatar: '', score: 92, maxScore: 100, progress: 92 },
        { rank: 3, userId: '3', name: 'Sarah Johnson', avatar: '', score: 89, maxScore: 100, progress: 89 },
        { rank: 4, userId: '4', name: 'David Kim', avatar: '', score: 87, maxScore: 100, progress: 87 },
        { rank: 5, userId: '5', name: 'Emma Wilson', avatar: '', score: 85, maxScore: 100, progress: 85 }
      ],
      myRank: 7,
      myScore: 82,
      myProgress: 82
    },
    {
      id: '2',
      name: 'Python Streak Master',
      description: 'Maintain the longest learning streak in Python topics',
      topic: 'Python',
      type: 'streak',
      status: 'active',
      startDate: '2024-01-10',
      endDate: '2024-02-10',
      participants: 89,
      maxParticipants: 100,
      prize: 'Exclusive Python course bundle',
      leaderboard: [
        { rank: 1, userId: '6', name: 'Mike Brown', avatar: '', score: 23, maxScore: 30, progress: 77 },
        { rank: 2, userId: '7', name: 'Lisa Davis', avatar: '', score: 21, maxScore: 30, progress: 70 },
        { rank: 3, userId: '8', name: 'Tom Wilson', avatar: '', score: 19, maxScore: 30, progress: 63 },
        { rank: 4, userId: '9', name: 'Anna Lee', avatar: '', score: 18, maxScore: 30, progress: 60 },
        { rank: 5, userId: '10', name: 'Chris Taylor', avatar: '', score: 17, maxScore: 30, progress: 57 }
      ],
      myRank: 12,
      myScore: 15,
      myProgress: 50
    },
    {
      id: '3',
      name: 'React Quiz Championship',
      description: 'Test your React knowledge in this comprehensive quiz competition',
      topic: 'React',
      type: 'quiz',
      status: 'upcoming',
      startDate: '2024-01-25',
      endDate: '2024-01-26',
      participants: 45,
      maxParticipants: 150,
      prize: 'React Developer certification',
      leaderboard: [],
      myRank: undefined,
      myScore: undefined,
      myProgress: undefined
    },
    {
      id: '4',
      name: 'TypeScript Accuracy Challenge',
      description: 'Achieve the highest accuracy in TypeScript assessments',
      topic: 'TypeScript',
      type: 'accuracy',
      status: 'completed',
      startDate: '2024-01-01',
      endDate: '2024-01-08',
      participants: 120,
      maxParticipants: 120,
      prize: 'TypeScript handbook + Premium features',
      leaderboard: [
        { rank: 1, userId: '11', name: 'James Miller', avatar: '', score: 98, maxScore: 100, progress: 98 },
        { rank: 2, userId: '12', name: 'Sophie Chen', avatar: '', score: 96, maxScore: 100, progress: 96 },
        { rank: 3, userId: '13', name: 'Ryan Garcia', avatar: '', score: 95, maxScore: 100, progress: 95 },
        { rank: 4, userId: '14', name: 'Nina Patel', avatar: '', score: 93, maxScore: 100, progress: 93 },
        { rank: 5, userId: '15', name: 'Kevin Zhang', avatar: '', score: 91, maxScore: 100, progress: 91 }
      ],
      myRank: 8,
      myScore: 88,
      myProgress: 88
    }
  ];

  const getCompetitionTypeIcon = (type: string) => {
    switch (type) {
      case 'quiz': return <Target className="h-4 w-4" />;
      case 'streak': return <TrendingUp className="h-4 w-4" />;
      case 'speed': return <Zap className="h-4 w-4" />;
      case 'accuracy': return <Star className="h-4 w-4" />;
      default: return <Trophy className="h-4 w-4" />;
    }
  };

  const getCompetitionTypeColor = (type: string) => {
    switch (type) {
      case 'quiz': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'streak': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'speed': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'accuracy': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'upcoming': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return t('social.active', 'Active');
      case 'upcoming': return t('social.upcoming', 'Upcoming');
      case 'completed': return t('social.completed', 'Completed');
      default: return status;
    }
  };

  const activeCompetitions = competitions.filter(c => c.status === 'active');
  const upcomingCompetitions = competitions.filter(c => c.status === 'upcoming');
  const completedCompetitions = competitions.filter(c => c.status === 'completed');

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">{t('social.active', 'Active')}</TabsTrigger>
          <TabsTrigger value="upcoming">{t('social.upcoming', 'Upcoming')}</TabsTrigger>
          <TabsTrigger value="completed">{t('social.completed', 'Completed')}</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeCompetitions.map((competition) => (
              <Card key={competition.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        <CardTitle className="text-xl">{competition.name}</CardTitle>
                      </div>
                      <CardDescription>{competition.description}</CardDescription>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge className={getStatusColor(competition.status)}>
                        {getStatusText(competition.status)}
                      </Badge>
                      <Badge className={getCompetitionTypeColor(competition.type)}>
                        {getCompetitionTypeIcon(competition.type)}
                        {competition.type.charAt(0).toUpperCase() + competition.type.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>{competition.participants}/{competition.maxParticipants}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{t('social.ends', 'Ends')} {competition.endDate}</span>
                    </div>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                      <Award className="h-4 w-4" />
                      <span className="font-medium">{t('social.prize', 'Prize')}:</span>
                      <span>{competition.prize}</span>
                    </div>
                  </div>

                  {competition.myRank && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {t('social.yourRank', 'Your Rank')}:
                        </span>
                        <span className="font-medium">#{competition.myRank}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {t('social.yourScore', 'Your Score')}:
                        </span>
                        <span className="font-medium">{competition.myScore}/{competition.maxScore}</span>
                      </div>
                      <Progress value={competition.myProgress} className="w-full" />
                    </div>
                  )}

                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">{t('social.topParticipants', 'Top Participants')}</h4>
                    <div className="space-y-2">
                      {competition.leaderboard.slice(0, 3).map((participant) => (
                        <div key={participant.userId} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium">
                              {participant.rank}
                            </div>
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={participant.avatar} />
                              <AvatarFallback className="text-xs">{participant.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{participant.name}</span>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {participant.score}/{participant.maxScore}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <Target className="h-4 w-4 mr-2" />
                      {t('social.participate', 'Participate')}
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Users className="h-4 w-4 mr-2" />
                      {t('social.viewLeaderboard', 'View All')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {upcomingCompetitions.map((competition) => (
              <Card key={competition.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-blue-500" />
                        <CardTitle className="text-xl">{competition.name}</CardTitle>
                      </div>
                      <CardDescription>{competition.description}</CardDescription>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge className={getStatusColor(competition.status)}>
                        {getStatusText(competition.status)}
                      </Badge>
                      <Badge className={getCompetitionTypeColor(competition.type)}>
                        {getCompetitionTypeIcon(competition.type)}
                        {competition.type.charAt(0).toUpperCase() + competition.type.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>{competition.participants}/{competition.maxParticipants}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{t('social.starts', 'Starts')} {competition.startDate}</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                      <Award className="h-4 w-4" />
                      <span className="font-medium">{t('social.prize', 'Prize')}:</span>
                      <span>{competition.prize}</span>
                    </div>
                  </div>

                  <Button className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    {t('social.joinCompetition', 'Join Competition')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {completedCompetitions.map((competition) => (
              <Card key={competition.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-gray-500" />
                        <CardTitle className="text-xl">{competition.name}</CardTitle>
                      </div>
                      <CardDescription>{competition.description}</CardDescription>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge className={getStatusColor(competition.status)}>
                        {getStatusText(competition.status)}
                      </Badge>
                      <Badge className={getCompetitionTypeColor(competition.type)}>
                        {getCompetitionTypeIcon(competition.type)}
                        {competition.type.charAt(0).toUpperCase() + competition.type.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>{competition.participants} {t('social.participants', 'participants')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{t('social.ended', 'Ended')} {competition.endDate}</span>
                    </div>
                  </div>

                  {competition.myRank && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {t('social.yourFinalRank', 'Your Final Rank')}:
                        </span>
                        <span className="font-medium">#{competition.myRank}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {t('social.yourFinalScore', 'Your Final Score')}:
                        </span>
                        <span className="font-medium">{competition.myScore}/{competition.maxScore}</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">{t('social.winners', 'Winners')}</h4>
                    <div className="space-y-2">
                      {competition.leaderboard.slice(0, 3).map((participant) => (
                        <div key={participant.userId} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                              participant.rank === 1 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                              participant.rank === 2 ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' :
                              participant.rank === 3 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                            }`}>
                              {participant.rank}
                            </div>
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={participant.avatar} />
                              <AvatarFallback className="text-xs">{participant.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{participant.name}</span>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {participant.score}/{participant.maxScore}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    {t('social.viewResults', 'View Full Results')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
