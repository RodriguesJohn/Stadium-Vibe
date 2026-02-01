
import React from 'react';
import { MOMENT_FILTERS, MomentFilter } from '../types';

interface FilterSelectionProps {
  photo: string;
  onSelect: (filter: MomentFilter) => void;
  onBack: () => void;
}

const FilterSelection: React.FC<FilterSelectionProps> = ({ photo, onSelect, onBack }) => {
  return (
    <div className="flex-1 flex flex-col bg-neutral-950 overflow-hidden">
      <div className="relative h-1/2 bg-black flex items-center justify-center overflow-hidden">
        <img src={photo} alt="Original Capture" className="w-full h-full object-contain" />
        <div className="absolute top-0 left-0 p-8">
          <button onClick={onBack} className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-lg flex items-center justify-center text-white border border-white/10 hover:bg-black/80 transition shadow-2xl">
            <i className="fa-solid fa-chevron-left text-xl"></i>
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black to-transparent">
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">Select the Moment</h2>
          <p className="text-neutral-400 text-lg">Choose a filter that matches the match intensity.</p>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {MOMENT_FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => onSelect(filter)}
              className="flex items-center gap-5 p-5 rounded-3xl bg-neutral-900 border border-neutral-800 active:scale-95 transition hover:border-green-500/50 hover:bg-neutral-800 text-left group"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${filter.color} flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition duration-300`}>
                <i className={`fa-solid ${filter.icon} text-2xl`}></i>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-black italic uppercase text-white leading-none mb-1">{filter.name}</h3>
                <p className="text-neutral-500 text-sm font-medium leading-snug">{filter.description}</p>
              </div>
              <div className="text-neutral-700 group-hover:text-green-500 transition">
                <i className="fa-solid fa-chevron-right text-lg"></i>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSelection;
