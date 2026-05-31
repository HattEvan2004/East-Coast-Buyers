import { useState, useEffect } from 'react';
import { 
  Phone, 
  Check, 
  MapPin, 
  HelpCircle, 
  ShieldCheck, 
  Sparkles, 
  Building2, 
  Clock, 
  Calendar, 
  Lock, 
  CheckCircle2, 
  FileText, 
  ArrowRight, 
  AlertCircle,
  Megaphone,
  Layers,
  Flame,
  ChevronDown,
  Info
} from 'lucide-react';
import { PropertyLead } from './types';
import Header from './components/Header';
import PropertyForm from './components/PropertyForm';
import AdminDashboard from './components/AdminDashboard';
import FAQAccordion from './components/FAQAccordion';
import ComparisonTable from './components/ComparisonTable';
import PropertyTypesGrid from './components/PropertyTypesGrid';
import MaritimeOfferEstimator from './components/MaritimeOfferEstimator';
import { motion, AnimatePresence } from 'motion/react';

// Sample Nova Scotia Leads to populate on demand
const SAMPLE_LEADS: PropertyLead[] = [
  {
    id: 'seed-1',
    address: '47 Banook Avenue, Dartmouth, NS',
    name: 'Agnes MacDonald',
    phone: '(902) 555-0142',
    email: 'agnes.mac@eastlink.ca',
    details: '[Type: Needs Major Repairs]\nFamily cabin sitting vacant. The shingle roof has had a small leak on the rear porch for 2 winters, and the electric panel is still old fuses. Inherited from parents last year.',
    submittedAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(), // 2 days ago
    status: 'new',
    notes: 'Called Agnes on Thursday. Friendly lady. She lives in Truro and finds it difficult to drive down to manage lawn care and winter surveillance. Prefers quick direct closing without commission.',
    formType: 'top'
  },
  {
    id: 'seed-2',
    address: '109 Agricola Street, Halifax, NS',
    name: 'Sarah LeBlanc',
    phone: '(902) 555-9011',
    email: 'sarah.leblanc@gmail.com',
    details: '[Type: Inherited Estate]\nOlder Victorian properties in the North End. Owned for nearly 40 years. Basement gets quite damp in the spring runoff, and electrical heating needs a modern heatpump retrofitted.',
    submittedAt: new Date(Date.now() - 3600000 * 12).toISOString(), // 12 hours ago
    status: 'reviewed',
    notes: 'Assessed Halifax North End comps. Comps range from 540k to 680k depending heavily on structural repairs. This house is fully outdated inside but has excellent land footprint. Set as reviewed.',
    formType: 'top'
  },
  {
    id: 'seed-3',
    address: '344 Prince Street, Truro, NS',
    name: 'Marcus Thorne',
    phone: '(902) 555-7821',
    email: '',
    details: '[Type: Vacant / Abandoned]\nHouse was rented out for 10 years but the tenants recently left. Cosmetic shape is rough — worn carpets, broken front window pane, kitchen needs complete tear-out. I don’t have time to do renovations.',
    submittedAt: new Date(Date.now() - 3600000 * 48).toISOString(), // 4 days ago
    status: 'contacted',
    notes: 'Left voicemail for Marcus. He responded stating he would like to discuss a basic walkthrough of Prince St on Monday after working hours.',
    formType: 'bottom'
  }
];

