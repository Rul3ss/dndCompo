import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsObject,
} from 'class-validator';
import { RpgSystem } from '../../common/enums/rpg-system.enum';

export class CreateCharacterDto {
  @IsString()
  name: string;

  @IsEnum(RpgSystem)
  @IsOptional()
  system?: RpgSystem;

  @IsString()
  @IsOptional()
  backstory?: string;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  /**
   * Dados específicos do sistema de RPG.
   * Para D&D 5e, por exemplo:
   * {
   *   "race": "Elfo", "class": "Mago", "level": 1,
   *   "attributes": { "str": 10, "dex": 14 ... },
   *   ...
   * }
   */
  @IsObject()
  @IsOptional()
  sheetData?: Record<string, any>;
}
