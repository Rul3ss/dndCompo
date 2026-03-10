import { type Character } from '../../../../../lib/character.service';

interface PathfinderSheetProps {
  character: Character;
  localData: any;
  isEditing: boolean;
  updateNested: (path: string, value: any) => void;
}

export default function PathfinderSheet({ character }: PathfinderSheetProps) {
  return (
    <div className="p-12 flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
      <div className="w-20 h-20 rounded-full bg-[#c9a84c]/10 flex items-center justify-center border border-[#c9a84c]/20">
        <span className="text-4xl">🏹</span>
      </div>
      <h2 className="font-cinzel text-2xl font-bold text-[#e8d5b0] uppercase tracking-widest">Pathfinder 2e</h2>
      <p className="text-[#e8d5b0]/40 font-medium max-w-md">
        As crônicas de Golarion ainda estão sendo escritas. Esta ficha estará disponível em breve para {character.name}.
      </p>
    </div>
  );
}
