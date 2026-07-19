export function TopNavigation() {
  return (
    <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0C0C0E]/50 backdrop-blur-md">
      
      {/* Breadcrumb / Title */}
      <div className="flex items-center gap-2">
        <h1 className="font-display font-semibold text-white text-lg tracking-tight">Focus Dashboard</h1>
        <div className="flex items-center ml-4 gap-2 px-3 py-1 rounded-full bg-[#16161A] border border-white/5">
          <span className="w-2 h-2 rounded-full bg-[#00D2D3] animate-pulse"></span>
          <span className="text-xs font-medium text-[#A0A0A5]">Deep Focus Mode</span>
        </div>
      </div>

      {/* AI Mascot & Utilities */}
      <div className="flex items-center gap-6">
        
        {/* Mascot Orb (Minimal CSS Representation) */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#A0A0A5]">Ready for task</span>
          <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-[#6C5CE7] to-[#00D2D3] blur-[1px] hover:blur-none transition-all duration-500 cursor-pointer shadow-[0_0_15px_rgba(108,92,231,0.5)]">
            <div className="absolute inset-0 bg-white/20 rounded-full mix-blend-overlay"></div>
          </div>
        </div>

        <div className="w-px h-6 bg-white/10"></div>

        {/* Profile / Notifications */}
        <div className="flex items-center gap-4">
          <button className="relative w-8 h-8 flex items-center justify-center text-[#A0A0A5] hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF7675]"></span>
          </button>
          
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 border border-white/10 flex items-center justify-center overflow-hidden cursor-pointer">
            <svg className="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>

      </div>
    </header>
  );
}
