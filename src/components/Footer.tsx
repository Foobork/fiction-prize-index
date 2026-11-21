import React from 'react';
import { BookOpen, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-parchment-300 dark:border-ink-800 bg-parchment-100 dark:bg-ink-950 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded bg-parchment-800 dark:bg-gilded-500 flex items-center justify-center text-white dark:text-ink-950">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-serif font-bold text-lg text-parchment-900 dark:text-parchment-50">
                Fiction Prize Index
              </span>
            </div>
            <p className="text-sm text-parchment-700 dark:text-ink-400 max-w-md leading-relaxed">
              An open-source, verifiable public catalog of world-renowned fiction awards, shortlists, and publishing metadata. Built to celebrate literary craft and counteract discovery collapse.
            </p>
            <p className="text-xs text-parchment-600 dark:text-ink-500">
              Inspired by and modeled after Benjamin Breen’s{' '}
              <a
                href="https://book-prize-index.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gilded-600 dark:hover:text-gilded-400 font-medium inline-flex items-center"
              >
                Book Prize Index <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
              .
            </p>
          </div>

          <div>
            <h4 className="font-serif font-semibold text-sm text-parchment-900 dark:text-parchment-100 mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-parchment-700 dark:text-ink-300">
              <li>
                <a href="#search" className="hover:underline">Master Catalog</a>
              </li>
              <li>
                <a href="#shelf" className="hover:underline">Virtual Bookshelf Simulator</a>
              </li>
              <li>
                <a href="#prizes" className="hover:underline">Prize Archives</a>
              </li>
              <li>
                <a href="#analytics" className="hover:underline">Publishing Analytics</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-semibold text-sm text-parchment-900 dark:text-parchment-100 mb-3">
              Open Data & Verification
            </h4>
            <p className="text-xs text-parchment-600 dark:text-ink-400 mb-3 leading-relaxed">
              All records are stored as transparent JSON with direct links back to official foundation archives.
            </p>
            <div className="flex flex-col space-y-1.5 text-xs text-parchment-700 dark:text-ink-300 font-mono">
              <span>data/prizes.json</span>
              <span>data/books.json</span>
              <span>data/nominations.json</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-parchment-200 dark:border-ink-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-parchment-600 dark:text-ink-500">
          <div>
            Open source under MIT License. Curated by{' '}
            <a
              href="https://github.com/foobork"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-medium hover:text-gilded-600 dark:hover:text-gilded-400"
            >
              foobork
            </a>{' '}
            &{' '}
            <a
              href="https://github.com/midlevels"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-medium hover:text-gilded-600 dark:hover:text-gilded-400"
            >
              midlevels
            </a>
            .
          </div>
          <div className="mt-2 sm:mt-0 flex items-center space-x-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for literary fiction</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
