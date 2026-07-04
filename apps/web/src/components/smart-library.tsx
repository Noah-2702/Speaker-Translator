'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Search,
  MessageCircle,
  BookOpen,
  Plus,
  Trash2,
  Clock,
  User,
  ChevronDown,
  Send,
  Loader,
} from 'lucide-react';

interface SermonEntry {
  id: string;
  title: string;
  speaker: string;
  date: Date;
  duration: number;
  languages: string[];
  transcript: string;
  summary?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Organization {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  createdAt: Date;
}

export function SmartLibrary() {
  const [activeTab, setActiveTab] = useState<'library' | 'chat' | 'organizations'>('library');
  const [sermons, setSermons] = useState<SermonEntry[]>([
    {
      id: '1',
      title: 'The Power of Faith',
      speaker: 'Pastor John',
      date: new Date('2026-07-01'),
      duration: 45,
      languages: ['en', 'es', 'fr', 'id'],
      transcript:
        'Good morning, brothers and sisters. Today, we gather to discuss the importance of faith and community. In these challenging times, we must hold onto our beliefs.',
      summary: 'A powerful sermon about maintaining faith during difficult times.',
    },
    {
      id: '2',
      title: 'Community and Service',
      speaker: 'Pastor Sarah',
      date: new Date('2026-06-24'),
      duration: 52,
      languages: ['en', 'es', 'fr'],
      transcript:
        'Service to others is the highest calling. When we help those in need, we reflect the love of God.',
      summary: 'Exploring the importance of community service and compassion.',
    },
  ]);

  const [selectedSermon, setSelectedSermon] = useState<SermonEntry | null>(sermons[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I can help you explore and understand the sermons in our library. What would you like to know?',
      timestamp: new Date(),
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([
    {
      id: '1',
      name: 'Grace Church Downtown',
      description: 'Main campus of Grace Church',
      memberCount: 450,
      createdAt: new Date('2026-01-15'),
    },
    {
      id: '2',
      name: 'Grace Church Uptown',
      description: 'Uptown branch',
      memberCount: 280,
      createdAt: new Date('2026-03-20'),
    },
  ]);
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgDesc, setNewOrgDesc] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSearchSermons = (query: string) => {
    setSearchQuery(query);
    // In production, this would perform semantic search using embeddings
  };

  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || !selectedSermon) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: chatInput,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsLoading(true);

    // Simulate RAG retrieval and LLM response
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockResponses = [
      `Based on "${selectedSermon.title}", the key points include: 1) The importance of maintaining faith during challenging times, 2) The power of community support, and 3) The need for spiritual resilience.`,
      `In this sermon, Pastor ${selectedSermon.speaker} emphasizes that faith is not just a personal belief but a communal practice. The message resonates with themes of hope and perseverance.`,
      `The sermon discusses how we can apply these principles in our daily lives. Key takeaways include: staying connected to your faith community, supporting others in their struggles, and maintaining hope.`,
      `This relates to the concept of spiritual growth through adversity. The sermon suggests that challenges are opportunities to strengthen our faith and deepen our relationships with others.`,
    ];

    const assistantMessage: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      role: 'assistant',
      content: mockResponses[Math.floor(Math.random() * mockResponses.length)],
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleAddOrganization = () => {
    if (!newOrgName.trim()) return;

    const newOrg: Organization = {
      id: `org-${Date.now()}`,
      name: newOrgName,
      description: newOrgDesc,
      memberCount: 0,
      createdAt: new Date(),
    };

    setOrganizations(prev => [...prev, newOrg]);
    setNewOrgName('');
    setNewOrgDesc('');
  };

  const handleDeleteOrganization = (id: string) => {
    setOrganizations(prev => prev.filter(org => org.id !== id));
  };

  const filteredSermons = sermons.filter(
    sermon =>
      sermon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sermon.speaker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-purple-400" />
            VoiceBridge Smart Library
          </h1>
          <p className="text-slate-400">
            Explore archived sermons, ask questions, and manage organizations
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-700">
          {[
            { id: 'library', label: 'Sermon Library', icon: BookOpen },
            { id: 'chat', label: 'AI Chat', icon: MessageCircle },
            { id: 'organizations', label: 'Organizations', icon: Plus },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 font-medium flex items-center gap-2 border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Library Tab */}
        {activeTab === 'library' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sermon List */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="bg-slate-800 border-slate-700 p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                  <Input
                    placeholder="Search sermons by title or speaker..."
                    value={searchQuery}
                    onChange={e => handleSearchSermons(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                  />
                </div>
              </Card>

              <div className="space-y-3">
                {filteredSermons.map(sermon => (
                  <Card
                    key={sermon.id}
                    onClick={() => setSelectedSermon(sermon)}
                    className={`bg-slate-800 border-slate-700 p-4 cursor-pointer transition ${
                      selectedSermon?.id === sermon.id
                        ? 'border-blue-500 bg-slate-750'
                        : 'hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg text-white">{sermon.title}</h3>
                        <p className="text-sm text-slate-400 flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {sermon.speaker}
                        </p>
                      </div>
                      <span className="text-xs bg-blue-900 text-blue-200 px-2 py-1 rounded">
                        {sermon.duration} min
                      </span>
                    </div>

                    <p className="text-sm text-slate-300 mb-3">{sermon.summary}</p>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3 h-3" />
                        {sermon.date.toLocaleDateString()}
                      </div>
                      <div className="flex gap-1">
                        {sermon.languages.map(lang => (
                          <span
                            key={lang}
                            className="bg-slate-700 text-slate-200 px-2 py-1 rounded"
                          >
                            {lang.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sermon Details */}
            {selectedSermon && (
              <Card className="bg-slate-800 border-slate-700 p-6 h-fit sticky top-6">
                <h3 className="text-lg font-semibold mb-4">{selectedSermon.title}</h3>

                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-slate-400 mb-1">Speaker</p>
                    <p className="font-medium">{selectedSermon.speaker}</p>
                  </div>

                  <div>
                    <p className="text-slate-400 mb-1">Date</p>
                    <p className="font-medium">{selectedSermon.date.toLocaleDateString()}</p>
                  </div>

                  <div>
                    <p className="text-slate-400 mb-1">Duration</p>
                    <p className="font-medium">{selectedSermon.duration} minutes</p>
                  </div>

                  <div>
                    <p className="text-slate-400 mb-2">Available Languages</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedSermon.languages.map(lang => (
                        <span
                          key={lang}
                          className="bg-blue-900 text-blue-200 text-xs px-3 py-1 rounded-full"
                        >
                          {lang.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-700">
                    <p className="text-slate-400 mb-2">Transcript Preview</p>
                    <p className="text-slate-300 text-xs leading-relaxed line-clamp-4">
                      {selectedSermon.transcript}
                    </p>
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                    View Full Transcript
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 bg-slate-800 border-slate-700 p-6 flex flex-col h-96">
              <h2 className="text-lg font-semibold mb-4">Ask About Sermons</h2>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4 bg-slate-900 rounded-lg p-4">
                {chatMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-slate-100'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-700 text-slate-100 px-4 py-2 rounded-lg">
                      <Loader className="w-4 h-4 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Ask about the sermon..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSendChatMessage()}
                  disabled={isLoading}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                />
                <Button
                  onClick={handleSendChatMessage}
                  disabled={isLoading || !chatInput.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </Card>

            {/* Chat Info */}
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h3 className="text-lg font-semibold mb-4">About This Feature</h3>

              <div className="space-y-4 text-sm text-slate-300">
                <p>
                  Ask questions about any sermon in our library. The AI uses semantic search to find relevant
                  content.
                </p>

                <div>
                  <p className="font-semibold text-white mb-2">Example Questions:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• What were the main points?</li>
                    <li>• Summarize the key takeaways</li>
                    <li>• What scriptures were mentioned?</li>
                    <li>• How does this relate to...?</li>
                  </ul>
                </div>

                <p className="text-xs text-slate-500">
                  Powered by RAG (Retrieval-Augmented Generation) with vector embeddings
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* Organizations Tab */}
        {activeTab === 'organizations' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Organization List */}
            <div className="lg:col-span-2 space-y-4">
              {organizations.map(org => (
                <Card key={org.id} className="bg-slate-800 border-slate-700 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{org.name}</h3>
                      <p className="text-sm text-slate-400">{org.description}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteOrganization(org.id)}
                      className="text-slate-400 hover:text-red-400 transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-slate-400">
                      <User className="w-4 h-4" />
                      {org.memberCount} members
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock className="w-4 h-4" />
                      Created {org.createdAt.toLocaleDateString()}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white">
                      Manage Organization
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Add Organization Form */}
            <Card className="bg-slate-800 border-slate-700 p-6 h-fit sticky top-6">
              <h3 className="text-lg font-semibold mb-4">Create Organization</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="org-name" className="text-slate-300 mb-2 block">
                    Organization Name
                  </Label>
                  <Input
                    id="org-name"
                    placeholder="e.g., Grace Church"
                    value={newOrgName}
                    onChange={e => setNewOrgName(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                  />
                </div>

                <div>
                  <Label htmlFor="org-desc" className="text-slate-300 mb-2 block">
                    Description
                  </Label>
                  <textarea
                    id="org-desc"
                    placeholder="Brief description of your organization..."
                    value={newOrgDesc}
                    onChange={e => setNewOrgDesc(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <Button
                  onClick={handleAddOrganization}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Organization
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
