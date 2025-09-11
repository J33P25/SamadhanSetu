// Navbar.jsx
export default function Navbar() {
  return (
    <div className="bg-[#C6C6D0] min-h-screen font-sans text-[#053a2b] antialiased">
      {/* Header / Navbar */}
      <header className="site-header sticky top-0 z-50 bg-gradient-to-r from-[#0b3f35] to-[#053a2b] text-[#C6C6D0] px-5 py-3 shadow-[0_6px_20px_rgba(11,13,12,0.12)] border-b-[3px] border-black/5">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between gap-3 md:flex-row md:items-center md:justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="seal w-11 h-9 rounded-md bg-gradient-to-b from-[#C6C6D0] to-white/90 border-2 border-black/5 shadow-[inset_0_-6px_12px_rgba(0,0,0,0.06)] relative -ml-44" />
            <span className="font-bold tracking-[0.2px] text-xl text-[#C6C6D0]">
              logo
            </span>
          </div>
        </div>
      </header>
    </div>
  );
}
