import React from 'react';
import { Home, Key, FlameKindling, Hammer, Wrench, Building2, Map, ArrowRight, Sparkles } from 'lucide-react';

interface PropertyTypeCard {
  id: string;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  prefillCondition: string; // The value to select in the form
}

const PROPERTY_TYPES: PropertyTypeCard[] = [
  {
    id: 'older',
    title: "Older & Family Homes",
    desc: "Houses that have been owned for decades and need a general refresh or structural updates to meet modern standards.",
    icon: Home,
    prefillCondition: "Needs Minor Repairs"
  },
  {
    id: 'inherited',
    title: "Inherited Holdings & Estates",
    desc: "Properties passed down through families, probate clearances, or estates where the heirs prefer a direct cash settlement instead of repairs.",
    icon: Key,
    prefillCondition: "Inherited Estate",
    badge: "Most Common"
  },
  {
    id: 'vacant',
    title: "Vacant / Unoccupied Houses",
    desc: "Properties sitting empty, risking frozen pipes, or costing owners property tax and insurance overhead without representing active value.",
    icon: FlameKindling,
    prefillCondition: "Vacant / Abandoned"
  },
  {
    id: 'repairs',
    title: "Homes Needing Major Repairs",
    desc: "Properties with leaking roofs, structural moisture, failing foundations, or dated plumbing that would cause traditional buyers to walk away.",
    icon: Wrench,
    prefillCondition: "Needs Major Repairs"
  },
  {
    id: 'rentals',
    title: "Tenanted Rental Buildings",
    desc: "Properties with long-term tenants, local management difficulties, or landlords wishing to liquidate their portfolio calmly.",
    icon: Building2,
    prefillCondition: "Needs Minor Repairs"
  },
  {
    id: 'land',
    title: "Land & Redevelopment Lots",
    desc: "Subdividable land holdings, older tear-downs, or side-lots with solid municipal servicing potential inside Nova Scotia boundaries.",
    icon: Map,
    prefillCondition: "Needs Major Repairs"
  }
];

interface PropertyTypesProps {
  onSelectType: (prefill: string) => void;
}

export default function PropertyTypesGrid({ onSelectType }: PropertyTypesProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROPERTY_TYPES.map((card) => {
          const Icon = card.icon;
          return (
            <div 
              key={card.id}
              onClick={() => onSelectType(card.prefillCondition)}
              className="group relative flex flex-col justify-between p-6 rounded-2xl border border-gray-200 bg-white soft-card-shadow hover:border-maritime-700 hover:shadow-xl transition-all duration-300 cursor-pointer text-left"
            >
              {card.badge && (
                <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-accent-amber/10 px-2 py-0.5 text-[10px] font-bold text-accent-amber border border-accent-amber/20">
                  <Sparkles className="h-2.5 w-2.5" />
                  {card.badge}
                </span>
              )}
              
              <div>
                <div className="h-11 w-11 rounded-xl bg-maritime-50 text-maritime-800 flex items-center justify-center mb-4 transition-all group-hover:bg-maritime-900 group-hover:text-white group-hover:scale-105">
                  <Icon className="h-5 w-5" />
                </div>
                
                <h3 className="font-display font-bold text-stone-900 text-sm sm:text-base mb-1.5 group-hover:text-maritime-850 transition-colors">
                  {card.title}
                </h3>
                
                <p className="text-xs sm:text-xs text-stone-500 leading-relaxed mb-4">
                  {card.desc}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-maritime-700 font-bold group-hover:text-maritime-900 group-hover:underline underline-offset-4 pt-1 mt-auto">
                <span>Configure Form for this condition</span>
                <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
