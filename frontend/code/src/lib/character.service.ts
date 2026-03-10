import { apiClient } from "./apiClient";

import { API_BASE_URL } from "./config";

export interface Character {
  id: string;
  name: string;
  system: string;
  imageUrl?: string;
  backstory?: string;
  sheetData?: Record<string, any>;
  isPublic: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCharacterDto {
  name: string;
  system?: string;
  imageUrl?: string;
  backstory?: string;
  sheetData?: Record<string, any>;
  isPublic?: boolean;
}

export interface UpdateCharacterDto {
  name?: string;
  system?: string;
  imageUrl?: string;
  backstory?: string;
  sheetData?: Record<string, any>;
  isPublic?: boolean;
}

export const characterService = {
  async getAllCharacters(): Promise<Character[]> {
    const response = await apiClient(`${API_BASE_URL}/characters`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch characters");
    }
    return response.json();
  },

  async getCharacter(id: string): Promise<Character> {
    const response = await apiClient(`${API_BASE_URL}/characters/${id}`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch character");
    }
    return response.json();
  },

  async createCharacter(data: CreateCharacterDto): Promise<Character> {
    const response = await apiClient(`${API_BASE_URL}/characters`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to create character");
    }
    return response.json();
  },

  async deleteCharacter(id: string): Promise<void> {
    const response = await apiClient(`${API_BASE_URL}/characters/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete character");
    }
  },

  async updateCharacter(
    id: string,
    data: UpdateCharacterDto,
  ): Promise<Character> {
    const response = await apiClient(`${API_BASE_URL}/characters/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to update character");
    }
    return response.json();
  },

  async uploadCharacterImage(id: string, file: File): Promise<Character> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient(`${API_BASE_URL}/characters/${id}/image`, {
      method: 'POST',
      body: formData,
      // Não definimos Content-Type para FormData, o navegador faz isso automaticamente com o boundary
    });

    if (!response.ok) {
      throw new Error('Failed to upload character image');
    }
    return response.json();
  },
};
