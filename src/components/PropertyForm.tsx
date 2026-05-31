import React, { useState } from 'react';
import { Mail, Phone, User, MapPin, Building2, HelpCircle, Check, Loader2, FileText, Sparkles } from 'lucide-react';
import { PropertyLead } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface PropertyFormProps {
  formId: string;
  formType: 'top' | 'bottom';
  onSubmitSuccess: (lead: Omit<PropertyLead, 'id' | 'submittedAt' | 'status'>) => void;
  prefillPropertyType?: string;
}

const NOVA_SCOTIA_REGIONS = [
  'Halifax (HRM)',
  'Dartmouth / Bedford',
  'Cape Breton (Sydney / Glace Bay)',
  'Truro / Central NS',
  'Annapolis Valley (Kentville / Wolfville)',
  'South Shore (Yarmouth / Lunenburg)',
  'Antigonish / New Glasgow',
  'Other / Rural Nova Scotia'
];

export default function PropertyForm({ formId, formType, onSubmitSuccess, prefillPropertyType }: PropertyFormProps) {
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [region, setRegion] = useState('');
  const [propertyType, setPropertyType] = useState(prefillPropertyType || '');
  const [details, setDetails] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (prefillPropertyType) {
      if (prefillPropertyType.includes('\n')) {
        // Parse multi-line estimator prefill
        const lines = prefillPropertyType.split('\n');
        const condLine = lines.find(l => l.includes('Condition Estimate Level:'));
        
        // Auto-select region from region match
        const regionLine = lines.find(l => l.includes('Region Target:'));
        if (regionLine) {
          const matchedRegion = NOVA_SCOTIA_REGIONS.find(r => regionLine.includes(r.split(' ')[0]));
          if (matchedRegion) {
            setRegion(matchedRegion);
          }
        }

        if (condLine) {
          if (condLine.includes('Good')) setPropertyType('Good Condition');
          else if (condLine.includes('Minor')) setPropertyType('Needs Minor Repairs');
          else if (condLine.includes('Major')) setPropertyType('Needs Major Repairs');
          else if (condLine.includes('Vacant')) setPropertyType('Vacant / Abandoned');
          else if (condLine.includes('Estate')) setPropertyType('Inherited Estate');
        }
        setDetails(prefillPropertyType);
      } else {
        setPropertyType(prefillPropertyType);
        setDetails('');
      }
    }
  }, [prefillPropertyType]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!address.trim()) {
      newErrors.address = 'Property address is required';
    } else if (address.trim().length < 8) {
      newErrors.address = 'Please provide a complete street address';
    }

    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    }

    const cleanedPhone = phone.replace(/\D/g, '');
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (cleanedPhone.length < 10) {
      newErrors.phone = 'Please provide a valid 10-digit phone number';
    }

    if (email.trim() && !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please provide a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate clean local submission API delay
    setTimeout(() => {
      onSubmitSuccess({
        address: address.trim() + (region ? `, ${region}` : ''),
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        details: [
          propertyType ? `[Type: ${propertyType}]` : '',
          details.trim()
        ].filter(Boolean).join('\n'),
        formType
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Clear form inputs
      setAddress('');
      setName('');
      setPhone('');
      setEmail('');
      setRegion('');
      setPropertyType('');
      setDetails('');
    }, 900);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Simple automatic US/Canada formatting: (XXX) XXX-XXXX
    const cleaned = val.replace(/\D/g, '');
    let formatted = val;
    if (cleaned.length > 0) {
      if (cleaned.length <= 3) {
        formatted = `(${cleaned}`;
      } else if (cleaned.length <= 6) {
        formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
      } else {
        formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
      }
    }
    setPhone(formatted);
  };

  const isDarkMode = formType === 'bottom';

  return (
    <div id={formId} className="w-full">
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`w-full rounded-2xl p-5 sm:p-8 ${
              isDarkMode 
                ? 'bg-maritime-950 text-white border border-maritime-800 medium-card-shadow' 
                : 'bg-white text-gray-900 shadow-xl border border-gray-100 medium-card-shadow'
            }`}
          >
            <div className="mb-6">
              <div className="flex items-center gap-1.5 mb-2">
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                  isDarkMode ? 'bg-maritime-800 text-maritime-100' : 'bg-maritime-100 text-maritime-800'
                }`}>
                  <Sparkles className="h-3 w-3 mr-1 animate-pulse" />
                  Quick Property Review
                </span>
                <span className="text-xs text-gray-400 font-mono">NS Direct</span>
              </div>
              <h3 className={`font-display text-xl sm:text-2xl font-bold tracking-tight ${
                isDarkMode ? 'text-white' : 'text-maritime-950'
              }`}>
                Review My Property Details
              </h3>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-maritime-100/70' : 'text-gray-500'}`}>
                Takes less than a minute. No obligations, no commitments, 100% private.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Property Address */}
              <div>
                <label className={`block text-xs font-semibold mb-1 text-left ${
                  isDarkMode ? 'text-maritime-100' : 'text-gray-700'
                }`}>
                  Property Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (errors.address) setErrors(prev => ({ ...prev, address: '' }));
                    }}
                    placeholder="123 Main Street, Halifax, NS"
                    className={`block w-full pl-9 pr-3 py-2.5 rounded-lg text-sm bg-stone-50 text-stone-900 border transition-all placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-maritime-500 focus:bg-white ${
                      errors.address ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                </div>
                {errors.address && (
                  <p className="text-red-500 text-[11px] mt-1 text-left">{errors.address}</p>
                )}
              </div>

              {/* Grid 1: Name and Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold mb-1 text-left ${
                    isDarkMode ? 'text-maritime-100' : 'text-gray-700'
                  }`}>
                    Your Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                      }}
                      placeholder="Full Name"
                      className={`block w-full pl-9 pr-3 py-2.5 rounded-lg text-sm bg-stone-50 text-stone-900 border transition-all placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-maritime-500 focus:bg-white ${
                        errors.name ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-[11px] mt-1 text-left">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1 text-left ${
                    isDarkMode ? 'text-maritime-100' : 'text-gray-700'
                  }`}>
                    Phone Number *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Phone className="h-4 w-4" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => {
                        handlePhoneChange(e);
                        if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                      }}
                      placeholder="(902) 555-5555"
                      className={`block w-full pl-9 pr-3 py-2.5 rounded-lg text-sm bg-stone-50 text-stone-900 border transition-all placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-maritime-500 focus:bg-white ${
                        errors.phone ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-[11px] mt-1 text-left">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Grid 2: Nova Scotia Region and Property Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold mb-1 text-left ${
                    isDarkMode ? 'text-maritime-100' : 'text-gray-700'
                  }`}>
                    Nova Scotia Region
                  </label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="block w-full px-3 py-2.5 rounded-lg text-sm bg-stone-50 text-stone-900 border border-gray-200 transition-all focus:outline-none focus:ring-2 focus:ring-maritime-500 focus:bg-white cursor-pointer"
                  >
                    <option value="">Select Region...</option>
                    {NOVA_SCOTIA_REGIONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1 text-left ${
                    isDarkMode ? 'text-maritime-100' : 'text-gray-700'
                  }`}>
                    General Property Condition
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="block w-full px-3 py-2.5 rounded-lg text-sm bg-stone-50 text-stone-900 border border-gray-200 transition-all focus:outline-none focus:ring-2 focus:ring-maritime-500 focus:bg-white cursor-pointer"
                  >
                    <option value="">Choose Condition...</option>
                    <option value="Good Condition">Requires No Repairs (Good)</option>
                    <option value="Needs Minor Repairs">Needs Minor Cosmetic Fixes</option>
                    <option value="Needs Major Repairs">Needs Major/Heavy Repairs</option>
                    <option value="Vacant / Abandoned">Vacant or Untouched for years</option>
                    <option value="Inherited Estate">Inherited Property / Estate sale</option>
                  </select>
                </div>
              </div>

              {/* Optional Email Address */}
              <div>
                <label className={`block text-xs font-semibold mb-1 text-left ${
                  isDarkMode ? 'text-maritime-100' : 'text-gray-700'
                }`}>
                  Email Address <span className="text-[10px] text-gray-500 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                    }}
                    placeholder="you@email.com"
                    className={`block w-full pl-9 pr-3 py-2.5 rounded-lg text-sm bg-stone-50 text-stone-900 border transition-all placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-maritime-500 focus:bg-white ${
                      errors.email ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-[11px] mt-1 text-left">{errors.email}</p>
                )}
              </div>

              {/* Additional comments / details */}
              <div>
                <label className={`block text-xs font-semibold mb-1 text-left ${
                  isDarkMode ? 'text-maritime-100' : 'text-gray-700'
                }`}>
                  About the Property / Reason for Selling
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none text-gray-400">
                    <FileText className="h-4 w-4" />
                  </div>
                  <textarea
                    rows={3}
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Brief description of the property status, condition, rental situation, or when you had hoped to sell..."
                    className="block w-full pl-9 pr-3 py-2.5 rounded-lg text-sm bg-stone-50 text-stone-900 border border-gray-200 transition-all placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-maritime-500 focus:bg-white resize-y"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-white font-bold text-sm bg-maritime-800 hover:bg-maritime-850 hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-150 transform active:scale-[0.99] disabled:opacity-50 cursor-pointer shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    Reviewing property...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 stroke-[3]" />
                    Get My Free Property Review
                  </>
                )}
              </button>

              <div className="flex items-start gap-1 pb-1">
                <HelpCircle className="h-3.5 w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-[10px] text-gray-400 text-left leading-normal">
                  No public postings or directory listings. Your information is guarded under total confidence and discussed only with our principal buyers.
                </p>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`w-full rounded-2xl p-6 sm:p-10 text-center ${
              isDarkMode 
                ? 'bg-maritime-900 border border-maritime-700 text-white shadow-xl' 
                : 'bg-white border border-maritime-100 text-gray-900 shadow-xl'
            }`}
          >
            <div className="mx-auto h-14 w-14 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 mb-4 shadow-inner">
              <Check className="h-7 w-7 stroke-[3]" />
            </div>
            
            <span className="text-[10px] tracking-wider uppercase font-mono text-teal-600 font-semibold mb-1 block">
              Inquiry Logged Successfully
            </span>
            <h3 className="font-display text-2xl font-bold tracking-tight mb-2">
              Review is Underway!
            </h3>
            
            <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
              Thank you, <strong className="text-gray-800">{name}</strong>. We've logged your request for <strong className="text-gray-800">{address}</strong>. Our local buyers will investigate the public property registers and reach out shortly!
            </p>

            <div className="p-4 rounded-xl text-left text-xs bg-stone-50 border border-gray-100 text-gray-600 mb-6 font-mono space-y-1">
              <div><span className="text-gray-400">Callback:</span> +1 {phone}</div>
              {email && <div><span className="text-gray-400">Email:</span> {email}</div>}
              <div><span className="text-gray-400">Reference ID:</span> EC-NS-{(Math.random() * 100000).toFixed(0)}</div>
            </div>

            <button
              onClick={() => setIsSubmitted(false)}
              className="text-xs font-semibold text-maritime-700 hover:text-maritime-900 underline underline-offset-4 cursor-pointer"
            >
              Submit another property
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
