// src/steps/Step1PropertyType.jsx
import React from 'react';
import semiDetachedImg from '../assets/semi-detached.png';
import detachedImg     from '../assets/detached.png';
import terracedImg     from '../assets/terraced.png';
import townHouseImg    from '../assets/town-house.png';
import bungalowImg     from '../assets/bungalow.png';
import flatImg         from '../assets/flat.png';

const PROPERTIES = [
  { id: 'semi-detached', label: 'Semi-Detached', letter: 'A', img: semiDetachedImg },
  { id: 'detached',      label: 'Detached',      letter: 'B', img: detachedImg     },
  { id: 'terraced',      label: 'Terraced',       letter: 'C', img: terracedImg     },
  { id: 'town-house',    label: 'Town House',     letter: 'D', img: townHouseImg    },
  { id: 'bungalow',      label: 'Bungalow',       letter: 'E', img: bungalowImg     },
  { id: 'flat',          label: 'Flat',           letter: 'F', img: flatImg         },
];

const Step1PropertyType = ({ onSelect }) => (
  <div className="flex flex-col h-full">
    <h2 className="animate-drop-in delay-0 text-2xl md:text-3xl font-black uppercase leading-tight text-navy mb-1">
      What type of property do you have?*
    </h2>
    <div className="animate-drop-in delay-1 w-10 h-[3px] bg-sky rounded-full mb-8" />

    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl w-full">
      {PROPERTIES.map((prop, i) => (
        <button key={prop.id} onClick={() => onSelect(prop.id)}
          className={`animate-drop-in delay-${i + 2} group flex flex-col items-center p-5 rounded-3xl border-2 border-sky-mid bg-white hover:border-navy hover:shadow-active transition-all duration-200 cursor-pointer`}>
          <img src={prop.img} alt={prop.label}
            className="h-20 w-auto object-contain mb-3 group-hover:scale-105 transition-transform duration-200 drop-shadow-md" />
          <div className="flex items-center gap-2 w-full">
            <span className="w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-lg text-[10px] font-black bg-sky-light text-navy border border-sky-mid group-hover:bg-navy group-hover:text-white group-hover:border-navy transition-all">
              {prop.letter}
            </span>
            <span className="text-xs font-black uppercase tracking-wide text-navy/70 group-hover:text-navy transition-colors">
              {prop.label}
            </span>
          </div>
        </button>
      ))}
    </div>

    <p className="animate-drop-in delay-7 text-[10px] text-navy/30 font-medium mt-6 uppercase tracking-widest">
      Select a type to continue automatically
    </p>
  </div>
);

export default Step1PropertyType;