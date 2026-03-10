import { Swords, Activity, Scroll, Heart, Shield, Zap, Check } from 'lucide-react';
import { type Character } from '../../../../../lib/character.service';

interface GenericSheetProps {
  character: Character;
  localData: any;
  isEditing: boolean;
  updateNested: (path: string, value: any) => void;
}

export default function GenericSheet({ character, localData, isEditing, updateNested }: GenericSheetProps) {
  return (
    <div className="p-8 md:p-12 pt-16 mt-4">
      {/* Header section */}
      <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#c9a84c] to-[#a89070] rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
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

        <div className="flex-1 w-full">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="w-full md:w-auto">
              <h2 className="font-cinzel text-4xl font-bold text-[#e8d5b0] tracking-tighter uppercase mb-2">
                {character.name}
              </h2>
              <div className="flex flex-wrap gap-2">
                {isEditing ? (
                  <>
                    <input 
                      value={localData.class} 
                      onChange={e => updateNested('class', e.target.value)}
                      placeholder="Classe"
                      className="bg-white/5 border border-[#c9a84c]/30 rounded px-2 py-0.5 text-xs font-cinzel font-bold text-[#c9a84c] focus:outline-none"
                    />
                    <input 
                      type="number"
                      value={localData.level} 
                      onChange={e => updateNested('level', Number(e.target.value))}
                      className="w-16 bg-white/5 border border-white/10 rounded px-2 py-0.5 text-xs font-cinzel font-bold text-[#e8d5b0]/60 focus:outline-none"
                    />
                    <input 
                      value={localData.race} 
                      onChange={e => updateNested('race', e.target.value)}
                      placeholder="Raça"
                      className="bg-white/5 border border-white/10 rounded px-2 py-0.5 text-xs font-cinzel font-bold text-[#e8d5b0]/60 focus:outline-none"
                    />
                  </>
                ) : (
                  <>
                    <span className="px-3 py-1 bg-[#c9a84c]/10 rounded border border-[#c9a84c]/20 text-[#c9a84c] text-xs font-cinzel font-bold">
                      {localData.class}
                    </span>
                    <span className="px-3 py-1 bg-white/5 rounded border border-white/10 text-[#e8d5b0]/60 text-xs font-cinzel font-bold">
                      Nível {localData.level}
                    </span>
                    <span className="px-3 py-1 bg-white/5 rounded border border-white/10 text-[#e8d5b0]/60 text-xs font-cinzel font-bold">
                      {localData.race}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="text-right w-full md:w-auto">
              <p className="text-[10px] font-cinzel text-[#c9a84c]/40 uppercase tracking-widest">Campanha</p>
              {isEditing ? (
                <input 
                  value={localData.campaign} 
                  onChange={e => updateNested('campaign', e.target.value)}
                  className="bg-[#0c0a08] border border-[#c9a84c]/20 rounded px-3 py-1 text-sm font-cinzel font-bold text-[#e8d5b0] text-right focus:outline-none"
                />
              ) : (
                <p className="text-[#e8d5b0] font-cinzel font-bold">{localData.campaign}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-red-900/5 border border-red-500/20 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Heart className="w-12 h-12 text-red-500" />
          </div>
          <Heart className="w-5 h-5 text-red-500 mb-2" />
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <input 
                  type="number"
                  value={localData.hp.current} 
                  onChange={e => updateNested('hp.current', Number(e.target.value))}
                  className="w-16 bg-white/10 border border-red-500/30 rounded text-xl font-cinzel font-bold text-[#e8d5b0] text-center focus:outline-none"
                />
                <span className="text-xl text-white/20">/</span>
                <input 
                  type="number"
                  value={localData.hp.max} 
                  onChange={e => updateNested('hp.max', Number(e.target.value))}
                  className="w-16 bg-white/10 border border-red-500/30 rounded text-xl font-cinzel font-bold text-[#e8d5b0] text-center focus:outline-none"
                />
              </>
            ) : (
              <span className="text-2xl font-cinzel font-bold text-[#e8d5b0]">{localData.hp.current}/{localData.hp.max}</span>
            )}
          </div>
          <span className="text-[10px] font-cinzel text-red-500/60 uppercase tracking-widest font-bold mt-1">Vida</span>
        </div>

        <div className="bg-blue-900/5 border border-blue-500/20 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Shield className="w-12 h-12 text-blue-500" />
          </div>
          <Shield className="w-5 h-5 text-blue-500 mb-2" />
          {isEditing ? (
            <input 
              type="number"
              value={localData.ca} 
              onChange={e => updateNested('ca', Number(e.target.value))}
              className="w-16 bg-white/10 border border-blue-500/30 rounded text-xl font-cinzel font-bold text-[#e8d5b0] text-center focus:outline-none"
            />
          ) : (
            <span className="text-2xl font-cinzel font-bold text-[#e8d5b0]">{localData.ca}</span>
          )}
          <span className="text-[10px] font-cinzel text-blue-500/60 uppercase tracking-widest font-bold mt-1">CA</span>
        </div>

        <div className="bg-yellow-900/5 border border-yellow-500/20 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap className="w-12 h-12 text-yellow-500" />
          </div>
          <Zap className="w-5 h-5 text-yellow-500 mb-2" />
          {isEditing ? (
            <input 
              value={localData.speed} 
              onChange={e => updateNested('speed', e.target.value)}
              className="w-24 bg-white/10 border border-yellow-500/30 rounded text-xl font-cinzel font-bold text-[#e8d5b0] text-center focus:outline-none"
            />
          ) : (
            <span className="text-2xl font-cinzel font-bold text-[#e8d5b0]">{localData.speed}</span>
          )}
          <span className="text-[10px] font-cinzel text-yellow-500/60 uppercase tracking-widest font-bold mt-1">Desloc.</span>
        </div>
      </div>

      {/* Attributes & Skills Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Attributes */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-4 h-4 text-[#c9a84c]" />
            <h3 className="font-cinzel text-sm font-bold text-[#c9a84c] uppercase tracking-widest">Atributos</h3>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-3 gap-4">
            {localData.attributes.map((attr: any, idx: number) => (
              <div key={attr.name} className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col items-center group hover:border-[#c9a84c]/40 transition-colors">
                {isEditing ? (
                  <>
                    <input 
                      value={attr.mod} 
                      onChange={e => {
                        const newAttrs = [...localData.attributes];
                        newAttrs[idx].mod = e.target.value;
                        updateNested('attributes', newAttrs);
                      }}
                      className="w-12 bg-white/10 border border-[#c9a84c]/20 rounded text-center text-lg font-bold text-[#c9a84c] focus:outline-none mb-1"
                    />
                    <span className="text-[10px] font-cinzel text-[#e8d5b0]/40 uppercase font-bold">{attr.name}</span>
                    <input 
                      type="number"
                      value={attr.value} 
                      onChange={e => {
                        const newAttrs = [...localData.attributes];
                        newAttrs[idx].value = Number(e.target.value);
                        updateNested('attributes', newAttrs);
                      }}
                      className="w-10 bg-transparent border-b border-white/10 text-center text-xs font-bold text-[#e8d5b0] focus:outline-none mt-1"
                    />
                  </>
                ) : (
                  <>
                    <span className="text-xl font-bold text-[#c9a84c] mb-1">{attr.mod}</span>
                    <span className="text-[10px] font-cinzel text-[#e8d5b0]/40 uppercase font-bold">{attr.name}</span>
                    <span className="text-xs font-bold text-[#e8d5b0] mt-1">{attr.value}</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Scroll className="w-4 h-4 text-[#c9a84c]" />
            <h3 className="font-cinzel text-sm font-bold text-[#c9a84c] uppercase tracking-widest">Perícias</h3>
          </div>
          <div className="space-y-2">
            {localData.skills.map((skill: any, idx: number) => (
              <div key={skill.name} className="flex justify-between items-center p-3 rounded-lg hover:bg-white/5 transition-colors group">
                <div className="flex items-center gap-3">
                  <button
                    disabled={!isEditing}
                    onClick={() => {
                      const newSkills = [...localData.skills];
                      newSkills[idx].proficient = !newSkills[idx].proficient;
                      updateNested('skills', newSkills);
                    }}
                    className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                      skill.proficient 
                        ? 'bg-[#c9a84c] shadow-[0_0_8px_rgba(201,168,76,0.5)]' 
                        : 'border border-[#c9a84c]/20 hover:border-[#c9a84c]/50'
                    }`}
                  >
                    {skill.proficient ? <Check className="w-2.5 h-2.5 text-[#0c0a08]" /> : null}
                  </button>
                  {isEditing ? (
                    <input 
                      value={skill.name}
                      onChange={e => {
                        const newSkills = [...localData.skills];
                        newSkills[idx].name = e.target.value;
                        updateNested('skills', newSkills);
                      }}
                      className="bg-transparent border-b border-white/10 text-xs font-cinzel font-medium text-[#e8d5b0] focus:outline-none"
                    />
                  ) : (
                    <span className={`text-xs font-cinzel font-medium ${skill.proficient ? 'text-[#e8d5b0]' : 'text-[#e8d5b0]/40'}`}>
                      {skill.name}
                    </span>
                  )}
                </div>
                {isEditing ? (
                  <input 
                    value={skill.value}
                    onChange={e => {
                      const newSkills = [...localData.skills];
                      newSkills[idx].value = e.target.value;
                      updateNested('skills', newSkills);
                    }}
                    className="w-10 bg-white/5 border border-white/10 rounded text-right text-xs font-bold text-[#c9a84c] focus:outline-none"
                  />
                ) : (
                  <span className={`text-xs font-bold ${skill.proficient ? 'text-[#c9a84c]' : 'text-[#e8d5b0]/40'}`}>
                    {skill.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
