
import { useTheme } from 'next-themes';

export interface MusicOption {
  id: string;
  title: string;
  url: string; 
}

// Theme options
export interface ThemeOption {
  id: string;
  name: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  cardClass: string;
  btnClass: string;
  btnHoverClass: string;
  focusRingClass: string;
}

export class ThemeManager {
  private static instance: ThemeManager;
  private currentTheme: string | undefined;
  
  // Music options available - atualizando para usar URL completa
  private readonly _musicOptions: MusicOption[] = [
    { id: "romantica", title: "Música Romântica", url: "" },
    { id: "elegante", title: "Música Elegante", url: "" },
    { id: "divertida", title: "Música Divertida", url: "https://www.youtube.com/watch?v=ZbZSe6N_BXs" },
  ];

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  public static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }

  public setTheme(theme: string | undefined): void {
    this.currentTheme = theme;
  }

  public get musicOptions(): MusicOption[] {
    return [...this._musicOptions];
  }

  public get themeOptions(): ThemeOption[] {
    const isDarkMode = this.currentTheme === "dark";
    
    return [
      { 
        id: "padrao", 
        name: "Padrão", 
        bgClass: isDarkMode ? "bg-background" : "bg-background", 
        textClass: isDarkMode ? "text-foreground" : "text-foreground",
        borderClass: isDarkMode ? "border-border" : "border-border",
        cardClass: isDarkMode ? "bg-card shadow-md" : "bg-card shadow-md",
        btnClass: isDarkMode ? "bg-primary text-primary-foreground" : "bg-primary text-primary-foreground",
        btnHoverClass: isDarkMode ? "hover:bg-primary/90" : "hover:bg-primary/90",
        focusRingClass: isDarkMode ? "focus:ring-ring" : "focus:ring-ring"
      },
      { 
        id: "romantico", 
        name: "Romântico", 
        bgClass: isDarkMode ? "bg-rose-950" : "bg-rose-50", 
        textClass: isDarkMode ? "text-rose-200" : "text-rose-800",
        borderClass: isDarkMode ? "border-rose-800" : "border-rose-200",
        cardClass: isDarkMode ? "bg-rose-900 shadow-rose-900" : "bg-white shadow-rose-200",
        btnClass: isDarkMode ? "bg-rose-700 text-white" : "bg-rose-600 text-white",
        btnHoverClass: isDarkMode ? "hover:bg-rose-800" : "hover:bg-rose-700",
        focusRingClass: "focus:ring-rose-500"
      },
      { 
        id: "elegante", 
        name: "Elegante", 
        bgClass: isDarkMode ? "bg-indigo-950" : "bg-indigo-50", 
        textClass: isDarkMode ? "text-indigo-200" : "text-indigo-900",
        borderClass: isDarkMode ? "border-indigo-800" : "border-indigo-200",
        cardClass: isDarkMode ? "bg-indigo-900 shadow-indigo-900" : "bg-white shadow-indigo-200",
        btnClass: isDarkMode ? "bg-indigo-700 text-white" : "bg-indigo-600 text-white",
        btnHoverClass: isDarkMode ? "hover:bg-indigo-800" : "hover:bg-indigo-700",
        focusRingClass: "focus:ring-indigo-500"
      },
      { 
        id: "divertido", 
        name: "Divertido", 
        bgClass: isDarkMode ? "bg-amber-950" : "bg-amber-50", 
        textClass: isDarkMode ? "text-amber-200" : "text-amber-800",
        borderClass: isDarkMode ? "border-amber-800" : "border-amber-200",
        cardClass: isDarkMode ? "bg-amber-900 shadow-amber-900" : "bg-white shadow-amber-200",
        btnClass: isDarkMode ? "bg-amber-700 text-white" : "bg-amber-600 text-white",
        btnHoverClass: isDarkMode ? "hover:bg-amber-800" : "hover:bg-amber-700",
        focusRingClass: "focus:ring-amber-500"
      }
    ];
  }

  public getThemeById(themeId: string): ThemeOption | undefined {
    return this.themeOptions.find(theme => theme.id === themeId);
  }

  public getMusicById(musicId: string): MusicOption | undefined {
    return this._musicOptions.find(music => music.id === musicId);
  }
}

// Hook para usar nos componentes React
export function useThemeManager() {
  const { theme } = useTheme();
  const themeManager = ThemeManager.getInstance();
  themeManager.setTheme(theme);
  
  return {
    musicOptions: themeManager.musicOptions,
    themeOptions: themeManager.themeOptions,
    getThemeById: (id: string) => themeManager.getThemeById(id),
    getMusicById: (id: string) => themeManager.getMusicById(id)
  };
}