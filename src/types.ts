export interface PropertyLead {
  id: string;
  address: string;
  name: string;
  phone: string;
  email: string;
  details: string;
  submittedAt: string;
  status: 'new' | 'reviewed' | 'contacted' | 'archived';
  notes?: string;
  formType: 'top' | 'bottom';
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface ComparisonRow {
  feature: string;
  eastCoastBuyers: string;
  eastCoastStatus: 'positive' | 'neutral' | 'negative';
  traditionalListing: string;
  traditionalStatus: 'positive' | 'neutral' | 'negative';
}
