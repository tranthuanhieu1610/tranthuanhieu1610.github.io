'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Eye, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { QuestionType, DifficultyLevel } from '@/types/question';

export default function UploadQuestionPage() {
  const [formData, setFormData] = useState({
    type: '' as QuestionType | '',
    section: '',
    difficulty: '' as DifficultyLevel | '',
    passage: '',
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: '',
    explanation: '',
    tags: '',
    source: '',
    desmosRequired: false,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // TODO: Implement Firestore upload
      // For now, just simulate upload
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(true);
      // Reset form
      setFormData({
        type: '',
        section: '',
        difficulty: '',
        passage: '',
        question: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: '',
        explanation: '',
        tags: '',
        source: '',
        desmosRequired: false,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to upload question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Upload SAT Question</h1>
          <p className="text-muted-foreground mt-2">
            Add a new question to the question bank using markdown format
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <Alert className="border-green-500 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600">
              Question uploaded successfully!
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Question Information</CardTitle>
              <CardDescription>Basic metadata about the question</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Question Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, type: value as QuestionType })
                    }
                    required
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reading">Reading</SelectItem>
                      <SelectItem value="writing">Writing & Language</SelectItem>
                      <SelectItem value="math_no_calc">Math (No Calculator)</SelectItem>
                      <SelectItem value="math_calc">Math (Calculator)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty *</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) =>
                      setFormData({ ...formData, difficulty: value as DifficultyLevel })
                    }
                    required
                  >
                    <SelectTrigger id="difficulty">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="section">Section</Label>
                  <Input
                    id="section"
                    placeholder="e.g., Module 1"
                    value={formData.section}
                    onChange={(e) =>
                      setFormData({ ...formData, section: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    placeholder="e.g., algebra, equations, word-problems"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <Input
                    id="source"
                    placeholder="e.g., Official Practice Test 1"
                    value={formData.source}
                    onChange={(e) =>
                      setFormData({ ...formData, source: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="desmosRequired"
                  checked={formData.desmosRequired}
                  onChange={(e) =>
                    setFormData({ ...formData, desmosRequired: e.target.checked })
                  }
                  className="rounded border-gray-300"
                />
                <Label htmlFor="desmosRequired" className="cursor-pointer">
                  Desmos Calculator Required
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Question Content */}
          <Card>
            <CardHeader>
              <CardTitle>Question Content</CardTitle>
              <CardDescription>
                Use markdown formatting for rich text
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="edit" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="edit">Edit</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>

                <TabsContent value="edit" className="space-y-4 mt-4">
                  {/* Passage (optional for Reading) */}
                  <div className="space-y-2">
                    <Label htmlFor="passage">
                      Passage (Optional - for Reading questions)
                    </Label>
                    <Textarea
                      id="passage"
                      placeholder="Enter the reading passage in markdown format..."
                      value={formData.passage}
                      onChange={(e) =>
                        setFormData({ ...formData, passage: e.target.value })
                      }
                      rows={8}
                      className="font-mono text-sm"
                    />
                  </div>

                  {/* Question */}
                  <div className="space-y-2">
                    <Label htmlFor="question">Question Text *</Label>
                    <Textarea
                      id="question"
                      placeholder="Enter the question in markdown format..."
                      value={formData.question}
                      onChange={(e) =>
                        setFormData({ ...formData, question: e.target.value })
                      }
                      rows={4}
                      required
                      className="font-mono text-sm"
                    />
                  </div>

                  {/* Answer Options */}
                  <div className="space-y-3">
                    <Label>Answer Options *</Label>
                    <div className="grid gap-3">
                      {['A', 'B', 'C', 'D'].map((option) => (
                        <div key={option} className="flex items-start gap-2">
                          <Badge variant="outline" className="mt-2">
                            {option}
                          </Badge>
                          <Textarea
                            placeholder={`Option ${option} (markdown supported)`}
                            value={formData[`option${option}` as keyof typeof formData] as string}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                [`option${option}`]: e.target.value,
                              })
                            }
                            rows={2}
                            required
                            className="flex-1 font-mono text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Correct Answer */}
                  <div className="space-y-2">
                    <Label htmlFor="correctAnswer">Correct Answer *</Label>
                    <Select
                      value={formData.correctAnswer}
                      onValueChange={(value) =>
                        setFormData({ ...formData, correctAnswer: value })
                      }
                      required
                    >
                      <SelectTrigger id="correctAnswer">
                        <SelectValue placeholder="Select correct answer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">Option A</SelectItem>
                        <SelectItem value="B">Option B</SelectItem>
                        <SelectItem value="C">Option C</SelectItem>
                        <SelectItem value="D">Option D</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Explanation */}
                  <div className="space-y-2">
                    <Label htmlFor="explanation">Explanation *</Label>
                    <Textarea
                      id="explanation"
                      placeholder="Explain why the answer is correct (markdown supported)..."
                      value={formData.explanation}
                      onChange={(e) =>
                        setFormData({ ...formData, explanation: e.target.value })
                      }
                      rows={6}
                      required
                      className="font-mono text-sm"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="preview" className="mt-4">
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-muted-foreground text-center py-8">
                        Markdown preview coming soon...
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button type="submit" disabled={loading} size="lg">
              {loading ? (
                <>Uploading...</>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Question
                </>
              )}
            </Button>
            <Button type="button" variant="outline" size="lg">
              <Save className="mr-2 h-4 w-4" />
              Save as Draft
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
