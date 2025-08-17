import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Plus, MessageCircle, BookOpen, Target, TrendingUp, Search, Trophy, Clock, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'studying';
  currentTopic: string;
  progress: number;
  streak: number;
  totalXP: number;
  lastSeen: string;
  isStudying: boolean;
  studySession?: {
    topic: string;
    duration: number;
    cardsStudied: number;
  };
}

interface StudyActivity {
  id: string;
  friendId: string;
  friendName: string;
  friendAvatar: string;
  action: 'completed_quiz' | 'finished_session' | 'achieved_streak' | 'joined_group';
  topic: string;
  details: string;
  timestamp: string;
}

export const FriendsLearning: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('friends');

  // Mock data
  const friends: Friend[] = [
    {
      id: '1',
      name: 'Maria Garcia',
      avatar: '',
      status: 'studying',
      currentTopic: 'React Hooks',
      progress: 75,
      streak: 15,
      totalXP: 2840,
      lastSeen: '2 minutes ago',
      isStudying: true,
      studySession: {
        topic: 'React Hooks',
        duration: 45,
        cardsStudied: 23
      }
    },
    {
      id: '2',
      name: 'Alex Chen',
      avatar: '',
      status: 'online',
      currentTopic: 'TypeScript',
      progress: 60,
      streak: 8,
      totalXP: 1920,
      lastSeen: '5 minutes ago',
      isStudying: false
    },
    {
      id: '3',
      name: 'Sarah Johnson',
      avatar: '',
      status: 'offline',
      currentTopic: 'Python Basics',
      progress: 90,
      streak: 22,
      totalXP: 3560,
      lastSeen: '2 hours ago',
      isStudying: false
    },
    {
      id: '4',
      name: 'David Kim',
      avatar: '',
      status: 'studying',
      currentTopic: 'Node.js',
      progress: 45,
      streak: 12,
      totalXP: 1680,
      lastSeen: '1 minute ago',
      isStudying: true,
      studySession: {
        topic: 'Node.js',
        duration: 30,
        cardsStudied: 15
      }
    }
  ];

  const studyActivities: StudyActivity[] = [
    {
      id: '1',
      friendId: '1',
      friendName: 'Maria Garcia',
      friendAvatar: '',
      action: 'completed_quiz',
      topic: 'React Hooks',
      details: 'Scored 95% on React Hooks quiz',
      timestamp: '2 minutes ago'
    },
    {
      id: '2',
      friendId: '2',
      friendName: 'Alex Chen',
      friendAvatar: '',
      action: 'achieved_streak',
      topic: 'TypeScript',
      details: 'Reached 8-day learning streak!',
      timestamp: '15 minutes ago'
    },
    {
      id: '3',
      friendId: '3',
      friendName: 'Sarah Johnson',
      friendAvatar: '',
      action: 'finished_session',
      topic: 'Python Basics',
      details: 'Completed 2-hour study session',
      timestamp: '1 hour ago'
    },
    {
      id: '4',
      friendId: '4',
      friendName: 'David Kim',
      friendAvatar: '',
      action: 'joined_group',
      topic: 'Node.js',
      details: 'Joined "Advanced Node.js" study group',
      timestamp: '2 hours ago'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'studying': return 'bg-blue-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return t('social.online', 'Online');
      case 'studying': return t('social.studying', 'Studying');
      case 'offline': return t('social.offline', 'Offline');
      default: return t('social.offline', 'Offline');
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'completed_quiz': return <Target className="h-4 w-4" />;
      case 'finished_session': return <BookOpen className="h-4 w-4" />;
      case 'achieved_streak': return <TrendingUp className="h-4 w-4" />;
      case 'joined_group': return <Users className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'completed_quiz': return 'text-green-600';
      case 'finished_session': return 'text-blue-600';
      case 'achieved_streak': return 'text-purple-600';
      case 'joined_group': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.currentTopic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="friends">{t('social.friends', 'Friends')}</TabsTrigger>
          <TabsTrigger value="activity">{t('social.activity', 'Activity Feed')}</TabsTrigger>
        </TabsList>

        <TabsContent value="friends" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('social.friends', 'Friends')}
            </h2>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t('social.searchFriends', 'Search friends...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {t('social.addFriend', 'Add Friend')}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFriends.map((friend) => (
              <Card key={friend.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={friend.avatar} />
                          <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${getStatusColor(friend.status)}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{friend.name}</CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {getStatusText(friend.status)}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {friend.streak} {t('social.days', 'days')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {t('social.currentTopic', 'Current Topic')}:
                      </span>
                      <span className="font-medium">{friend.currentTopic}</span>
                    </div>
                    <Progress value={friend.progress} className="w-full" />
                    <div className="text-xs text-gray-500 text-right">
                      {friend.progress}% {t('social.complete', 'complete')}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {t('social.totalXP', 'Total XP')}:
                    </span>
                    <span className="font-medium">{friend.totalXP.toLocaleString()}</span>
                  </div>

                  {friend.isStudying && friend.studySession && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300 mb-2">
                        <BookOpen className="h-4 w-4" />
                        <span className="font-medium">{t('social.currentlyStudying', 'Currently Studying')}</span>
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
                        <div>{t('social.topic', 'Topic')}: {friend.studySession.topic}</div>
                        <div>{t('social.duration', 'Duration')}: {friend.studySession.duration} {t('social.minutes', 'min')}</div>
                        <div>{t('social.cardsStudied', 'Cards Studied')}: {friend.studySession.cardsStudied}</div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Button size="sm" className="flex-1">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {t('social.message', 'Message')}
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <BookOpen className="h-4 w-4 mr-2" />
                      {t('social.studyTogether', 'Study Together')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('social.activityFeed', 'Activity Feed')}
          </h2>
          
          <div className="space-y-4">
            {studyActivities.map((activity) => (
              <Card key={activity.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={activity.friendAvatar} />
                      <AvatarFallback>{activity.friendName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{activity.friendName}</span>
                        <span className={`flex items-center gap-1 text-sm ${getActionColor(activity.action)}`}>
                          {getActionIcon(activity.action)}
                          {activity.details}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {activity.topic}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {activity.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
