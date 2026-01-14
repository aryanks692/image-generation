
import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="hidden md:flex px-10 py-6 justify-between items-center w-full z-10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <i className="fas fa-wand-sparkles text-white text-lg"></i>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          Lumina<span className="text-blue-400">Art</span>
        </h1>
      </div>
      <div className="flex gap-6 items-center">
        <nav className="flex gap-4 text-slate-400 text-sm font-medium">
          <a href="#" className="hover:text-white transition-colors">Documentation</a>
          <a href="#" className="hover:text-white transition-colors">Gallery</a>
        </nav>
        <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-medium">
          Account
        </button>
      </div>
    </div>
  );
};

export default Header;
