import { Swords, ShieldAlert, Scroll, Shield, Flame, Footprints, Heart, Sword, Brain, Activity, Star } from 'lucide-react';
import { type Character } from '../../../../../lib/character.service';

interface Dnd5eStatsPageProps {
  character: Character;
  localData: any;
  isEditing: boolean;
  updateNested: (path: string, value: any) => void;
}

export default function Dnd5eStatsPage({ character, localData, isEditing, updateNested }: Dnd5eStatsPageProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* D&D Header (Class, Level, Background, etc) */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Portrait */}
        <div className="relative group shrink-0">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#c9a84c] to-[#a89070] rounded-2xl blur opacity-10 group-hover:opacity-25 transition duration-500"></div>
          <div className="relative w-32 h-32 rounded-2xl overflow-hidden border border-[#c9a84c]/20 bg-[#0c0a08]">
            {character.imageUrl ? (
              <img src={character.imageUrl} alt={character.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Swords className="w-12 h-12 text-[#c9a84c]/40" />
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-2xl self-end">
          <div className="col-span-1">
            <label className="text-[9px] font-cinzel text-[#c9a84c]/40 uppercase tracking-widest font-bold">Lenda</label>
            <p className="text-xl font-cinzel font-bold text-[#e8d5b0]">{character.name}</p>
          </div>
          <div className="col-span-1 border-l border-white/5 pl-4">
            <label className="text-[9px] font-cinzel text-[#c9a84c]/40 uppercase tracking-widest font-bold">Classe e Nível</label>
            {isEditing ? (
              <div className="flex gap-2">
                <input value={localData.class} onChange={e => updateNested('class', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded px-2 py-0.5 text-xs text-[#e8d5b0] outline-none" />
                <input type="number" value={localData.level} onChange={e => updateNested('level', Number(e.target.value))} className="w-12 bg-white/5 border border-white/10 rounded px-2 py-0.5 text-xs text-[#e8d5b0] text-center outline-none" />
              </div>
            ) : (
              <p className="text-sm font-cinzel font-bold text-[#e8d5b0]/80">{localData.class} {localData.level}</p>
            )}
          </div>
          <div className="col-span-1 border-l border-white/5 pl-4">
            <label className="text-[9px] font-cinzel text-[#c9a84c]/40 uppercase tracking-widest font-bold">Antecedente</label>
            {isEditing ? (
              <input value={localData.background} onChange={e => updateNested('background', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded px-2 py-0.5 text-xs text-[#e8d5b0] outline-none" />
            ) : (
              <p className="text-sm font-cinzel font-bold text-[#e8d5b0]/80">{localData.background}</p>
            )}
          </div>
          <div className="col-span-1 border-l border-white/5 pl-4">
            <label className="text-[9px] font-cinzel text-[#c9a84c]/40 uppercase tracking-widest font-bold">Raça e Tendência</label>
            {isEditing ? (
              <div className="flex gap-2">
                <input value={localData.race} onChange={e => updateNested('race', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded px-2 py-0.5 text-xs text-[#e8d5b0] outline-none placeholder:opacity-20" placeholder="Raça" />
                <input value={localData.alignment} onChange={e => updateNested('alignment', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded px-2 py-0.5 text-xs text-[#e8d5b0] outline-none placeholder:opacity-20" placeholder="Tendência" />
              </div>
            ) : (
              <p className="text-sm font-cinzel font-bold text-[#e8d5b0]/80">{localData.race} | {localData.alignment}</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Attributes */}
        <div className="lg:col-span-2 space-y-4">
          {localData.attributes.map((attr: any, idx: number) => (
            <div key={attr.name} className="relative bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex flex-col items-center group hover:border-[#c9a84c]/30 transition-all">
              <span className="text-[9px] font-cinzel text-[#c9a84c]/60 uppercase font-bold tracking-tighter mb-1">{attr.name}</span>
              {isEditing ? (
                <input 
                  value={attr.mod} 
                  onChange={e => {
                    const newAttrs = [...localData.attributes];
                    newAttrs[idx].mod = e.target.value;
                    updateNested('attributes', newAttrs);
                  }}
                  className="w-full bg-transparent text-center text-2xl font-bold text-[#c9a84c] focus:outline-none"
                />
              ) : (
                <span className="text-3xl font-bold text-[#c9a84c]">{attr.mod}</span>
              )}
              <div className="mt-2 px-3 py-1 bg-[#0c0a08] border border-white/10 rounded-lg">
                {isEditing ? (
                  <input 
                    type="number"
                    value={attr.value} 
                    onChange={e => {
                      const newAttrs = [...localData.attributes];
                      newAttrs[idx].value = Number(e.target.value);
                      updateNested('attributes', newAttrs);
                    }}
                    className="w-8 bg-transparent text-center text-xs font-bold text-[#e8d5b0] focus:outline-none"
                  />
                ) : (
                  <span className="text-xs font-bold text-[#e8d5b0]">{attr.value}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Center Column: Inspiration, Proficiency, Saves, Skills */}
        <div className="lg:col-span-4 space-y-6">
          {/* Inspiration & Proficiency */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
              <div 
                onClick={() => {
                  if(isEditing) updateNested('inspiration', !localData.inspiration);
                }}
                className={`w-4 h-4 rounded-full border cursor-pointer transition-all ${localData.inspiration ? 'bg-[#c9a84c] border-[#c9a84c]' : 'border-white/20'}`} 
              />
              <span className="text-[9px] font-cinzel text-[#e8d5b0]/60 font-bold uppercase tracking-widest">Inspiração</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between">
              <span className="text-sm font-bold text-[#c9a84c]">{localData.proficiencyBonus}</span>
              <span className="text-[9px] font-cinzel text-[#e8d5b0]/60 font-bold uppercase tracking-widest text-right">Bônus Profic.</span>
            </div>
          </div>

          {/* Saving Throws */}
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3">
            <h3 className="text-[10px] font-cinzel text-[#c9a84c] font-bold uppercase tracking-widest flex items-center gap-2">
              <ShieldAlert className="w-3 h-3" /> Testes de Resistência
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {localData.attributes.map((attr: any, idx: number) => (
                <div key={`save-${attr.name}`} className="flex items-center gap-2">
                  <div 
                    onClick={() => {
                        if(isEditing) {
                            const newAttrs = [...localData.attributes];
                            newAttrs[idx].save = !newAttrs[idx].save;
                            updateNested('attributes', newAttrs);
                        }
                    }}
                    className={`w-2.5 h-2.5 rounded-full border cursor-pointer transition-all ${attr.save ? 'bg-[#c9a84c] border-[#c9a84c]' : 'border-white/20'}`} 
                  />
                  <span className="text-[10px] text-[#e8d5b0]/60 font-medium">{attr.name}</span>
                  <span className="ml-auto text-[10px] font-bold text-[#c9a84c]/60">{attr.mod}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
            <h3 className="text-[10px] font-cinzel text-[#c9a84c] font-bold uppercase tracking-widest flex items-center gap-2 mb-3">
              <Scroll className="w-3 h-3" /> Perícias
            </h3>
            {localData.skills.map((skill: any, idx: number) => (
              <div key={skill.name} className="flex items-center gap-3 py-1 cursor-default hover:bg-white/5 rounded px-2 transition-colors">
                <div 
                  onClick={() => {
                    if(isEditing) {
                      const newSkills = [...localData.skills];
                      newSkills[idx].proficient = !newSkills[idx].proficient;
                      updateNested('skills', newSkills);
                    }
                  }}
                  className={`w-2.5 h-2.5 rounded-full border cursor-pointer transition-all ${skill.proficient ? 'bg-[#c9a84c] border-[#c9a84c] shadow-[0_0_8px_rgba(201,168,76,0.3)]' : 'border-white/20'}`} 
                />
                <span className="text-[10px] text-[#e8d5b0]/60 font-medium">
                  {skill.name} <span className="text-[8px] opacity-40 uppercase ml-1">({skill.attr})</span>
                </span>
                <span className="ml-auto text-[10px] font-bold text-[#c9a84c]/60">{skill.mod}</span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
            <span className="text-[9px] font-cinzel text-[#e8d5b0]/60 font-bold uppercase tracking-widest">Sabedoria Passiva</span>
            <span className="text-sm font-bold text-[#c9a84c]">{localData.passivePerception}</span>
          </div>
        </div>

        {/* Right Column: Combat Stats */}
        <div className="lg:col-span-6 space-y-6">
          {/* AC, Initiative, Speed */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#0c0a08] border-2 border-[#c9a84c]/30 rounded-2xl p-4 flex flex-col items-center justify-center relative shadow-xl">
              <Shield className="w-3 h-3 text-[#c9a84c]/40 absolute top-3 left-3" />
              {isEditing ? (
                  <input type="number" value={localData.ca} onChange={e => updateNested('ca', Number(e.target.value))} className="w-full bg-transparent text-center text-2xl font-bold text-[#e8d5b0] outline-none" />
              ) : (
                  <span className="text-2xl font-bold text-[#e8d5b0]">{localData.ca}</span>
              )}
              <span className="text-[8px] font-cinzel text-[#c9a84c] uppercase font-bold text-center leading-none mt-1">Classe de<br/>Armadura</span>
            </div>
            <div className="bg-[#0c0a08] border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center relative">
              <Flame className="w-3 h-3 text-[#c9a84c]/40 absolute top-3 left-3" />
              {isEditing ? (
                  <input value={localData.initiative} onChange={e => updateNested('initiative', e.target.value)} className="w-full bg-transparent text-center text-2xl font-bold text-[#e8d5b0] outline-none" />
              ) : (
                  <span className="text-2xl font-bold text-[#e8d5b0]">{localData.initiative}</span>
              )}
              <span className="text-[8px] font-cinzel text-[#e8d5b0]/40 uppercase font-bold mt-1">Iniciativa</span>
            </div>
            <div className="bg-[#0c0a08] border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center relative">
              <Footprints className="w-3 h-3 text-[#c9a84c]/40 absolute top-3 left-3" />
              {isEditing ? (
                  <input value={localData.speed} onChange={e => updateNested('speed', e.target.value)} className="w-full bg-transparent text-center text-2xl font-bold text-[#e8d5b0] outline-none" />
              ) : (
                  <span className="text-2xl font-bold text-[#e8d5b0]">{localData.speed}</span>
              )}
              <span className="text-[8px] font-cinzel text-[#e8d5b0]/40 uppercase font-bold mt-1">Deslocamento</span>
            </div>
          </div>

          {/* Hit Points */}
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 space-y-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] -mr-8 -mt-8">
               <Heart className="w-48 h-48 text-red-500" />
            </div>
            
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div>
                <h4 className="text-[10px] font-cinzel text-red-500/60 uppercase font-bold tracking-widest">Pontos de Vida Atuais</h4>
                <div className="flex items-baseline gap-2 mt-1">
                  {isEditing ? (
                    <input 
                      type="number"
                      value={localData.hp.current}
                      onChange={e => updateNested('hp.current', Number(e.target.value))}
                      className="w-16 bg-white/5 border border-red-500/20 rounded px-2 text-3xl font-bold text-[#e8d5b0] outline-none"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-[#e8d5b0]">{localData.hp.current}</span>
                  )}
                  <span className="text-lg text-white/20">/</span>
                  {isEditing ? (
                    <input 
                      type="number"
                      value={localData.hp.max}
                      onChange={e => updateNested('hp.max', Number(e.target.value))}
                      className="w-12 bg-white/5 border border-white/5 rounded px-1 text-xl font-bold text-[#e8d5b0]/40 outline-none"
                    />
                  ) : (
                    <span className="text-xl font-bold text-[#e8d5b0]/40">{localData.hp.max}</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <h4 className="text-[10px] font-cinzel text-[#e8d5b0]/20 uppercase font-bold tracking-widest">Temporários</h4>
                {isEditing ? (
                    <input type="number" value={localData.hp.temp} onChange={e => updateNested('hp.temp', Number(e.target.value))} className="w-16 bg-white/5 border border-white/5 rounded px-1 text-2xl font-bold text-[#e8d5b0]/40 text-right outline-none" />
                ) : (
                    <span className="text-2xl font-bold text-[#e8d5b0]/40">{localData.hp.temp}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="text-[9px] font-cinzel text-[#e8d5b0]/40 uppercase font-bold">Dados de Vida</h4>
                <div className="p-3 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between">
                  {isEditing ? (
                      <input type="number" value={localData.hitDice.current} onChange={e => updateNested('hitDice.current', Number(e.target.value))} className="w-8 bg-transparent text-xs font-bold text-[#e8d5b0]/80 outline-none" />
                  ) : (
                      <span className="text-xs font-bold text-[#e8d5b0]/80">{localData.hitDice.current}</span>
                  )}
                  {isEditing ? (
                      <input value={localData.hitDice.total} onChange={e => updateNested('hitDice.total', e.target.value)} className="w-12 bg-transparent text-[10px] font-bold text-[#c9a84c]/60 text-right outline-none" />
                  ) : (
                      <span className="text-[10px] font-bold text-[#c9a84c]/60">{localData.hitDice.total}</span>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-[9px] font-cinzel text-[#e8d5b0]/40 uppercase font-bold">Testes contra Morte</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[8px] font-cinzel text-green-500/40 uppercase font-bold w-12 text-right">Sucesso</span>
                    <div className="flex gap-2">
                      {[1,2,3].map(i => (
                        <div 
                            key={`ds-s-${i}`} 
                            onClick={() => {
                                if(isEditing) updateNested('deathSaves.success', i);
                            }}
                            className={`w-3 h-3 rounded-full border cursor-pointer transition-all ${localData.deathSaves.success >= i ? 'bg-green-500 border-green-500' : 'border-white/10'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[8px] font-cinzel text-red-500/40 uppercase font-bold w-12 text-right">Falha</span>
                    <div className="flex gap-2">
                      {[1,2,3].map(i => (
                        <div 
                            key={`ds-f-${i}`} 
                            onClick={() => {
                                if(isEditing) updateNested('deathSaves.failure', i);
                            }}
                            className={`w-3 h-3 rounded-full border cursor-pointer transition-all ${localData.deathSaves.failure >= i ? 'bg-red-500 border-red-500' : 'border-white/10'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Attacks & Magic (Simple List) */}
          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
             <h3 className="text-[10px] font-cinzel text-[#c9a84c] font-bold uppercase tracking-widest flex items-center gap-2">
               <Sword className="w-3 h-3" /> Ataques e Conjurações
             </h3>
             <div className="space-y-2">
                {localData.attacks.map((atk: any, idx: number) => (
                  <div key={atk.name} className="grid grid-cols-12 gap-2 p-3 bg-black/40 border border-white/5 rounded-xl group hover:border-[#c9a84c]/20 transition-all">
                    {isEditing ? (
                        <input value={atk.name} onChange={e => {
                            const newAtks = [...localData.attacks];
                            newAtks[idx].name = e.target.value;
                            updateNested('attacks', newAtks);
                        }} className="col-span-12 bg-transparent text-[11px] font-bold text-[#e8d5b0]/80 outline-none mb-1 border-b border-white/5" />
                    ) : (
                        <span className="col-span-5 text-[11px] font-bold text-[#e8d5b0]/80 truncate">{atk.name}</span>
                    )}
                    
                    {!isEditing && (
                        <>
                            <span className="col-span-2 text-[10px] text-center font-bold text-[#c9a84c]">{atk.bonus}</span>
                            <span className="col-span-5 text-[10px] text-right font-medium text-[#e8d5b0]/40">{atk.damage} ({atk.type})</span>
                        </>
                    )}

                    {isEditing && (
                        <div className="col-span-12 flex gap-2">
                            <input value={atk.bonus} onChange={e => {
                                const newAtks = [...localData.attacks];
                                newAtks[idx].bonus = e.target.value;
                                updateNested('attacks', newAtks);
                            }} className="w-12 bg-white/5 rounded px-1 text-[10px] text-[#c9a84c] outline-none" placeholder="Bonus" />
                            <input value={atk.damage} onChange={e => {
                                const newAtks = [...localData.attacks];
                                newAtks[idx].damage = e.target.value;
                                updateNested('attacks', newAtks);
                            }} className="flex-1 bg-white/5 rounded px-1 text-[10px] text-[#e8d5b0]/40 outline-none" placeholder="Dano" />
                             <input value={atk.type} onChange={e => {
                                const newAtks = [...localData.attacks];
                                newAtks[idx].type = e.target.value;
                                updateNested('attacks', newAtks);
                            }} className="w-20 bg-white/5 rounded px-1 text-[10px] text-[#e8d5b0]/40 outline-none" placeholder="Tipo" />
                        </div>
                    )}
                  </div>
                ))}
                {isEditing && (
                    <button 
                        onClick={() => {
                            const newAtks = [...localData.attacks, { name: 'Novo Ataque', bonus: '+0', damage: '1d4', type: 'Dano' }];
                            updateNested('attacks', newAtks);
                        }}
                        className="w-full py-2 border border-dashed border-white/10 rounded-xl text-[10px] font-cinzel text-[#e8d5b0]/20 hover:text-[#c9a84c] hover:border-[#c9a84c]/30 transition-all"
                    >
                        + NOVO ATAQUE
                    </button>
                )}
             </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Traits & Equipment */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
           <h3 className="text-[10px] font-cinzel text-[#c9a84c] font-bold uppercase tracking-widest flex items-center gap-2">
             <Brain className="w-3 h-3" /> Características e Habilidades
           </h3>
           {isEditing ? (
               <textarea value={localData.features} onChange={e => updateNested('features', e.target.value)} className="w-full h-32 bg-transparent text-xs text-[#e8d5b0]/60 leading-relaxed outline-none resize-none custom-scrollbar" />
           ) : (
               <p className="text-xs text-[#e8d5b0]/60 leading-relaxed italic">{localData.features}</p>
           )}
         </div>
         <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
           <h3 className="text-[10px] font-cinzel text-[#c9a84c] font-bold uppercase tracking-widest flex items-center gap-2">
             <Activity className="w-3 h-3" /> Equipamento
           </h3>
            {isEditing ? (
               <textarea value={localData.equipment} onChange={e => updateNested('equipment', e.target.value)} className="w-full h-32 bg-transparent text-xs text-[#e8d5b0]/60 leading-relaxed outline-none resize-none custom-scrollbar" />
           ) : (
               <p className="text-xs text-[#e8d5b0]/60 leading-relaxed">{localData.equipment}</p>
           )}
         </div>
         <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
           <h3 className="text-[10px] font-cinzel text-[#c9a84c] font-bold uppercase tracking-widest flex items-center gap-2">
             <Star className="w-3 h-3" /> Traços de Personalidade
           </h3>
           <div className="space-y-4">
              <p className="text-[10px] text-[#e8d5b0]/60"><span className="text-[#c9a84c] font-bold block mb-1">Traço:</span> {character.backstory?.slice(0, 100)}...</p>
           </div>
         </div>
      </div>
    </div>
  );
}
