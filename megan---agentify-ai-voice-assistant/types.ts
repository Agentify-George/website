
export interface LeadInfo {
  fullName: string;
  email: string;
  phoneNumber: string;
  openDeals?: string;
}

export enum CallStatus {
  IDLE = 'IDLE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  DISCONNECTED = 'DISCONNECTED',
  ERROR = 'ERROR'
}

export interface ActivityLog {
  timestamp: string;
  summary: string;
  outcome: string;
}

export interface TranscriptionEntry {
  role: 'user' | 'agent';
  text: string;
}
