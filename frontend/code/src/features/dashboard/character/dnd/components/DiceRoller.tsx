import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dices } from "lucide-react";
import { useTranslation } from "react-i18next";

export function DiceRoller() {
  const { t } = useTranslation("character");
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [dieType, setDieType] = useState(20);
  const dice = [4, 6, 8, 10, 12, 20, 100];
  
  const timerRef = useRef<any>(null);

  // Limpar timer ao desmontar
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function roll() {
    if (rolling) return;
    
    // Garantir que qualquer timer anterior seja limpo
    if (timerRef.current) clearInterval(timerRef.current);
    
    setRolling(true);
    setResult(null);
    
    let spins = 0;
    const maxSpins = 12;
    
    timerRef.current = setInterval(() => {
      setResult(Math.ceil(Math.random() * dieType) || 1);
      spins++;
      
      if (spins >= maxSpins) {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
        setRolling(false);
      }
    }, 60);

    // Timeout de segurança (1.5 segundos) para destravar se algo der errado
    setTimeout(() => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        setRolling(false);
      }
    }, 1500);
  }

  const isCrit = result === dieType;
  const isFumble = result === 1;

  return (
    <div
      className="rounded-xl border border-[#2a1f0f] p-3 flex flex-col h-full"
      style={{ background: "#140f0a" }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3
          className="text-[#e8d5b0] text-[9px] uppercase tracking-widest"
          style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
        >
          {t("overview.quickRoll", "Quick Roll")}
        </h3>
        <Dices className="w-3 h-3 text-[#4a3820]" />
      </div>

      {/* Die selector */}
      <div className="flex flex-wrap gap-1 mb-2">
        {dice.map((d) => (
          <button
            key={d}
            onClick={() => {
              setDieType(d);
              setResult(null);
            }}
            className={`px-1.5 py-0.5 rounded text-[9px] transition-all duration-200 ${
              dieType === d
                ? "bg-[#c9a84c]/20 border border-[#c9a84c]/40 text-[#c9a84c]"
                : "border border-[#2a1f0f] text-[#6b5a3e] hover:border-[#3d2e1a] hover:text-[#a89070]"
            }`}
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            d{d}
          </button>
        ))}
      </div>

      {/* Result display */}
      <div className="flex-1 flex items-center justify-center gap-3">
        <motion.button
          onClick={roll}
          whileTap={{ scale: 0.9 }}
          animate={rolling ? { rotate: [0, 20, -20, 15, -15, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0 cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 shadow-inner"
          style={{
            background: "linear-gradient(135deg, #1a1510, #2a1f0f)",
            border: "1px solid #3d2e1a",
          }}
          title={`Roll d${dieType}`}
        >
          🎲
        </motion.button>
        <div className="flex-1 text-center sm:text-left">
          <AnimatePresence mode="wait">
            {result !== null ? (
              <motion.div
                key={result}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <p
                  className="text-2xl leading-none"
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontWeight: 900,
                    color: isCrit ? "#22c55e" : isFumble ? "#ef4444" : "#c9a84c",
                    textShadow: isCrit
                      ? "0 0 15px rgba(34,197,94,0.4)"
                      : isFumble
                      ? "0 0 15px rgba(239,68,68,0.4)"
                      : "0 0 15px rgba(201,168,76,0.2)",
                  }}
                >
                  {result}
                </p>
                <p
                  className="text-[9px] uppercase font-bold tracking-tighter mt-0.5 leading-none"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    color: isCrit ? "#22c55e" : isFumble ? "#ef4444" : "#4a3820",
                  }}
                >
                  {isCrit ? "Crit!" : isFumble ? "Fumble!" : `d${dieType}`}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p
                  className="text-[#3d2e1a] text-[9px] uppercase tracking-tighter leading-tight"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {t("overview.clickToRoll", "Click to roll")}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
