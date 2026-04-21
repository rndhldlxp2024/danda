import React from 'react';
import Sidebar from './Sidebar';
import { Bell, Search } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar - Fixed width on Desktop, Toggleable on Mobile */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header - Fixed at the top of the content area */}
        <header className="h-16 px-4 lg:px-8 flex items-center justify-between lg:justify-end bg-white/80 backdrop-blur-md border-b border-slate-200 shrink-0 z-10">
          {/* Mobile Spacer (for the hamburger menu in Sidebar) */}
          <div className="w-10 lg:hidden"></div>
          
          <div className="flex items-center gap-4 lg:gap-6">
            <button className="text-slate-400 hover:text-slate-600 transition-colors">
              <Search size={20} />
            </button>
            <button className="text-slate-400 hover:text-slate-600 transition-colors relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-[10px] text-white flex items-center justify-center rounded-full border-2 border-white">
                3
              </span>
            </button>
            
            <div className="h-8 w-[1px] bg-slate-200 hidden lg:block"></div>
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-800">John Doe</p>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Teacher Account</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-lg shadow-indigo-100 flex items-center justify-center text-white font-bold text-sm">
                JD
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Region */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          <div className="max-w-6xl mx-auto p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
