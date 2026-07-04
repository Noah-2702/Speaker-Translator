import React from 'react';
import { SpeakerDashboard } from '@/components/speaker-dashboard';
import { ListenerDashboard } from '@/components/listener-dashboard';
import { SmartLibrary } from '@/components/smart-library';

export default function VoiceBridgePage() {
  // In production, this would be determined by user role and query params
  const userRole = 'speaker'; // or 'listener' or 'admin'
  const view = 'speaker'; // or 'listener' or 'library'

  return (
    <main className="min-h-screen bg-slate-900">
      {view === 'speaker' && <SpeakerDashboard />}
      {view === 'listener' && <ListenerDashboard />}
      {view === 'library' && <SmartLibrary />}
    </main>
  );
}
