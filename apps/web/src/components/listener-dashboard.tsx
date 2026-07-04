'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Label } from './ui/label';
import {
  Volume2,
  Pause,
  Play,
  Globe,
  MessageCircle,
  Users,
  Clock,
  ChevronDown,
} from 'lucide-react';

interface TranscriptEntry {
  id: string;
  originalText: string;
  translatedText: string;
  timestamp: number;
  speaker: string;
}

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
}

export function ListenerDashboard() {
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [listenerCount, setListenerCount] = useState(24);
  const [broadcastDuration, setBroadcastDuration] = useState('00:00');
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  const languages: LanguageOption[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
    { code: 'zh-CN', name: 'Mandarin', nativeName: '中文' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
  ];

  // Mock transcript data
  const mockTranscriptData: TranscriptEntry[] = [
    {
      id: '1',
      originalText: 'Good morning, brothers and sisters.',
      translatedText: 'Buenos días, hermanos y hermanas.',
      timestamp: 0,
      speaker: 'Pastor John',
    },
    {
      id: '2',
      originalText: 'Today, we gather to discuss the importance of faith and community.',
      translatedText: 'Hoy, nos reunimos para discutir la importancia de la fe y la comunidad.',
      timestamp: 3000,
      speaker: 'Pastor John',
    },
    {
      id: '3',
      originalText: 'In these challenging times, we must hold onto our beliefs.',
      translatedText: 'En estos tiempos desafiantes, debemos aferrarnos a nuestras creencias.',
      timestamp: 6000,
      speaker: 'Pastor John',
    },
    {
      id: '4',
      originalText: 'Let us pray together.',
      translatedText: 'Oremos juntos.',
      timestamp: 9000,
      speaker: 'Pastor John',
    },
  ];

  // Simulate real-time transcript updates
  useEffect(() => {
    if (!isConnected) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < mockTranscriptData.length) {
        setTranscript(prev => [...prev, mockTranscriptData[currentIndex]]);
        currentIndex++;
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isConnected]);

  // Auto-scroll to latest transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  // Simulate broadcast timer
  useEffect(() => {
    let seconds = 0;
    const timer = setInterval(() => {
      seconds++;
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      setBroadcastDuration(
        `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLanguageChange = (code: string) => {
    setSelectedLanguage(code);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const selectedLanguageName = languages.find(l => l.code === selectedLanguage)?.name || 'English';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <Volume2 className="w-8 h-8 text-blue-400" />
            VoiceBridge Listener
          </h1>
          <p className="text-slate-400">
            Experience live translation in your preferred language
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Broadcast Status Card */}
            <Card className="bg-slate-800 border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold text-green-400">Live Broadcast</span>
                </div>
                {!isConnected && (
                  <span className="text-red-400 text-sm font-medium">Connection Lost</span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-700 rounded-lg p-3">
                  <p className="text-slate-400 text-xs mb-1">Duration</p>
                  <p className="text-xl font-bold text-blue-400 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {broadcastDuration}
                  </p>
                </div>
                <div className="bg-slate-700 rounded-lg p-3">
                  <p className="text-slate-400 text-xs mb-1">Active Listeners</p>
                  <p className="text-xl font-bold text-green-400 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {listenerCount}
                  </p>
                </div>
                <div className="bg-slate-700 rounded-lg p-3">
                  <p className="text-slate-400 text-xs mb-1">Language</p>
                  <p className="text-xl font-bold text-purple-400">{selectedLanguage.toUpperCase()}</p>
                </div>
              </div>
            </Card>

            {/* Audio Controls Card */}
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h2 className="text-lg font-semibold mb-4">Audio Controls</h2>

              <div className="space-y-4">
                {/* Play/Pause Controls */}
                <div className="flex gap-3">
                  <Button
                    onClick={handlePlayPause}
                    className={`flex-1 font-bold py-3 text-lg flex items-center justify-center gap-2 ${
                      isPlaying
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-slate-700 hover:bg-slate-600'
                    } text-white`}
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-5 h-5" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        Play
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={handleMuteToggle}
                    className={`flex-1 font-bold py-3 text-lg flex items-center justify-center gap-2 ${
                      isMuted
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-slate-700 hover:bg-slate-600'
                    } text-white`}
                  >
                    <Volume2 className="w-5 h-5" />
                    {isMuted ? 'Muted' : 'Unmuted'}
                  </Button>
                </div>

                {/* Volume Control */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-slate-300">Volume</Label>
                    <span className="text-sm text-slate-400">{volume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={e => setVolume(Number(e.target.value))}
                    disabled={isMuted}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
              </div>
            </Card>

            {/* Language Selection Card */}
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-green-400" />
                Select Translation Language
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`p-3 rounded-lg font-medium transition text-left ${
                      selectedLanguage === lang.code
                        ? 'bg-blue-600 border-2 border-blue-400 text-white'
                        : 'bg-slate-700 border-2 border-slate-600 text-slate-300 hover:border-blue-400'
                    }`}
                  >
                    <div className="font-semibold">{lang.name}</div>
                    <div className="text-xs opacity-75">{lang.nativeName}</div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Transcript Feed */}
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-orange-400" />
                Live Transcript ({selectedLanguageName})
              </h2>

              <div className="bg-slate-900 rounded-lg p-4 h-96 overflow-y-auto border border-slate-700 space-y-4">
                {transcript.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-slate-500 text-center italic">
                      Waiting for broadcast to start...
                    </p>
                  </div>
                ) : (
                  <>
                    {transcript.map((entry, idx) => (
                      <div key={entry.id} className="space-y-2 pb-4 border-b border-slate-700 last:border-b-0">
                        <div className="flex items-start justify-between">
                          <p className="font-semibold text-blue-300">{entry.speaker}</p>
                          <span className="text-xs text-slate-500">
                            {new Date(entry.timestamp).toLocaleTimeString()}
                          </span>
                        </div>

                        {/* Original Text (English) */}
                        <p className="text-slate-400 text-sm italic">
                          {entry.originalText}
                        </p>

                        {/* Translated Text */}
                        <p className="text-white text-base leading-relaxed">
                          {entry.translatedText}
                        </p>

                        {/* Pause Indicator */}
                        {idx < transcript.length - 1 && (
                          <div className="flex items-center gap-2 pt-2">
                            <div className="flex-1 h-px bg-slate-600"></div>
                            <span className="text-xs text-slate-500">pause</span>
                            <div className="flex-1 h-px bg-slate-600"></div>
                          </div>
                        )}
                      </div>
                    ))}
                    <div ref={transcriptEndRef} />
                  </>
                )}
              </div>

              <p className="text-xs text-slate-500 mt-3">
                Showing translations in {selectedLanguageName}. Original audio plays in the speaker's voice.
              </p>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <Card className="bg-gradient-to-br from-blue-900 to-blue-800 border-blue-700 p-6 sticky top-6">
              <h3 className="text-lg font-semibold mb-4">Broadcast Info</h3>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-blue-200 text-xs mb-1">EVENT</p>
                  <p className="font-semibold text-white">Sunday Service</p>
                </div>

                <div>
                  <p className="text-blue-200 text-xs mb-1">SPEAKER</p>
                  <p className="font-semibold text-white">Pastor John</p>
                </div>

                <div>
                  <p className="text-blue-200 text-xs mb-1">ORGANIZATION</p>
                  <p className="font-semibold text-white">Grace Church</p>
                </div>

                <div className="pt-4 border-t border-blue-700">
                  <p className="text-blue-200 text-xs mb-2">ACTIVE LANGUAGES</p>
                  <div className="flex flex-wrap gap-2">
                    {['ES', 'FR', 'ID', 'ZH'].map(lang => (
                      <span
                        key={lang}
                        className="bg-blue-700 text-blue-100 text-xs px-2 py-1 rounded"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Connection Status */}
            <Card className="bg-slate-800 border-slate-700 p-4">
              <h3 className="text-sm font-semibold mb-3">Connection Status</h3>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Status</span>
                  <span className="text-green-400 font-semibold">Connected</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Latency</span>
                  <span className="text-blue-400 font-semibold">45ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Buffer</span>
                  <span className="text-purple-400 font-semibold">95%</span>
                </div>
              </div>
            </Card>

            {/* Help Card */}
            <Card className="bg-slate-800 border-slate-700 p-4">
              <h3 className="text-sm font-semibold mb-3">Tips</h3>

              <ul className="space-y-2 text-xs text-slate-400">
                <li>• Select your preferred language above</li>
                <li>• Audio will auto-play when broadcast starts</li>
                <li>• Transcript syncs with audio in real-time</li>
                <li>• Adjust volume to your preference</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
