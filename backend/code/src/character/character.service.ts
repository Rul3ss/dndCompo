import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Character } from './entities/character.entity';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';

@Injectable()
export class CharacterService {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepo: Repository<Character>,
  ) {}

  async create(ownerId: string, dto: CreateCharacterDto): Promise<Character> {
    const character = this.characterRepo.create({ ...dto, ownerId });
    return this.characterRepo.save(character);
  }

  async findAllByOwner(ownerId: string): Promise<Character[]> {
    return this.characterRepo.find({
      where: { ownerId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, requesterId: string): Promise<Character> {
    const character = await this.characterRepo.findOne({ where: { id } });
    if (!character) throw new NotFoundException('Personagem não encontrado');
    if (!character.isPublic && character.ownerId !== requesterId) {
      throw new ForbiddenException('Acesso negado a este personagem');
    }
    return character;
  }

  async update(id: string, requesterId: string, dto: UpdateCharacterDto): Promise<Character> {
    const character = await this.characterRepo.findOne({ where: { id } });
    if (!character) throw new NotFoundException('Personagem não encontrado');
    if (character.ownerId !== requesterId) {
      throw new ForbiddenException('Apenas o dono pode editar este personagem');
    }
    Object.assign(character, dto);
    return this.characterRepo.save(character);
  }

  async remove(id: string, requesterId: string): Promise<void> {
    const character = await this.characterRepo.findOne({ where: { id } });
    if (!character) throw new NotFoundException('Personagem não encontrado');
    if (character.ownerId !== requesterId) {
      throw new ForbiddenException('Apenas o dono pode deletar este personagem');
    }
    await this.characterRepo.remove(character);
  }

  async updateImage(id: string, requesterId: string, imageUrl: string): Promise<Character> {
    const character = await this.characterRepo.findOne({ where: { id } });
    if (!character) throw new NotFoundException('Personagem não encontrado');
    if (character.ownerId !== requesterId) {
      throw new ForbiddenException('Acesso negado');
    }
    character.imageUrl = imageUrl;
    return this.characterRepo.save(character);
  }
}
