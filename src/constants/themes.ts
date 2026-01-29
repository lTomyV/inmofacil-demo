/**
 * Theme Configuration
 * Defines available color themes for the application
 */

import { Theme } from '../types';

export const THEMES: Theme[] = [
  { 
    id: "ocean", 
    name: "Ocean Blue", 
    primaryClass: "blue-600", 
    bgClass: "bg-blue-600", 
    textClass: "text-blue-600", 
    shadowClass: "shadow-blue-600/20",
    accentClass: "bg-blue-50"
  },
  { 
    id: "nature", 
    name: "Emerald Nature", 
    primaryClass: "emerald-600", 
    bgClass: "bg-emerald-600", 
    textClass: "text-emerald-600", 
    shadowClass: "shadow-emerald-600/20",
    accentClass: "bg-emerald-50"
  },
  { 
    id: "midnight", 
    name: "Midnight Indigo", 
    primaryClass: "indigo-600", 
    bgClass: "bg-indigo-600", 
    textClass: "text-indigo-600", 
    shadowClass: "shadow-indigo-600/20",
    accentClass: "bg-indigo-50"
  },
  { 
    id: "sunset", 
    name: "Warm Sunset", 
    primaryClass: "orange-600", 
    bgClass: "bg-orange-600", 
    textClass: "text-orange-600", 
    shadowClass: "shadow-orange-600/20",
    accentClass: "bg-orange-50"
  },
  { 
    id: "ruby", 
    name: "Ruby Red", 
    primaryClass: "red-600", 
    bgClass: "bg-red-600", 
    textClass: "text-red-600", 
    shadowClass: "shadow-red-600/20",
    accentClass: "bg-red-50"
  },
  { 
    id: "violet", 
    name: "Royal Violet", 
    primaryClass: "violet-600", 
    bgClass: "bg-violet-600", 
    textClass: "text-violet-600", 
    shadowClass: "shadow-violet-600/20",
    accentClass: "bg-violet-50"
  },
  { 
    id: "teal", 
    name: "Teal Fresh", 
    primaryClass: "teal-600", 
    bgClass: "bg-teal-600", 
    textClass: "text-teal-600", 
    shadowClass: "shadow-teal-600/20",
    accentClass: "bg-teal-50"
  },
  { 
    id: "amber", 
    name: "Golden Amber", 
    primaryClass: "amber-600", 
    bgClass: "bg-amber-600", 
    textClass: "text-amber-600", 
    shadowClass: "shadow-amber-600/20",
    accentClass: "bg-amber-50"
  },
  { 
    id: "rose", 
    name: "Rose Elegant", 
    primaryClass: "rose-600", 
    bgClass: "bg-rose-600", 
    textClass: "text-rose-600", 
    shadowClass: "shadow-rose-600/20",
    accentClass: "bg-rose-50"
  },
  { 
    id: "slate", 
    name: "Modern Slate", 
    primaryClass: "slate-700", 
    bgClass: "bg-slate-700", 
    textClass: "text-slate-700", 
    shadowClass: "shadow-slate-700/20",
    accentClass: "bg-slate-50"
  }
];

export const DEFAULT_THEME_ID = "ocean";
