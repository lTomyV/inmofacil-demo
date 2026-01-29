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
  }
];

export const DEFAULT_THEME_ID = "ocean";
