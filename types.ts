
export enum AppState {
  IDLE = 'IDLE',
  CAPTURE = 'CAPTURE',
  SELECT_FILTER = 'SELECT_FILTER',
  PROCESSING = 'PROCESSING',
  PREVIEW = 'PREVIEW'
}

export interface MomentFilter {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  prompt: string;
}

export interface UserPhoto {
  dataUrl: string;
  mimeType: string;
}

export interface ScoreState {
  home: number;
  away: number;
}

export interface Sticker {
  id: string;
  type: 'text' | 'icon' | 'hat';
  value: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

export const MOMENT_FILTERS: MomentFilter[] = [
  {
    id: 'goal',
    name: 'Goal & Gear',
    description: 'Victory celebration with team kit and hats',
    icon: 'fa-shirt',
    color: 'from-yellow-400 to-orange-600',
    prompt: 'Transform clothing into professional soccer jerseys and add team hats. Apply a high-end cinematic GOAL CELEBRATION style with warm golden lighting and natural match-day atmosphere. Keep faces 100% intact.'
  },
  {
    id: 'tension',
    name: 'The Finisher',
    description: 'Electric match kit and match-day hats',
    icon: 'fa-stopwatch',
    color: 'from-blue-500 to-indigo-700',
    prompt: 'Change clothing to professional soccer kits and add team hats. Apply a high-contrast clinical match-day style with deep blue tones and sharp clarity. Strictly preserve original faces.'
  },
  {
    id: 'energy',
    name: 'Home Team Hero',
    description: 'Stadium energy with matching team kits',
    icon: 'fa-users',
    color: 'from-green-400 to-emerald-600',
    prompt: 'Transform all people with professional home jerseys and team hats. Use a vibrant stadium energy style, enhancing pitch greens naturally and adding subtle stadium flares. Keep faces clear.'
  },
  {
    id: 'drama',
    name: 'Rivalry Mode',
    description: 'Gritty drama with dark kits and team hats',
    icon: 'fa-exclamation-triangle',
    color: 'from-red-500 to-red-900',
    prompt: 'Equip all people with dark professional jerseys and team hats. Apply a dramatic, gritty editorial style with deep shadows and cinematic contrast. Faces must remain authentic.'
  }
];
