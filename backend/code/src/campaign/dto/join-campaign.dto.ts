import { IsString, IsOptional, IsUUID } from 'class-validator';

export class JoinCampaignDto {
  @IsUUID()
  @IsOptional()
  characterId?: string;

  @IsString()
  @IsOptional()
  requestMessage?: string;
}
