'use client';

import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import {
  Mic,
  Upload,
  Globe,
  Radio,
  X,
  FileText,
  ChevronDown,
} from 'lucide-react';

interface TargetLanguage {
  code: string;
  name: string;
  selected: boolean;
}

interface UploadedNote {
  id: string;
  name: string;
  size: number;
  uploadedAt: Date;
}

export function SpeakerDashboard() {
  const [isLive, setIsLive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<TargetLanguage[]>([
    { code: 'es', name: 'Spanish', selected: false },
    { code: 'fr', name: 'French', selected: false },
    { code: 'id', name: 'Indonesian', selected: false },
    { code: 'zh-CN', name: 'Mandarin Chinese', selected: false },
    { code: 'pt', name: 'Portuguese', selected: false },
    { code: 'de', name: 'German', selected: false },
  ]);
  const [uploadedNotes, setUploadedNotes] = useState<UploadedNote[]>([]);
  const [voiceId, setVoiceId] = useState('default-voice');
  const [transcriptPreview, setTranscriptPreview] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleLanguageToggle = (code: string) => {
    setSelectedLanguages(prev =>
      prev.map(lang =>
        lang.code === code ? { ...lang, selected: !lang.selected } : lang
      )
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const newNote: UploadedNote = {
        id: `note-${Date.now()}`,
        name: file.name,
        size: file.size,
        uploadedAt: new Date(),
      };
      setUploadedNotes(prev => [...prev, newNote]);
    });
  };

  const handleRemoveNote = (id: string) => {
    setUploadedNotes(prev => prev.filter(note => note.id !== id));
  };

  const handleGoLive = async () => {
    if (!eventTitle.trim()) {
      alert('Please enter an event title');
      return;
    }

    const selectedLangs = selectedLanguages
      .filter(lang => lang.selected)
      .map(lang => lang.code);

    if (selectedLangs.length === 0) {
      alert('Please select at least one target language');
      return;
    }

    setIsLive(true);
    setTranscriptPreview([
      'Starting live broadcast...',
      'Connecting to listeners...',
      'Audio stream initialized.',
    ]);

    // Simulate live broadcast
    setTimeout(() => {
      setTranscriptPreview(prev => [
        ...prev,
        'Good morning, everyone. Thank you for joining us today.',
      ]);
    }, 2000);
  };

  const handleStopBroadcast = () => {
    setIsLive(false);
    setIsRecording(false);
    setTranscriptPreview([]);
  };

  const handleAudioInput = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulate audio recording
      setTimeout(() => {
        setTranscriptPreview(prev => [
          ...prev,
          'Today, we gather to discuss the importance of faith and community.',
        ]);
      }, 1000);
    } else {
      setIsRecording(false);
    }
  };

  const selectedLanguageCount = selectedLanguages.filter(l => l.selected).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Radio className="w-8 h-8 text-blue-400" />
            VoiceBridge Speaker Dashboard
          </h1>
          <p className="text-slate-400">
            Set up your broadcast, configure languages, and go live with real-time translation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Pane: Speaker Setup */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Details Card */}
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                Event Details
              </h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="event-title" className="text-slate-300 mb-2 block">
                    Event Title
                  </Label>
                  <Input
                    id="event-title"
                    placeholder="e.g., Sunday Service - July 4th"
                    value={eventTitle}
                    onChange={e => setEventTitle(e.target.value)}
                    disabled={isLive}
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                  />
                </div>

                <div>
                  <Label htmlFor="event-description" className="text-slate-300 mb-2 block">
                    Description (Optional)
                  </Label>
                  <textarea
                    id="event-description"
                    placeholder="Add context or agenda for this broadcast..."
                    value={eventDescription}
                    onChange={e => setEventDescription(e.target.value)}
                    disabled={isLive}
                    rows={3}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <Label htmlFor="voice-id" className="text-slate-300 mb-2 block">
                    Voice Profile (ElevenLabs Voice ID)
                  </Label>
                  <Input
                    id="voice-id"
                    placeholder="Your ElevenLabs voice ID"
                    value={voiceId}
                    onChange={e => setVoiceId(e.target.value)}
                    disabled={isLive}
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                  />
                </div>
              </div>
            </Card>

            {/* Target Languages Card */}
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-green-400" />
                Target Languages ({selectedLanguageCount})
              </h2>

              <div className="grid grid-cols-2 gap-4">
                {selectedLanguages.map(lang => (
                  <div key={lang.code} className="flex items-center space-x-3">
                    <Checkbox
                      id={lang.code}
                      checked={lang.selected}
                      onChange={() => handleLanguageToggle(lang.code)}
                      disabled={isLive}
                      className="border-slate-500"
                    />
                    <Label
                      htmlFor={lang.code}
                      className="text-slate-300 cursor-pointer font-medium"
                    >
                      {lang.name}
                    </Label>
                  </div>
                ))}
              </div>
            </Card>

            {/* Notes Upload Card */}
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-purple-400" />
                Upload Notes & Materials
              </h2>

              <div
                className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                <p className="text-slate-300 font-medium">
                  Drag and drop files or click to browse
                </p>
                <p className="text-slate-500 text-sm">
                  Supports PDF, Markdown, and text files
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.md,.txt"
                onChange={handleFileUpload}
                disabled={isLive}
                className="hidden"
              />

              {uploadedNotes.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h3 className="text-sm font-semibold text-slate-300">Uploaded Files:</h3>
                  {uploadedNotes.map(note => (
                    <div
                      key={note.id}
                      className="flex items-center justify-between bg-slate-700 p-3 rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <div className="text-left">
                          <p className="text-sm font-medium text-slate-200">{note.name}</p>
                          <p className="text-xs text-slate-500">
                            {(note.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveNote(note.id)}
                        disabled={isLive}
                        className="text-slate-400 hover:text-red-400 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Right Pane: Live Controls & Transcript Preview */}
          <div className="space-y-6">
            {/* Go Live Control */}
            <Card className="bg-gradient-to-br from-blue-900 to-blue-800 border-blue-700 p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Broadcast Control</h2>

              <div className="space-y-4">
                {!isLive ? (
                  <>
                    <Button
                      onClick={handleGoLive}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 text-lg flex items-center justify-center gap-2"
                    >
                      <Radio className="w-5 h-5" />
                      Go Live
                    </Button>
                    <p className="text-xs text-slate-300 text-center">
                      Make sure all settings are configured before going live.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="bg-red-900 border border-red-700 rounded-lg p-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="font-semibold text-red-200">LIVE</span>
                      </div>
                      <p className="text-sm text-red-100">Broadcasting to listeners...</p>
                    </div>

                    <Button
                      onClick={handleAudioInput}
                      className={`w-full font-bold py-3 flex items-center justify-center gap-2 ${
                        isRecording
                          ? 'bg-yellow-600 hover:bg-yellow-700'
                          : 'bg-blue-600 hover:bg-blue-700'
                      } text-white`}
                    >
                      <Mic className="w-5 h-5" />
                      {isRecording ? 'Stop Recording' : 'Start Speaking'}
                    </Button>

                    <Button
                      onClick={handleStopBroadcast}
                      className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3"
                    >
                      End Broadcast
                    </Button>
                  </>
                )}
              </div>

              {isLive && (
                <div className="mt-6 pt-6 border-t border-blue-700">
                  <p className="text-xs text-slate-300 mb-2">Selected Languages:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedLanguages
                      .filter(l => l.selected)
                      .map(lang => (
                        <span
                          key={lang.code}
                          className="bg-blue-700 text-blue-100 text-xs px-2 py-1 rounded"
                        >
                          {lang.code.toUpperCase()}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Transcript Preview */}
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Mic className="w-5 h-5 text-orange-400" />
                Live Transcript Preview
              </h2>

              <div className="bg-slate-900 rounded-lg p-4 h-64 overflow-y-auto border border-slate-700">
                {transcriptPreview.length === 0 ? (
                  <p className="text-slate-500 text-sm italic">
                    Transcript will appear here when you go live...
                  </p>
                ) : (
                  <div className="space-y-2">
                    {transcriptPreview.map((text, idx) => (
                      <p key={idx} className="text-slate-200 text-sm leading-relaxed">
                        {text}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Statistics Card */}
            {isLive && (
              <Card className="bg-slate-800 border-slate-700 p-6">
                <h3 className="text-lg font-semibold mb-4">Broadcast Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Active Listeners:</span>
                    <span className="text-green-400 font-semibold">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Broadcast Duration:</span>
                    <span className="text-blue-400 font-semibold">2:45</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Languages Active:</span>
                    <span className="text-purple-400 font-semibold">{selectedLanguageCount}</span>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
