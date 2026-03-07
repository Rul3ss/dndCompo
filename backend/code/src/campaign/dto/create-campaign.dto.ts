import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { RpgSystem } from '../../common/enums/rpg-system.enum';

export class CreateCampaignDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(RpgSystem)
  @IsOptional()
  system?: RpgSystem;

  @IsInt()
  @Min(2)
  @Max(20)
  @IsOptional()
  maxPlayers?: number;
}
