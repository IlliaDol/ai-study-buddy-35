import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Users, Target, TrendingUp, Star, Medal, Search, Filter, Calendar, BookOpen, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar: string;
  score: number;
  maxScore: number;
  progress: number;
  streak: number;
  totalXP: number;
  topicsStudied: string[];
  lastActive: string;
  achievements: string[];
}

interface LeaderboardCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  entries: LeaderboardEntry[];
}

export const Leaderboard: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overall');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [topicFilter, setTopicFilter] = useState('all');

  // Mock data
  const leaderboardData: LeaderboardCategory[] = [
    {
      id: 'overall',
      name: t('social.overall', 'Overall'),
      description: t('social.overallDescription', 'Best performers across all topics'),
      icon: <Trophy className="h-5 w-5" />,
      entries: [
        {
          rank: 1,
          userId: '1',
          name: 'Maria Garcia',
          avatar: '',
          score: 95,
          maxScore: 100,
          progress: 95,
          streak: 23,
          totalXP: 4560,
          topicsStudied: ['JavaScript', 'React', 'Node.js'],
          lastActive: '2 minutes ago',
          achievements: ['Perfect Score', 'Streak Master', 'Topic Explorer']
        },
        {
          rank: 2,
          userId: '2',
          name: 'Alex Chen',
          avatar: '',
          score: 92,
          maxScore: 100,
          progress: 92,
          streak: 18,
          totalXP: 3980,
          topicsStudied: ['TypeScript', 'React', 'Python'],
          lastActive: '5 minutes ago',
          achievements: ['High Achiever', 'Consistent Learner']
        },
        {
          rank: 3,
          userId: '3',
          name: 'Sarah Johnson',
          avatar: '',
          score: 89,
          maxScore: 100,
          progress: 89,
          streak: 22,
          totalXP: 3720,
          topicsStudied: ['Python', 'Data Science', 'Machine Learning'],
          lastActive: '1 hour ago',
          achievements: ['Streak Master', 'Data Wizard']
        },
        {
          rank: 4,
          userId: '4',
          name: 'David Kim',
          avatar: '',
          score: 87,
          maxScore: 100,
          progress: 87,
          streak: 15,
          totalXP: 3240,
          topicsStudied: ['Node.js', 'JavaScript', 'TypeScript'],
          lastActive: '30 minutes ago',
          achievements: ['Backend Expert', 'Fast Learner']
        },
        {
          rank: 5,
          userId: '5',
          name: 'Emma Wilson',
          avatar: '',
          score: 85,
          maxScore: 100,
          progress: 85,
          streak: 12,
          totalXP: 2980,
          topicsStudied: ['React', 'CSS', 'HTML'],
          lastActive: '2 hours ago',
          achievements: ['Frontend Specialist', 'Design Enthusiast']
        }
      ]
    },
    {
      id: 'javascript',
      name: 'JavaScript',
      description: t('social.javascriptDescription', 'JavaScript experts and learners'),
      icon: <BookOpen className="h-5 w-5" />,
      entries: [
        {
          rank: 1,
          userId: '1',
          name: 'Maria Garcia',
          avatar: '',
          score: 98,
          maxScore: 100,
          progress: 98,
          streak: 23,
          totalXP: 4560,
          topicsStudied: ['JavaScript', 'React', 'Node.js'],
          lastActive: '2 minutes ago',
          achievements: ['JavaScript Master', 'Perfect Score']
        },
        {
          rank: 2,
          userId: '4',
          name: 'David Kim',
          avatar: '',
          score: 94,
          maxScore: 100,
          progress: 94,
          streak: 15,
          totalXP: 3240,
          topicsStudied: ['Node.js', 'JavaScript', 'TypeScript'],
          lastActive: '30 minutes ago',
          achievements: ['JavaScript Expert', 'Backend Developer']
        }
      ]
    },
    {
      id: 'python',
      name: 'Python',
      description: t('social.pythonDescription', 'Python programming champions'),
      icon: <BookOpen className="h-5 w-5" />,
      entries: [
        {
          rank: 1,
          userId: '3',
          name: 'Sarah Johnson',
          avatar: '',
          score: 96,
          maxScore: 100,
          progress: 96,
          streak: 22,
          totalXP: 3720,
          topicsStudied: ['Python', 'Data Science', 'Machine Learning'],
          lastActive: '1 hour ago',
          achievements: ['Python Master', 'Data Scientist']
        },
        {
          rank: 2,
          userId: '2',
          name: 'Alex Chen',
          avatar: '',
          score: 91,
          maxScore: 100,
          progress: 91,
          streak: 18,
          totalXP: 3980,
          topicsStudied: ['TypeScript', 'React', 'Python'],
          lastActive: '5 minutes ago',
          achievements: ['Python Developer', 'Multi-language Expert']
        }
      ]
    },
    {
      id: 'streaks',
      name: t('social.streaks', 'Learning Streaks'),
      description: t('social.streaksDescription', 'Longest learning streaks'),
      icon: <TrendingUp className="h-5 w-5" />,
      entries: [
        {
          rank: 1,
          userId: '1',
          name: 'Maria Garcia',
          avatar: '',
          score: 23,
          maxScore: 30,
          progress: 77,
          streak: 23,
          totalXP: 4560,
          topicsStudied: ['JavaScript', 'React', 'Node.js'],
          lastActive: '2 minutes ago',
          achievements: ['Streak Master', 'Consistent Learner']
        },
        {
          rank: 2,
          userId: '3',
          name: 'Sarah Johnson',
          avatar: '',
          score: 22,
          maxScore: 30,
          progress: 73,
          streak: 22,
          totalXP: 3720,
          topicsStudied: ['Python', 'Data Science', 'Machine Learning'],
          lastActive: '1 hour ago',
          achievements: ['Streak Master', 'Dedicated Learner']
        }
      ]
    }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Medal className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Medal className="h-6 w-6 text-orange-500" />;
      default: return <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium">
        {rank}
      </div>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 2: return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
      case 3: return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
      default: return '';
    }
  };

  const filteredEntries = leaderboardData
    .find(cat => cat.id === activeTab)?.entries
    .filter(entry => 
      entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.topicsStudied.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()))
    ) || [];

  const currentCategory = leaderboardData.find(cat => cat.id === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('social.leaderboard', 'Leaderboard')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('social.leaderboardDescription', 'See how you rank among other learners')}
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t('social.searchUsers', 'Search users...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('social.allTime', 'All Time')}</SelectItem>
              <SelectItem value="week">{t('social.thisWeek', 'This Week')}</SelectItem>
              <SelectItem value="month">{t('social.thisMonth', 'This Month')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          {leaderboardData.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
              {category.icon}
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {leaderboardData.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {category.name} {t('social.leaderboard', 'Leaderboard')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {category.description}
              </p>
            </div>

            <div className="space-y-3">
              {filteredEntries.map((entry) => (
                <Card 
                  key={entry.userId} 
                  className={`hover:shadow-md transition-shadow ${getRankColor(entry.rank)}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12">
                        {getRankIcon(entry.rank)}
                      </div>
                      
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={entry.avatar} />
                        <AvatarFallback className="text-lg">{entry.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-lg">{entry.name}</h4>
                          {entry.achievements.slice(0, 2).map((achievement, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {achievement}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            <span>{entry.score}/{entry.maxScore} ({entry.progress}%)</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" />
                            <span>{entry.streak} {t('social.days', 'days')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            <span>{entry.totalXP.toLocaleString()} XP</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            <span>{entry.topicsStudied.slice(0, 3).join(', ')}</span>
                            {entry.topicsStudied.length > 3 && (
                              <span>+{entry.topicsStudied.length - 3}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{entry.lastActive}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <Button size="sm" variant="outline">
                          <Users className="h-4 w-4 mr-2" />
                          {t('social.viewProfile', 'View')}
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          {t('social.message', 'Message')}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredEntries.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 dark:text-gray-400">
                  {t('social.noResults', 'No results found')}
                </div>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Your Position */}
      {currentCategory && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              {t('social.yourPosition', 'Your Position')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium">
                    #7
                  </div>
                </div>
                <div>
                  <div className="font-semibold">You</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {t('social.score', 'Score')}: 82/100 (82%)
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t('social.distanceToNext', 'Distance to next rank')}
                </div>
                <div className="font-semibold text-blue-600">3 points</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
