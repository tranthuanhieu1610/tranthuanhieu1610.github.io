'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, BookOpen, Target, TrendingUp } from 'lucide-react';
import { Question } from '@/types/question';
import { getAllQuestions } from '@/lib/questions';

export default function PracticePage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const data = await getAllQuestions();
      setQuestions(data);
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesType = filterType === 'all' || q.type === filterType;
    const matchesDifficulty = filterDifficulty === 'all' || q.difficulty === filterDifficulty;
    return matchesType && matchesDifficulty;
  });

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      reading: 'bg-blue-100 text-blue-800 border-blue-200',
      writing: 'bg-green-100 text-green-800 border-green-200',
      math_no_calc: 'bg-purple-100 text-purple-800 border-purple-200',
      math_calc: 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      easy: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      hard: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  const stats = [
    {
      label: 'Total Questions',
      value: questions.length,
      icon: BookOpen,
      color: 'text-blue-600',
    },
    {
      label: 'Available',
      value: filteredQuestions.length,
      icon: Target,
      color: 'text-green-600',
    },
    {
      label: 'Your Progress',
      value: '0%',
      icon: TrendingUp,
      color: 'text-purple-600',
    },
  ];

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container py-12 space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Practice Questions</h1>
            <p className="text-muted-foreground mt-2">
              Practice SAT questions by type and difficulty
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filter Questions</CardTitle>
              <CardDescription>Choose question type and difficulty</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Question Type</label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="reading">Reading</SelectItem>
                      <SelectItem value="writing">Writing & Language</SelectItem>
                      <SelectItem value="math_no_calc">Math (No Calculator)</SelectItem>
                      <SelectItem value="math_calc">Math (Calculator)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Difficulty</label>
                  <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Difficulties" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Difficulties</SelectItem>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Questions Grid */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Available Questions ({filteredQuestions.length})
              </h2>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
                <p className="text-muted-foreground">Loading questions...</p>
              </div>
            ) : filteredQuestions.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground">
                    {questions.length === 0
                      ? 'No questions available yet. Check back soon!'
                      : 'No questions match your filters. Try different options.'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredQuestions.map((question) => (
                  <Card
                    key={question.id}
                    className="cursor-pointer hover:border-primary transition-all hover:shadow-md"
                    onClick={() => router.push(`/practice/question?id=${question.id}`)}
                  >
                    <CardHeader>
                      <div className="flex gap-2 mb-2">
                        <Badge className={getTypeColor(question.type)}>
                          {question.type.replace('_', ' ')}
                        </Badge>
                        <Badge className={getDifficultyColor(question.difficulty)}>
                          {question.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className="text-base line-clamp-2">
                        {question.content.question}
                      </CardTitle>
                      {question.section && (
                        <CardDescription>{question.section}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {question.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {question.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{question.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                      <Button className="w-full" size="sm">
                        Start Practice
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
