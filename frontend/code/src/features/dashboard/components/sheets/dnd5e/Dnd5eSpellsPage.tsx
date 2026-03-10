import { Sparkles, Wand2, Flame } from 'lucide-react';

interface Dnd5eSpellsPageProps {
  localData: any;
  isEditing: boolean;
  updateNested: (path: string, value: any) => void;
}

export default function Dnd5eSpellsPage({ localData, isEditing, updateNested }: Dnd5eSpellsPageProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 p-8">
      {/* Spellcasting Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-10 bg-[#c9a84c]/5 border border-[#c9a84c]/20 rounded-[2.5rem] relative overflow-hidden shadow-[0_0_50px_rgba(201,168,76,0.05)]">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
          <Sparkles className="w-48 h-48 text-[#c9a84c]" />
        </div>
        <div className="text-center">
          <label className="text-[9px] font-cinzel text-[#c9a84c]/60 uppercase font-bold tracking-[0.2em] block mb-2">Habilidade Chave</label>
           {isEditing ? (
               <input value={localData.spellcasting.ability} onChange={e => updateNested('spellcasting.ability', e.target.value)} className="w-full bg-transparent text-center text-4xl font-bold text-[#c9a84c] outline-none" />
           ) : (
               <span className="text-4xl font-bold text-[#c9a84c]">{localData.spellcasting.ability}</span>
           )}
        </div>
        <div className="text-center border-l border-white/5">
          <label className="text-[9px] font-cinzel text-[#c9a84c]/60 uppercase font-bold tracking-[0.2em] block mb-2">CD de Resistência</label>
          {isEditing ? (
               <input type="number" value={localData.spellcasting.saveDC} onChange={e => updateNested('spellcasting.saveDC', Number(e.target.value))} className="w-full bg-transparent text-center text-4xl font-bold text-[#e8d5b0] outline-none" />
          ) : (
               <span className="text-4xl font-bold text-[#e8d5b0]">{localData.spellcasting.saveDC}</span>
          )}
        </div>
        <div className="text-center border-l border-white/5">
          <label className="text-[9px] font-cinzel text-[#c9a84c]/60 uppercase font-bold tracking-[0.2em] block mb-2">Bônus de Ataque</label>
          {isEditing ? (
               <input value={localData.spellcasting.attackBonus} onChange={e => updateNested('spellcasting.attackBonus', e.target.value)} className="w-full bg-transparent text-center text-4xl font-bold text-[#e8d5b0] outline-none" />
          ) : (
               <span className="text-4xl font-bold text-[#e8d5b0]">{localData.spellcasting.attackBonus}</span>
          )}
        </div>
        <div className="text-center border-l border-white/5">
          <label className="text-[9px] font-cinzel text-[#c9a84c]/60 uppercase font-bold tracking-[0.2em] block mb-2">Classe Conjuradora</label>
          <span className="text-xl font-cinzel font-bold text-[#c9a84c]">{localData.class}</span>
        </div>
      </div>

      {/* Spells Grid - 3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(lvl => (
          <div key={`spell-col-${lvl}`} className="space-y-4">
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4 hover:border-[#c9a84c]/10 transition-colors">
              <div className="flex justify-between items-center mb-2 pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                   <div className="w-5 h-5 rounded-lg bg-[#c9a84c]/10 flex items-center justify-center border border-[#c9a84c]/20 text-[10px] font-bold text-[#c9a84c]">
                      {lvl}
                   </div>
                   <h3 className="text-[10px] font-cinzel text-[#e8d5b0]/80 font-bold uppercase tracking-widest">
                      {lvl === 0 ? 'Truques' : `Nível ${lvl}`}
                   </h3>
                </div>
                
                {lvl > 0 && (
                  <div className="flex gap-1.5">
                     {Array.from({length: localData.spellcasting.slots.find((s:any) => s.level === lvl)?.total || 0}).map((_, i) => (
                       <div 
                         key={`slot-${lvl}-${i}`} 
                         onClick={() => {
                            if (isEditing) {
                               const newSlots = [...localData.spellcasting.slots];
                               const slotIdx = newSlots.findIndex((s:any) => s.level === lvl);
                               newSlots[slotIdx].used = newSlots[slotIdx].used > i ? i : i + 1;
                               updateNested('spellcasting.slots', newSlots);
                            }
                         }}
                         className={`w-3.5 h-3.5 rounded-md border transition-all cursor-pointer ${localData.spellcasting.slots.find((s:any) => s.level === lvl)?.used > i ? 'bg-[#c9a84c] border-[#c9a84c]' : 'border-[#c9a84c]/30'}`} 
                       />
                     ))}
                     {isEditing && (
                         <button 
                            onClick={() => {
                                const newSlots = [...localData.spellcasting.slots];
                                const slotIdx = newSlots.findIndex((s:any) => s.level === lvl);
                                newSlots[slotIdx].total = (newSlots[slotIdx].total || 0) + 1;
                                updateNested('spellcasting.slots', newSlots);
                            }}
                            className="text-[10px] text-[#c9a84c] ml-1"
                         >
                             +
                         </button>
                     )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {localData.spellcasting.spells.filter((s:any) => s.level === lvl).map((spell: any) => (
                  <div key={spell.name} className="flex items-center gap-3 p-3 bg-black/20 border border-white/5 rounded-xl group hover:bg-[#c9a84c]/5 hover:border-[#c9a84c]/20 transition-all cursor-default relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#c9a84c] opacity-0 group-hover:opacity-100 transition-all" />
                    <Wand2 className="w-3 h-3 text-[#c9a84c]/40 group-hover:text-[#c9a84c] transition-colors" />
                    {isEditing ? (
                        <input value={spell.name} onChange={e => {
                            const newSpells = [...localData.spellcasting.spells];
                            const spellIdx = newSpells.findIndex(s => s.name === spell.name);
                            newSpells[spellIdx].name = e.target.value;
                            updateNested('spellcasting.spells', newSpells);
                        }} className="bg-transparent text-[11px] font-medium text-[#e8d5b0]/60 outline-none" />
                    ) : (
                        <span className="text-[11px] font-medium text-[#e8d5b0]/60 group-hover:text-[#e8d5b0] transition-colors truncate">{spell.name}</span>
                    )}
                    
                    <div className="ml-auto flex items-center gap-2">
                        <div 
                            onClick={() => {
                                if(isEditing) {
                                    const newSpells = [...localData.spellcasting.spells];
                                    const spellIdx = newSpells.findIndex(s => s.name === spell.name);
                                    newSpells[spellIdx].prepared = !newSpells[spellIdx].prepared;
                                    updateNested('spellcasting.spells', newSpells);
                                }
                            }}
                            className={`cursor-pointer ${spell.prepared ? 'opacity-100' : 'opacity-20 hover:opacity-50'}`}
                        >
                            <Sparkles className="w-3 h-3 text-[#c9a84c]" />
                        </div>
                    </div>
                  </div>
                ))}
                
                {isEditing && (
                  <button 
                    onClick={() => {
                        const newSpells = [...localData.spellcasting.spells, { level: lvl, name: 'Nova Magia', prepared: false }];
                        updateNested('spellcasting.spells', newSpells);
                    }}
                    className="w-full py-2 border border-dashed border-white/5 rounded-xl text-[9px] font-cinzel text-[#e8d5b0]/10 hover:text-[#c9a84c]/40 hover:border-[#c9a84c]/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Flame className="w-3 h-3" /> ADICIONAR
                  </button>
                )}
                
                {localData.spellcasting.spells.filter((s:any) => s.level === lvl).length === 0 && !isEditing && (
                  <p className="text-[9px] text-white/5 italic text-center py-2">Nenhuma magia</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
