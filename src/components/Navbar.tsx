'use client';

import React from 'react';
import { BookOpen, Library, Trophy, Users, BarChart3, Bookmark, Moon, Sun, Github } from 'lucide-react';
import { MooseIcon } from './MooseIcon';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  savedCount: number;
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  darkMode,
  setDarkMode,
}) => {
  const tabs = [
    { id: 'index', label: 'Index & Search', icon: BookOpen },
    { id: 'shelf', label: 'Virtual Shelf', icon: Library },
    { id: 'prizes', label: 'Prizes', icon: Trophy },
    { id: 'authors', label: 'Authors', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reading-list', label: 'My Shelf', icon: Bookmark, badge: savedCount },
  ];

  return (
    <header className="sticky top-0 z-40 bg-parchment-50/90 dark:bg-ink-900/90 backdrop-blur-md border-b border-parchment-300 dark:border-ink-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('index')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-100/90 dark:bg-amber-950/80 border border-amber-300/80 dark:border-amber-700/60 flex items-center justify-center shadow-xs transition-transform group-hover:scale-110 text-stone-900 dark:text-amber-300">
              <MooseIcon className="w-8 h-8" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold tracking-tight text-parchment-900 dark:text-parchment-50 block leading-tight">
                Mostly Fiction
              </span>
              <span className="text-[11px] font-sans text-parchment-600 dark:text-ink-400 block tracking-wider uppercase">
                The Curated Literary Archive
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1 lg:space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-parchment-200 dark:bg-ink-800 text-parchment-900 dark:text-gilded-400 font-semibold shadow-xs'
                      : 'text-parchment-700 dark:text-ink-300 hover:bg-parchment-100 dark:hover:bg-ink-800/60 hover:text-parchment-900 dark:hover:text-parchment-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-gilded-600 dark:text-gilded-400' : ''}`} />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded-full bg-gilded-500 text-white dark:text-ink-950 font-bold">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Controls: Theme & GitHub */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              aria-label="Toggle theme"
              className="p-2 rounded-lg text-parchment-700 dark:text-ink-300 hover:bg-parchment-200 dark:hover:bg-ink-800 transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5 text-gilded-400" /> : <Moon className="w-5 h-5" />}
            </button>
            <a
              href="https://github.com/foobork/fiction-prize-index"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Repository"
              className="p-2 rounded-lg text-parchment-700 dark:text-ink-300 hover:bg-parchment-200 dark:hover:bg-ink-800 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden overflow-x-auto py-2 space-x-1 border-t border-parchment-200 dark:border-ink-800 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1 px-2.5 py-1.5 whitespace-nowrap rounded text-xs font-medium ${
                  isActive
                    ? 'bg-parchment-200 dark:bg-ink-800 text-parchment-900 dark:text-gilded-400 font-bold'
                    : 'text-parchment-700 dark:text-ink-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="px-1 py-0.2 text-[9px] rounded-full bg-gilded-500 text-white font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
