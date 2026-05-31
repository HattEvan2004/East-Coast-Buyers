import { Check, X, ShieldAlert, ShieldCheck } from 'lucide-react';

interface RowData {
  factor: string;
  ecb: string;
  ecbOk: boolean;
  trad: string;
  tradOk: boolean;
  desc: string;
}

const COMPARISON_ROWS: RowData[] = [
  {
    factor: "Structural Repairs Needed?",
    ecb: "No Repairs Necessary",
    ecbOk: true,
    trad: "Mandatory Fixes or Price Cuts",
    tradOk: false,
    desc: "We look at homes exactly as they stand today, saving you thousands on painters and structural carpenters."
  },
  {
    factor: "Staging & Cleaning?",
    ecb: "Zero Cleanup Required",
    ecbOk: true,
    trad: "Rigorous Staging Required",
    tradOk: false,
    desc: "You can leave unwanted furniture, clutter, or trash behind. We manage all hauling post-completion."
  },
  {
    factor: "Home Inspections / Showings?",
    ecb: "No Open Houses or Showings",
    ecbOk: true,
    trad: "Endless Showings & Strangers",
    tradOk: false,
    desc: "A single walk-through with our team is all it takes. No tidy-ups for random Sunday open houses."
  },
  {
    factor: "Process Fees / Realtor Commission?",
    ecb: "Absolutely None",
    ecbOk: true,
    trad: "Up to 5% - 6% in Agent Commissions ",
    tradOk: false,
    desc: "Keep more of your hard-earned equity. We operate directly, meaning there are no hidden brokerage fees."
  },
  {
    factor: "Closing Options",
    ecb: "Flexible Closing Timeline",
    ecbOk: true,
    trad: "Dependent on Buyer Financing",
    tradOk: false,
    desc: "Need to wrap up in 10 days, or wait 3 months while downsized housing is prepared? You pick the date."
  },
  {
    factor: "Process Privacy",
    ecb: "100% Private Engagement",
    ecbOk: true,
    trad: "Public Listing and Comps Database",
    tradOk: false,
    desc: "Your reason for selling and property diagnostics are protected. No MLS public historical records."
  }
];

export default function ComparisonTable() {
  return (
    <div className="w-full">
      {/* Desktop view (shows as styled responsive table) */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-maritime-900 text-white">
              <th className="p-5 font-display font-bold text-sm tracking-wide">Key Selling Factors</th>
              <th className="p-5 font-display font-bold text-sm tracking-wide bg-maritime-850/80 border-x border-maritime-800">
                East Coast Buyers Direct Review
              </th>
              <th className="p-5 font-display font-bold text-sm tracking-wide">Traditional Listing Route</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {COMPARISON_ROWS.map((row) => (
              <tr key={row.factor} className="hover:bg-amber-50/20 transition-all">
                <td className="p-5 vertical-align-top">
                  <span className="font-semibold text-stone-900 text-sm block">{row.factor}</span>
                  <span className="text-xs text-stone-500 block mt-1 max-w-sm leading-normal">{row.desc}</span>
                </td>
                <td className="p-5 bg-maritime-50/20 border-x border-stone-100 font-medium">
                  <div className="flex items-start gap-2 text-sm text-maritime-900">
                    <ShieldCheck className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>{row.ecb}</span>
                  </div>
                </td>
                <td className="p-5 font-normal text-sm text-stone-700">
                  <div className="flex items-start gap-2">
                    <ShieldAlert className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span>{row.trad}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view (shows as beautiful list-based comparison layout) */}
      <div className="md:hidden space-y-4">
        {COMPARISON_ROWS.map((row) => (
          <div key={row.factor} className="p-5 rounded-xl border border-gray-100 bg-white soft-card-shadow space-y-3.5 text-left">
            <div>
              <h4 className="font-display font-bold text-stone-900 text-sm">{row.factor}</h4>
              <p className="text-[11px] text-stone-500 leading-normal mt-0.5">{row.desc}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-50 text-xs">
              <div className="p-2.5 rounded-lg bg-teal-50/50 border border-teal-100 space-y-0.5">
                <span className="font-mono text-[9px] uppercase tracking-wider text-teal-700 font-bold">East Coast Buyers</span>
                <p className="font-semibold text-teal-950 font-sans leading-tight">{row.ecb}</p>
              </div>

              <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-100 space-y-0.5">
                <span className="font-mono text-[9px] uppercase tracking-wider text-stone-400">Traditional route</span>
                <p className="text-stone-700 font-sans leading-tight">{row.trad}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
