import { Clipboard, X, Search, Check, Clock, Calendar, Phone, Mail, MapPin, Archive, Trash2, Tag, RefreshCw, Layers } from 'lucide-react';
import { PropertyLead } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  leads: PropertyLead[];
  onUpdateStatus: (id: string, status: PropertyLead['status']) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onDeleteLead: (id: string) => void;
  onClearAllLeads: () => void;
  onSeedSampleLeads: () => void;
}

export default function AdminDashboard({
  isOpen,
  onClose,
  leads,
  onUpdateStatus,
  onUpdateNotes,
  onDeleteLead,
  onClearAllLeads,
  onSeedSampleLeads
}: AdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [notesTemp, setNotesTemp] = useState('');

  if (!isOpen) return null;

  const filteredLeads = leads.filter(lead => 
    lead.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone.includes(searchTerm)
  );

  const selectedLead = leads.find(l => l.id === selectedLeadId);

  const getStatusColor = (status: PropertyLead['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'reviewed': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'contacted': return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <div className="absolute inset-0 overflow-hidden">
        {/* Backdrop overlay */}
        <div 
          onClick={onClose}
          className="absolute inset-0 bg-stone-900/60 transition-opacity backdrop-blur-xs" 
        />

        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10">
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="pointer-events-auto w-screen max-w-3xl"
          >
            <div className="flex h-full flex-col bg-white shadow-2xl border-l border-stone-200">
              {/* Header */}
              <div className="px-6 py-5 bg-maritime-900 text-white flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                  <Clipboard className="h-5 w-5 text-accent-gold" />
                  <div>
                    <h2 className="text-lg font-display font-bold tracking-tight text-white leading-tight">
                      Lead Submissions System
                    </h2>
                    <p className="text-xs text-maritime-100 font-sans">
                      Demonstration Dashboard • Safe Local Sandbox Storage
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-maritime-100 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Toolbar */}
              <div className="p-4 bg-stone-50 border-b border-stone-100 flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by address, name or phone..."
                    className="w-full text-xs pl-9 pr-4 py-2 bg-white rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-maritime-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  {leads.length === 0 && (
                    <button
                      onClick={onSeedSampleLeads}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-maritime-50 hover:bg-maritime-100 text-maritime-800 border border-maritime-200 rounded-lg transition-colors cursor-pointer"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Seed Sample Leads
                    </button>
                  )}
                  {leads.length > 0 && (
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to clear all lead history from this browser?')) {
                          onClearAllLeads();
                          setSelectedLeadId(null);
                        }
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" />
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              {/* Main Content Pane */}
              <div className="flex-1 flex overflow-hidden">
                {/* Leads List */}
                <div className="w-1/2 overflow-y-auto border-r border-stone-100 divide-y divide-stone-100">
                  {filteredLeads.length === 0 ? (
                    <div className="p-10 text-center text-stone-400">
                      <Layers className="h-8 w-8 mx-auto text-stone-300 mb-2" />
                      <p className="text-xs font-medium">No Lead inquiries recorded</p>
                      <p className="text-[10px] mt-1 text-stone-400">Fill out and submit either of the property forms to populate leads, or click "Seed Sample Leads" above.</p>
                    </div>
                  ) : (
                    filteredLeads.map((lead) => (
                      <div
                        key={lead.id}
                        onClick={() => {
                          setSelectedLeadId(lead.id);
                          setNotesTemp(lead.notes || '');
                        }}
                        className={`p-4 text-left cursor-pointer transition-colors ${
                          selectedLeadId === lead.id 
                            ? 'bg-maritime-50/70 border-l-4 border-maritime-700' 
                            : 'hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <span className="font-display font-bold text-xs text-stone-900 truncate block max-w-[150px]">
                            {lead.name}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold border ${getStatusColor(lead.status)}`}>
                            {lead.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 truncate mb-1.5">
                          {lead.address}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono">
                          <span>{lead.formType === 'top' ? 'Top Form' : 'Bottom Form'}</span>
                          <span>{new Date(lead.submittedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Selected Lead Details Panel */}
                <div className="w-1/2 p-5 overflow-y-auto bg-stone-50/50">
                  {selectedLead ? (
                    <div className="space-y-4 text-left">
                      <div>
                        <span className="text-[10px] font-bold text-maritime-700 uppercase tracking-wider block">Address</span>
                        <div className="flex items-start gap-1.5 mt-1 text-xs font-semibold text-stone-900">
                          <MapPin className="h-3.5 w-3.5 text-stone-400 flex-shrink-0 mt-0.5" />
                          <span>{selectedLead.address}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div>
                          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Homeowner</span>
                          <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-stone-800">
                            <span className="h-5 w-5 rounded-full bg-stone-200 flex items-center justify-center text-[10px]">
                              {selectedLead.name.charAt(0)}
                            </span>
                            <span className="truncate">{selectedLead.name}</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Phone</span>
                          <a href={`tel:${selectedLead.phone}`} className="flex items-center gap-1 mt-1 text-xs font-bold text-maritime-700 hover:underline">
                            <Phone className="h-3 w-3" />
                            <span>{selectedLead.phone}</span>
                          </a>
                        </div>
                      </div>

                      {selectedLead.email && (
                        <div className="pt-1">
                          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Email Address</span>
                          <a href={`mailto:${selectedLead.email}`} className="flex items-center gap-1 mt-1 text-xs font-medium text-stone-700 hover:underline">
                            <Mail className="h-3 w-3 text-stone-400" />
                            <span>{selectedLead.email}</span>
                          </a>
                        </div>
                      )}

                      <div className="pt-2">
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Owner Notes & Property Details</span>
                        <p className="mt-1 text-xs text-stone-600 bg-white p-2.5 rounded-lg border border-stone-200 whitespace-pre-wrap leading-relaxed">
                          {selectedLead.details || "No supplementary comments submitted"}
                        </p>
                      </div>

                      {/* Status controls */}
                      <div className="pt-2">
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">Update Contact Status</span>
                        <div className="grid grid-cols-2 gap-1.5">
                          {(['new', 'reviewed', 'contacted', 'archived'] as PropertyLead['status'][]).map((st) => (
                            <button
                              key={st}
                              onClick={() => onUpdateStatus(selectedLead.id, st)}
                              className={`px-2 py-1.5 text-[10px] font-bold rounded-md border text-center transition-all cursor-pointer truncate ${
                                selectedLead.status === st 
                                  ? 'bg-maritime-900 text-white border-maritime-900 shadow-sm' 
                                  : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
                              }`}
                            >
                              {st.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Notes Box */}
                      <div className="pt-2">
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Private Buyer Logging Notes</span>
                        <textarea
                          rows={3}
                          value={notesTemp}
                          onChange={(e) => {
                            setNotesTemp(e.target.value);
                            onUpdateNotes(selectedLead.id, e.target.value);
                          }}
                          placeholder="Type contact history, appraisal notes or action items..."
                          className="mt-1 block w-full text-xs p-2 bg-white rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-maritime-500 placeholder:text-stone-300 resize-y"
                        />
                        <span className="text-[9px] text-gray-400 leading-none">Auto-saves local notes.</span>
                      </div>

                      {/* Danger controls */}
                      <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                        <div className="text-[10px] text-stone-400 font-mono">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {new Date(selectedLead.submittedAt).toLocaleDateString()} at {new Date(selectedLead.submittedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                        <button
                          onClick={() => {
                            if (confirm('Delete this inquiry permanently?')) {
                              onDeleteLead(selectedLead.id);
                              setSelectedLeadId(null);
                            }
                          }}
                          className="flex items-center gap-1 text-rose-600 hover:text-rose-900 hover:bg-rose-50 px-2 py-1.5 rounded-md text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete Lead
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-stone-400 p-6 text-center">
                      <Clipboard className="h-10 w-10 text-stone-200 mb-2" />
                      <p className="text-xs font-semibold">Select an Inquiry</p>
                      <p className="text-[10px] text-stone-400">Click a homeowner on the left to review property diagnostics, update logging notes or trigger status badges.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
