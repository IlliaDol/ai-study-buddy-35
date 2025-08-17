import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Plus, MessageCircle, BookOpen, Target, Calendar, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  topic: string;
  memberCount: number;
  maxMembers: number;
  isPublic: boolean;
  createdAt: string;
  lastActivity: string;
  members: Array<{
    id: string;
    name: string;
    avatar: string;
    role: 'admin' | 'moderator' | 'member';
    lastSeen: string;
  }>;
  topics: string[];
}

export const StudyGroups: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    topic: '',
    isPublic: true,
    maxMembers: 20
  });

  // Mock data
  const myGroups: StudyGroup[] = [
    {
      id: '1',
      name: 'JavaScript Masters',
      description: 'Advanced JavaScript concepts and modern frameworks',
      topic: 'JavaScript',
      memberCount: 15,
      maxMembers: 25,
      isPublic: true,
      createdAt: '2024-01-15',
      lastActivity: '2 hours ago',
      topics: ['ES6+', 'React', 'Node.js', 'TypeScript'],
      members: [
        { id: '1', name: 'Alex', avatar: '', role: 'admin', lastSeen: '2 hours ago' },
        { id: '2', name: 'Maria', avatar: '', role: 'moderator', lastSeen: '1 hour ago' },
        { id: '3', name: 'John', avatar: '', role: 'member', lastSeen: '30 min ago' }
      ]
    },
    {
      id: '2',
      name: 'Python Beginners',
      description: 'Learn Python from scratch with hands-on projects',
      topic: 'Python',
      memberCount: 8,
      maxMembers: 15,
      isPublic: true,
      createdAt: '2024-02-01',
      lastActivity: '1 day ago',
      topics: ['Basics', 'Data Structures', 'OOP', 'Web Development'],
      members: [
        { id: '1', name: 'Alex', avatar: '', role: 'admin', lastSeen: '1 day ago' },
        { id: '4', name: 'Sarah', avatar: '', role: 'member', lastSeen: '2 days ago' }
      ]
    }
  ];

  const publicGroups: StudyGroup[] = [
    {
      id: '3',
      name: 'React Developers',
      description: 'Share React tips, tricks, and best practices',
      topic: 'React',
      memberCount: 45,
      maxMembers: 50,
      isPublic: true,
      createdAt: '2023-12-01',
      lastActivity: '30 min ago',
      topics: ['Hooks', 'Context', 'Performance', 'Testing'],
      members: []
    },
    {
      id: '4',
      name: 'Data Science',
      description: 'Machine learning, statistics, and data analysis',
      topic: 'Data Science',
      memberCount: 32,
      maxMembers: 40,
      isPublic: true,
      createdAt: '2023-11-15',
      lastActivity: '1 hour ago',
      topics: ['ML', 'Statistics', 'Python', 'R'],
      members: []
    }
  ];

  const handleCreateGroup = () => {
    // Here you would typically make an API call
    console.log('Creating group:', newGroup);
    setShowCreateDialog(false);
    setNewGroup({ name: '', description: '', topic: '', isPublic: true, maxMembers: 20 });
  };

  const filteredPublicGroups = publicGroups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* My Groups */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('social.myGroups', 'My Groups')}
          </h2>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {t('social.createGroup', 'Create Group')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{t('social.createNewGroup', 'Create New Study Group')}</DialogTitle>
                <DialogDescription>
                  {t('social.createGroupDescription', 'Start a new study group and invite friends to learn together.')}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">{t('social.groupName', 'Group Name')}</Label>
                  <Input
                    id="name"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                    placeholder={t('social.groupNamePlaceholder', 'Enter group name')}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">{t('social.description', 'Description')}</Label>
                  <Textarea
                    id="description"
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                    placeholder={t('social.descriptionPlaceholder', 'Describe what this group will study')}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="topic">{t('social.topic', 'Main Topic')}</Label>
                  <Input
                    id="topic"
                    value={newGroup.topic}
                    onChange={(e) => setNewGroup({ ...newGroup, topic: e.target.value })}
                    placeholder={t('social.topicPlaceholder', 'e.g., JavaScript, Python, Math')}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="maxMembers">{t('social.maxMembers', 'Maximum Members')}</Label>
                  <Select
                    value={newGroup.maxMembers.toString()}
                    onValueChange={(value) => setNewGroup({ ...newGroup, maxMembers: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="15">15</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="30">30</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  {t('common.cancel', 'Cancel')}
                </Button>
                <Button onClick={handleCreateGroup}>
                  {t('social.createGroup', 'Create Group')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myGroups.map((group) => (
            <Card key={group.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <CardDescription className="mt-2">{group.description}</CardDescription>
                  </div>
                  <Badge variant={group.isPublic ? 'default' : 'secondary'}>
                    {group.isPublic ? t('social.public', 'Public') : t('social.private', 'Private')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <BookOpen className="h-4 w-4" />
                  <span>{group.topic}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Users className="h-4 w-4" />
                  <span>{group.memberCount}/{group.maxMembers} {t('social.members', 'members')}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>{t('social.lastActivity', 'Last activity')}: {group.lastActivity}</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {group.topics.slice(0, 3).map((topic) => (
                    <Badge key={topic} variant="outline" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                  {group.topics.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{group.topics.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" className="flex-1">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {t('social.chat', 'Chat')}
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <BookOpen className="h-4 w-4 mr-2" />
                    {t('social.study', 'Study')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Public Groups */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('social.publicGroups', 'Public Groups')}
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t('social.searchGroups', 'Search groups...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPublicGroups.map((group) => (
            <Card key={group.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <CardDescription className="mt-2">{group.description}</CardDescription>
                  </div>
                  <Badge variant="default">
                    {t('social.public', 'Public')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <BookOpen className="h-4 w-4" />
                  <span>{group.topic}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Users className="h-4 w-4" />
                  <span>{group.memberCount}/{group.maxMembers} {t('social.members', 'members')}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>{t('social.lastActivity', 'Last activity')}: {group.lastActivity}</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {group.topics.slice(0, 3).map((topic) => (
                    <Badge key={topic} variant="outline" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                  {group.topics.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{group.topics.length - 3}
                    </Badge>
                  )}
                </div>

                <Button className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  {t('social.joinGroup', 'Join Group')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
