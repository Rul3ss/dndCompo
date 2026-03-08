import { apiClient } from './apiClient';

import { API_BASE_URL } from './config';

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

export const characterService = {
  async getAllCharacters(): Promise<Character[]> {
    const response = await apiClient(`${API_BASE_URL}/characters`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch characters');
    }
    return response.json();
  },

  async getCharacter(id: string): Promise<Character> {
    const response = await apiClient(`${API_BASE_URL}/characters/${id}`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch character');
    }
    return response.json();
  },

  async createCharacter(data: CreateCharacterDto): Promise<Character> {
    const response = await apiClient(`${API_BASE_URL}/characters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create character');
    }
    return response.json();
  },

  async deleteCharacter(id: string): Promise<void> {
    const response = await apiClient(`${API_BASE_URL}/characters/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete character');
    }
  },
};
