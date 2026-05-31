import { useState, useEffect } from 'react';
import { Phone, CheckCircle2, ShieldCheck, Clipboard } from 'lucide-react';

interface HeaderProps {
  onOpenAdmin: () => void;
  leadCount: number;
}

export default function Header({ onOpenAdmin, leadCount }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled 
          ? 'bg-white shadow-md py-3 border-b border-gray-100' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="h-10 w-10 rounded-xl bg-maritime-900 flex items-center justify-center text-white font-display font-semibold transition-transform duration-300 group-hover:scale-105 shadow-md">
              EC
            </div>
            <div className="flex flex-col">
              <span className="font-display font-display text-lg font-bold tracking-tight text-maritime-950 group-hover:text-maritime-700 transition-colors">
                East Coast <span className="text-maritime-600">Buyers</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider font-mono text-gray-500">
                Nova Scotia
              </span>
            </div>
          </a>

          {/* Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Admin Lead Counter Button */}
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-maritime-100 bg-maritime-50/50 hover:bg-maritime-100 text-xs font-medium text-maritime-800 transition-all"
              title="View Lead Submissions Dashboard"
            >
              <Clipboard className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Admin Demo Dashboard</span>
              {leadCount > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-amber px-1 text-[9px] font-bold text-white">
                  {leadCount}
                </span>
              )}
            </button>

            {/* Phone Button */}
            <a 
              href="tel:+19025555555" 
              className="flex items-center gap-1.5 text-sm font-semibold text-maritime-900 hover:text-maritime-600 transition-colors px-2.5 py-1.5 sm:px-3 rounded-lg hover:bg-stone-100"
            >
              <Phone className="h-4 w-4 text-maritime-600 animate-pulse" />
              <span className="hidden md:inline">(902) 555-5555</span>
              <span className="md:hidden text-xs">Call</span>
            </a>

            {/* Direct CTA */}
            <a 
              href="#property-form-top-anchor"
              className="hidden lg:inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-maritime-800 hover:bg-maritime-700 active:bg-maritime-950 rounded-lg shadow-sm transition-colors duration-200 cursor-pointer"
            >
              Get Free Review
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
