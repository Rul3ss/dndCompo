import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { RpgSystem } from '../../common/enums/rpg-system.enum';

@Entity('characters')
export class Character {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: RpgSystem, default: RpgSystem.DND_5E })
  system: RpgSystem;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ type: 'text', nullable: true })
  backstory: string;

  /**
   * sheetData armazena todos os dados da ficha como JSON flexível.
   * Exemplo para D&D 5e:
   * {
   *   "race": "Elfo",
   *   "class": "Mago",
   *   "level": 5,
   *   "attributes": { "str": 10, "dex": 16, "con": 12, "int": 18, "wis": 14, "cha": 12 },
   *   "hp": { "max": 32, "current": 32 },
   *   "armorClass": 13,
   *   "speed": 30,
   *   "skills": { "arcana": true, "history": true },
   *   "proficiencyBonus": 3,
   *   "inventory": [],
   *   "spells": []
   * }
   */
  @Column({ type: 'jsonb', nullable: true })
  sheetData: Record<string, any>;

  @Column({ default: false })
  isPublic: boolean;

  @Column()
  ownerId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
