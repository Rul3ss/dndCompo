import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { CharacterState, UpdateFieldFn } from "../types/character.types";
import { DEFAULT_CHARACTER } from "../constants/character.constants";
import { characterService } from "../../../../../lib/character.service";

interface UseCharacterReturn {
  character: CharacterState;
  updateField: UpdateFieldFn;
  isLoading: boolean;
  isSaving: boolean;
  saveSuccess: boolean;
  error: string;
  handleSave: () => Promise<void>;
}

export function useCharacter(characterId?: string): UseCharacterReturn {
  const navigate = useNavigate();

  const [character, setCharacter] = useState<CharacterState>(DEFAULT_CHARACTER);
  const [isLoading, setIsLoading] = useState(!!characterId);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (characterId) {
      loadCharacter(characterId);
    }
  }, [characterId]);

  async function loadCharacter(id: string) {
    try {
      setIsLoading(true);
      const data = await characterService.getCharacter(id);
      const sheetData = data.sheetData || {};

      setCharacter({
        ...DEFAULT_CHARACTER,
        ...sheetData,
        name: data.name, // name always wins to avoid stale sheetData override
      });
    } catch (err) {
      console.error("Error loading character:", err);
      setError("Erro ao carregar personagem");
    } finally {
      setIsLoading(false);
    }
  }

  const updateField = useCallback(<K extends keyof CharacterState>(
    key: K,
    value: CharacterState[K],
  ) => {
    setCharacter((prev) => ({ ...prev, [key]: value }));
  }, []);

  async function handleSave() {
    if (!character.name.trim()) {
      setError("O nome do personagem é obrigatório");
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      const sheetData = { ...character };

      if (characterId) {
        await characterService.updateCharacter(characterId, {
          name: character.name,
          sheetData,
        });
      } else {
        const created = await characterService.createCharacter({
          name: character.name,
          system: "DND_5E",
          sheetData,
        });
        navigate(`/dashboard/character/${created.id}/edit`, { replace: true });
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err: unknown) {
      console.error("Error saving character:", err);
      const message = err instanceof Error ? err.message : "Erro ao salvar personagem";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  }

  return {
    character,
    updateField,
    isLoading,
    isSaving,
    saveSuccess,
    error,
    handleSave,
  };
}