export default function App() {
  const [leads, setLeads] = useState<PropertyLead[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [prefillType, setPrefillType] = useState<string>('');
  const [bannerAlertDismissed, setBannerAlertDismissed] = useState(false);

  // Load leads from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('east_coast_buyers_leads');
    if (stored) {
      try {
        setLeads(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse leads from local storage', e);
        setLeads([]);
      }
    } else {
      // In first-load, we seed the sample leads to provide instant interactivity!
      localStorage.setItem('east_coast_buyers_leads', JSON.stringify(SAMPLE_LEADS));
      setLeads(SAMPLE_LEADS);
    }
  }, []);

  // Sync leads back to localStorage
  const saveLeadsToStorage = (updatedLeads: PropertyLead[]) => {
    setLeads(updatedLeads);
    localStorage.setItem('east_coast_buyers_leads', JSON.stringify(updatedLeads));
  };

  // Create new property lead
  const handleAddNewLead = (newLeadData: Omit<PropertyLead, 'id' | 'submittedAt' | 'status'>) => {
    const brandNewLead: PropertyLead = {
      ...newLeadData,
      id: 'lead-' + Math.random().toString(36).substr(2, 9),
      submittedAt: new Date().toISOString(),
      status: 'new'
    };
    saveLeadsToStorage([brandNewLead, ...leads]);
  };

  // Dashboard state controls
  const handleUpdateLeadStatus = (id: string, status: PropertyLead['status']) => {
    const updated = leads.map(l => l.id === id ? { ...l, status } : l);
    saveLeadsToStorage(updated);
  };

  const handleUpdateLeadNotes = (id: string, notes: string) => {
    const updated = leads.map(l => l.id === id ? { ...l, notes } : l);
    saveLeadsToStorage(updated);
  };

  const handleDeleteLead = (id: string) => {
    const updated = leads.filter(l => l.id !== id);
    saveLeadsToStorage(updated);
  };

  const handleClearAllLeads = () => {
    saveLeadsToStorage([]);
  };

  const handleSeedSampleLeads = () => {
    saveLeadsToStorage(SAMPLE_LEADS);
  };

  // Handle clicking a card in the property types grid
  const handlePropertyTypePrefill = (prefillCondition: string) => {
    setPrefillType(prefillCondition);
    
    // Smoothly scroll to the top form anchor
    const element = document.getElementById('property-form-top-anchor');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 pt-16 flex flex-col selection:bg-maritime-200 selection:text-maritime-900">
      
      {/* Header component */}
      <Header 
        onOpenAdmin={() => setIsAdminOpen(true)} 
        leadCount={leads.filter(l => l.status === 'new').length}
      />

      {/* Top Notification Banner / Flyer Callout */}
      {!bannerAlertDismissed && (
        <div className="bg-maritime-950 text-white border-b border-maritime-800 py-2 sm:py-2.5 px-4 sticky top-[65px] z-30 transition-all text-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 mx-auto sm:mx-0">
              <Megaphone className="h-3.5 w-3.5 text-accent-gold flex-shrink-0 animate-bounce" />
              <p className="leading-tight font-medium text-center sm:text-left">
                Received an East Coast Buyers Flyer in your mailbox? Use our portal below for direct processing.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <span className="font-mono text-[9px] bg-maritime-800 hover:bg-maritime-700 px-2 py-0.5 rounded text-stone-300">
                Flyer Campaign 2026-NS
              </span>
              <button 
                onClick={() => setBannerAlertDismissed(true)}
                className="text-white hover:text-accent-gold underline cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-maritime-100/40 via-white to-stone-50 pb-16 pt-10 sm:pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Direct Trust Copy */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-maritime-50 border border-maritime-100 rounded-full text-xs font-semibold text-maritime-900">
                <MapPin className="h-3.5 w-3.5 text-maritime-600" />
                Active across HRM, Halifax, Dartmouth, Truro & Nova Scotia
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-950 leading-tight">
                Thinking About Selling <span className="text-transparent bg-clip-text bg-gradient-to-r from-maritime-900 to-maritime-600">Your Property?</span>
              </h1>
              
              <p className="text-base sm:text-lg text-stone-600 max-w-2xl leading-relaxed">
                We help local homeowners explore a simpler way to sell. Whether you inherited a vacant house, own an outdated rental, or simply want custom Closing options, we provide a direct property review with no fees, no showings, and zero pressure.
              </p>

              {/* Quality Badging Row */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                <div className="flex items-start gap-2">
                  <div className="h-5 w-5 bg-teal-50 border border-teal-100 text-teal-700 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <span className="block font-bold text-stone-950 text-xs">Sell 100% As-Is</span>
                    <span className="block text-[10px] text-stone-500">No repairs, cleaning or painting</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="h-5 w-5 bg-teal-50 border border-teal-100 text-teal-700 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <span className="block font-bold text-stone-950 text-xs">Save Commissions</span>
                    <span className="block text-[10px] text-stone-500">Zero broker commissions or fees</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 col-span-2 md:col-span-1">
                  <div className="h-5 w-5 bg-teal-50 border border-teal-100 text-teal-700 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <span className="block font-bold text-stone-950 text-xs">Custom Close Date</span>
                    <span className="block text-[10px] text-stone-500">10 days or several months</span>
                  </div>
                </div>
              </div>

              {/* Secondary Trust Signoff block */}
              <div className="p-4 rounded-xl border border-stone-200/65 bg-stone-100/50 flex items-center gap-3 max-w-xl">
                <Info className="h-5 w-5 text-maritime-700 flex-shrink-0" />
                <p className="text-xs text-stone-500 leading-normal">
                  <strong>We are direct property buyers, not listing agents.</strong> This means we focus strictly on evaluating your property with our own cash reserves — no waiting for traditional banks or listing contracts.
                </p>
              </div>
            </div>

            {/* Right Column: Hero Form with top anchor */}
            <div id="property-form-top-anchor" className="lg:col-span-5 scroll-mt-24">
              <PropertyForm 
                formId="lead-form-hero" 
                formType="top" 
                onSubmitSuccess={handleAddNewLead}
                prefillPropertyType={prefillType}
              />
            </div>

          </div>
        </div>
      </section>

      {/* Clean Step Workflow Section */}
      <section className="py-16 bg-white border-y border-stone-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[10px] font-bold text-maritime-700 uppercase tracking-widest block mb-1">Simple Three-Step Path</span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-stone-950 tracking-tight">
              How Our Direct Review Works
            </h2>
            <p className="text-sm sm:text-base text-stone-500 mt-2">
              We've stripped away the complexity of selling a home. Here is how we start the conversation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="relative p-6 rounded-2xl bg-stone-50 border border-stone-100/60 flex flex-col justify-between hover:scale-[1.01] transition-transform text-left">
              <div>
                <span className="font-mono text-4xl font-extrabold text-maritime-200 block mb-3">01</span>
                <h3 className="font-display font-bold text-stone-900 text-base sm:text-lg mb-2">Submit Property Details</h3>
                <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
                  Enter your address and general condition on this page. Takes about 45 seconds. Your details remain perfectly secure.
                </p>
              </div>
              <div className="h-1.5 w-12 bg-maritime-600 rounded-full mt-4" />
            </div>

            {/* Step 2 */}
            <div className="relative p-6 rounded-2xl bg-stone-50 border border-stone-100/60 flex flex-col justify-between hover:scale-[1.01] transition-transform text-left">
              <div>
                <span className="font-mono text-4xl font-extrabold text-maritime-200 block mb-3">02</span>
                <h3 className="font-display font-bold text-stone-900 text-base sm:text-lg mb-2">We Assess the Assets</h3>
                <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
                  Our maritime team evaluates geographic data registers, neighborhood comps, and repair diagnostic sheets to determine municipal opportunity.
                </p>
              </div>
              <div className="h-1.5 w-12 bg-maritime-600 rounded-full mt-4" />
            </div>

            {/* Step 3 */}
            <div className="relative p-6 rounded-2xl bg-stone-50 border border-stone-100/60 flex flex-col justify-between hover:scale-[1.01] transition-transform text-left">
              <div>
                <span className="font-mono text-4xl font-extrabold text-maritime-200 block mb-3">03</span>
                <h3 className="font-display font-bold text-stone-900 text-base sm:text-lg mb-2">Discuss Your Options</h3>
                <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
                  If there is a dual fit, we make a clear offer. If not, we will happily provide helpful feedback on listing your property traditionally. No pressure.
                </p>
              </div>
              <div className="h-1.5 w-12 bg-accent-gold rounded-full mt-4" />
            </div>

          </div>
        </div>
      </section>

      {/* Property Types Section */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-[10px] font-bold text-maritime-700 uppercase tracking-widest block mb-1">What We Look For</span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-stone-950 tracking-tight">
              Properties We Regularly Purchase
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-2">
              We review properties in any structural status. Click below to automatically configure the inquiry fields for that property type.
            </p>
          </div>

          <PropertyTypesGrid onSelectType={handlePropertyTypePrefill} />
        </div>
      </section>

      {/* Interactive Estimator Section */}
      <section className="py-16 bg-white border-b border-stone-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-[10px] font-bold text-maritime-700 uppercase tracking-widest block mb-1">Direct Valuation Formula</span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-stone-950 tracking-tight">
              Calculate Your Direct Cash Offer Estimate
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-2">
              Our estimate computes comparable home registers across Nova Scotia minus specific wholesale parameters. No hidden realtor commission, zero staging fees.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <MaritimeOfferEstimator onApplyEstimates={(cond, details) => {
              setPrefillType(details);
              const element = document.getElementById('property-form-top-anchor');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }} />
          </div>
        </div>
      </section>

      {/* Comparison section */}
      <section className="py-16 bg-stone-100/45 border-y border-stone-200/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[10px] font-bold text-maritime-700 uppercase tracking-widest block mb-1">Side-by-Side Review</span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-stone-950 tracking-tight">
              East Coast Buyers vs. Listing Agents
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-2">
              Traditional realtors want to list your home. We actually want to purchase it. See how our paths compare below.
            </p>
          </div>

          <ComparisonTable />
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[10px] font-bold text-maritime-700 uppercase tracking-widest block mb-1">No Secrets Accordion</span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-stone-950 tracking-tight">
              Homeowner FAQs
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-2">
              Selling a property can feel confusing. Here are raw, direct answers to common Nova Scotia homeowner questions.
            </p>
          </div>

          <FAQAccordion />
        </div>
      </section>

      {/* Bottom Form + Final Call to action with bottom form anchor */}
      <section id="property-form-bottom-anchor" className="py-20 bg-maritime-950 text-white relative overflow-hidden scroll-mt-24">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-accent-gold blur-3xl" />
          <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-teal-500 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column Text details */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <span className="text-[10px] font-bold text-accent-gold uppercase tracking-widest block">Get Started Today</span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Have a Property in Nova Scotia You Want to Sell?
              </h2>
              <p className="text-sm sm:text-base text-maritime-100/80 leading-relaxed max-w-xl">
                Submit the property details in our secure form. One of our local Nova Scotia property coordinators will review geographic parameters and respond shortly. Absolutely no obligation, listing fees or high-pressure phone calls.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3">
                  <span className="h-8 w-8 rounded-lg bg-maritime-900 border border-maritime-800 flex items-center justify-center text-accent-gold font-mono font-bold text-xs">
                    NS
                  </span>
                  <div>
                    <span className="block text-xs font-semibold text-white">Halifax & Surrounding Regional Municipalities</span>
                    <span className="block text-[10px] text-maritime-100/60">Dartmouth, Bedford, Sackville, Eastern Passage, Cole Harbour</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="h-8 w-8 rounded-lg bg-maritime-900 border border-maritime-800 flex items-center justify-center text-accent-gold font-mono font-bold text-xs">
                    NS
                  </span>
                  <div>
                    <span className="block text-xs font-semibold text-white">Central & Maritime Hub Zones</span>
                    <span className="block text-[10px] text-maritime-100/60">Truro, New Glasgow, Pictou, Amherst, Antigonish</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="h-8 w-8 rounded-lg bg-maritime-900 border border-maritime-800 flex items-center justify-center text-accent-gold font-mono font-bold text-xs">
                     NS
                  </span>
                  <div>
                    <span className="block text-xs font-semibold text-white">Valley, South Shore & Cape Breton</span>
                    <span className="block text-[10px] text-maritime-100/60">Kentville, Bridgewater, Liverpool, Yarmouth, Sydney, Glace Bay</span>
                  </div>
                </div>
              </div>

              {/* Direct Support details */}
              <div className="pt-6 border-t border-maritime-800 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full border border-maritime-800 bg-maritime-900 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-accent-gold animate-bounce" />
                </div>
                <div>
                  <span className="block text-[10px] text-maritime-100/60 uppercase tracking-widest font-mono">Talk to a Coordinator Directly</span>
                  <a href="tel:+19025555555" className="block text-lg font-bold text-accent-gold hover:underline">
                    (902) 555-5555
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column Form with bottom theme */}
            <div className="lg:col-span-6">
              <PropertyForm 
                formId="lead-form-bottom" 
                formType="bottom" 
                onSubmitSuccess={handleAddNewLead}
              />
            </div>

          </div>
        </div>
      </section>

      {/* Footer view */}
      <footer className="bg-stone-900 text-stone-400 py-12 border-t border-stone-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-stone-800">
            <div className="flex items-center gap-2 text-left">
              <div className="h-8 w-8 rounded-lg bg-stone-850 flex items-center justify-center text-white font-bold leading-none">
                EC
              </div>
              <div>
                <span className="font-display font-bold text-sm tracking-tight text-white block">
                  East Coast Buyers
                </span>
                <span className="text-[10px] font-mono text-stone-500">
                  Local Nova Scotia Direct Property Liquidations
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-stone-500">
              <a href="#property-form-top-anchor" className="hover:text-stone-300">Submit Property Details</a>
              <span className="text-stone-700 font-mono">•</span>
              <a href="tel:+19025555555" className="hover:text-stone-300">Direct Line: (902) 555-5555</a>
              <span className="text-stone-700 font-mono">•</span>
              <button 
                onClick={() => setIsAdminOpen(true)}
                className="text-maritime-500 hover:text-maritime-400 cursor-pointer text-xs underline underline-offset-2"
              >
                Launch Admin Console
              </button>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-stone-500 text-center sm:text-left">
            <div>
              <p>&copy; {new Date().getFullYear()} East Coast Buyers Group Ltd. All rights reserved.</p>
              <p className="mt-1">Nova Scotia register comp numbers available on requested review. Standard terms apply.</p>
            </div>
            
            <div className="flex items-center gap-1">
              <Lock className="h-3 w-3 text-stone-600" />
              <span>We never sell or distribute listing parameters to third-party marketing brokers.</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Sticky Mobile Call & Action Floating Footer (hidden above md size) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-45 bg-white border-t border-stone-200/85 px-4 py-3 pb-safe-bottom flex items-center justify-between gap-3 floating-cta-shadow">
        <a 
          href="tel:+19025555555"
          className="flex h-11 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-900 border border-slate-200 font-semibold"
          title="Call Coordinator"
        >
          <Phone className="h-5 w-5 text-maritime-800" />
        </a>
        <a 
          href="#property-form-top-anchor"
          className="flex-1 flex items-center justify-center gap-1.5 h-11 rounded-xl text-white font-bold text-xs bg-maritime-800 shadow-lg shadow-blue-200 active:scale-[0.98] transition-transform"
        >
          <Sparkles className="h-3.5 w-3.5 text-white" />
          Get Free Review Now
        </a>
      </div>

      {/* Admin Side Sheet / Dashboard Overlay */}
      <AnimatePresence>
        {isAdminOpen && (
          <AdminDashboard 
            isOpen={isAdminOpen}
            onClose={() => setIsAdminOpen(false)}
            leads={leads}
            onUpdateStatus={handleUpdateLeadStatus}
            onUpdateNotes={handleUpdateLeadNotes}
            onDeleteLead={handleDeleteLead}
            onClearAllLeads={handleClearAllLeads}
            onSeedSampleLeads={handleSeedSampleLeads}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
