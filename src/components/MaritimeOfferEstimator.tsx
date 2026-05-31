import React, { useState, useEffect } from 'react';
import { ShieldCheck, TrendingUp, Hammer, DollarSign, ArrowRight, Sparkles, Building2 } from 'lucide-react';

interface MaritimeOfferEstimatorProps {
  onApplyEstimates: (condition: string, estimatedValueLine: string) => void;
}

const REGION_VALUES = [
  { region: "Halifax (HRM)", compValue: 560000, desc: "High development / dense comp environment" },
  { region: "Dartmouth / Bedford", compValue: 510000, desc: "Stable suburban comp range" },
  { region: "Cape Breton", compValue: 280000, desc: "Historic coastal community holdings" },
  { region: "Truro / Central NS", compValue: 340000, desc: "Maritime hub agricultural holdings" },
  { region: "Annapolis Valley", compValue: 390000, desc: "Agricultural & wine valley comp baselines" },
  { region: "South Shore / Coastal", compValue: 420000, desc: "Active vacation comp parameters" }
];

export default function MaritimeOfferEstimator({ onApplyEstimates }: MaritimeOfferEstimatorProps) {
  const [selectedRegionIndex, setSelectedRegionIndex] = useState(0);
  const [repairLevel, setRepairLevel] = useState(25); // percentage slider
  const [customSquareFeet, setCustomSquareFeet] = useState(1600);

  const activeRegion = REGION_VALUES[selectedRegionIndex];
  
  // Calculate comparable parameters
  const baselineValue = (activeRegion.compValue * (customSquareFeet / 1650));
  
  // Calculate repairs based on square feet and level
  // level 0-100: 0 means good condition, 100 means heavy water/roof damage
  const maxRepairCostPerSqFt = 75; // Heavy foundation/structural
  const repairCost = Math.round(customSquareFeet * (repairLevel / 100) * maxRepairCostPerSqFt);
  
  // Traditional Agent commission savings (typically 5% in Nova Scotia)
  const agentCommissionPercent = 0.05;
  const traditionalCommission = Math.round(baselineValue * agentCommissionPercent);
  
  // Closing/legal fees (typically 1.5%)
  const legalClosingFees = Math.round(baselineValue * 0.015);
  
  // Custom Cash Offer Calculation (Comparable value - local repair factor)
  const directCashOffer = Math.max(80000, Math.round(baselineValue - repairCost));

  // Determine equivalent condition name
  const getConditionName = (lvl: number) => {
    if (lvl < 15) return "Good Condition";
    if (lvl < 45) return "Needs Minor Repairs";
    if (lvl < 75) return "Needs Major Repairs";
    return "Vacant / Abandoned";
  };

  const currentConditionName = getConditionName(repairLevel);

  const handlePrefillClick = () => {
    const diagnosticLine = `[Offer Estimator Summary]\nRegion Target: ${activeRegion.region}\nEstimated SqFt: ${customSquareFeet} sq ft\nCondition Estimate Level: ${repairLevel}% (${currentConditionName})\nCalculated Comp Base: $${Math.round(baselineValue).toLocaleString()}\nCalculated Repair Projection: $${repairCost.toLocaleString()}\nCalculated direct cash offer: $${directCashOffer.toLocaleString()}`;
    onApplyEstimates(currentConditionName, diagnosticLine);
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden text-left hover:border-slate-300 transition-all duration-300">
      
      {/* Header */}
      <div className="p-6 bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="inline-flex items-center gap-1 rounded bg-maritime-800 text-maritime-100 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide">
              <Sparkles className="h-2.5 w-2.5 text-accent-amber animate-pulse" />
              Interactive Tool
            </span>
            <span className="text-[10px] text-slate-400 font-mono">100% Free Diagnostics</span>
          </div>
          <h3 className="font-display text-lg sm:text-xl font-bold tracking-tight text-white">
            Maritime Direct Cash Offer Estimator
          </h3>
          <p className="text-xs text-slate-400">
            See how the direct buying formula compares to traditional listings instantly.
          </p>
        </div>
        <div className="flex h-10 min-w-10 items-center justify-center rounded-xl bg-slate-800 text-accent-amber font-mono font-bold text-lg border border-slate-700">
          96%
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        
        {/* Controls Column */}
        <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
          
          {/* Step 1: Region Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              1. Choose Property Region
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {REGION_VALUES.map((r, idx) => (
                <button
                  key={r.region}
                  type="button"
                  onClick={() => setSelectedRegionIndex(idx)}
                  className={`px-3 py-2 text-xs rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                    selectedRegionIndex === idx
                      ? 'bg-maritime-100 text-maritime-900 border-maritime-800 font-semibold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="block truncate">{r.region}</span>
                  <span className="block text-[9px] text-slate-400 font-mono mt-0.5">
                    ~${(r.compValue / 1000).toFixed(0)}k comps
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            
            {/* Step 2: Custom Footprint */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  2. Est. Home Size
                </label>
                <span className="text-xs font-mono font-bold text-maritime-900 bg-maritime-50 px-2 py-0.5 rounded">
                  {customSquareFeet.toLocaleString()} Sq.Ft.
                </span>
              </div>
              <input
                type="range"
                min="800"
                max="3500"
                step="50"
                value={customSquareFeet}
                onChange={(e) => setCustomSquareFeet(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-maritime-800 focus:outline-none"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>800 sq.ft</span>
                <span>Medium (1,600)</span>
                <span>3,500 sq.ft</span>
              </div>
            </div>

            {/* Step 3: Repair Severity */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  3. Structural Repairs
                </label>
                <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  {currentConditionName} ({repairLevel}%)
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={repairLevel}
                onChange={(e) => setRepairLevel(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-maritime-800 focus:outline-none"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>None (As-is)</span>
                <span>Moderate Leak</span>
                <span>Heavy Repair</span>
              </div>
            </div>

          </div>

          {/* Educational Formula explanation */}
          <div className="p-4 rounded-2xl bg-amber-50/20 border border-slate-100 flex items-start gap-3">
            <Hammer className="h-5 w-5 text-maritime-700 flex-shrink-0 mt-0.5" />
            <div>
              <span className="block text-xs font-bold text-slate-900 leading-tight">
                How We Calculate Our Offers (No Hidden Deductions)
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Comparable neighborhood sale bounds are derived from municipal registry updates. We deduct estimated contractor repairs strictly as wholesale parameters with no markup, then purchase the home as stands with <strong className="text-slate-800">$0 realtor commissions.</strong>
              </p>
            </div>
          </div>

        </div>

        {/* Output Column */}
        <div className="lg:col-span-5 p-6 sm:p-8 bg-slate-50 flex flex-col justify-between">
          
          <div className="space-y-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Estimated Offer Overview
            </span>

            {/* Comparable Value Baseline */}
            <div className="flex justify-between items-center text-xs pb-2.5 border-b border-slate-200">
              <span className="text-slate-500 font-sans">Comp Market baseline value</span>
              <span className="font-mono font-bold text-slate-700">
                ${Math.round(baselineValue).toLocaleString()}
              </span>
            </div>

            {/* Structural Reparations offset */}
            <div className="flex justify-between items-center text-xs py-2.5 border-b border-slate-200">
              <span className="text-slate-500 flex items-center gap-1">
                Wholesale repairs offset
              </span>
              <span className="font-mono font-semibold text-rose-600">
                -${repairCost.toLocaleString()}
              </span>
            </div>

            {/* Commissions Saved */}
            <div className="flex justify-between items-center text-xs py-2.5 border-b border-slate-200">
              <span className="text-slate-500 text-xs">Traditional Realtor fees saved (with us)</span>
              <span className="font-mono font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded border border-teal-100/50">
                +${traditionalCommission.toLocaleString()}
              </span>
            </div>

            {/* Estimated cash offer line */}
            <div className="py-3">
              <span className="text-[10px] font-bold text-slate-400 block mb-1">
                Your Estimated Cash Offer Range
              </span>
              <div className="text-3xl font-display font-extrabold text-slate-900 tracking-tight">
                ${(directCashOffer * 0.95).toLocaleString(undefined, {maximumFractionDigits: 0})} <span className="text-sm font-normal text-slate-500">to</span> ${(directCashOffer * 1.05).toLocaleString(undefined, {maximumFractionDigits: 0})}
              </div>
              <p className="text-[10px] text-slate-400 mt-1 leading-normal font-sans">
                Range corresponds to custom local attributes inside the {activeRegion.region} zone.
              </p>
            </div>

          </div>

          <div className="pt-4 border-t border-slate-200 mt-4 sm:mt-0">
            <button
              onClick={handlePrefillClick}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-bold text-xs bg-maritime-800 hover:bg-maritime-850 active:scale-[0.99] transition-all cursor-pointer shadow-md shadow-blue-500/10"
            >
              Apply Estimates & Prefill Property Form
              <ArrowRight className="h-4 w-4" />
            </button>
            <span className="block text-[9px] text-center text-slate-400 mt-2 font-mono">
              Apply defaults to configure the review fields instantly.
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
