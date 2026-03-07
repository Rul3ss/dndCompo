import { IsEnum } from 'class-validator';
import { MembershipStatus } from '../entities/campaign-membership.entity';

export class RespondMembershipDto {
  @IsEnum([MembershipStatus.ACCEPTED, MembershipStatus.REJECTED])
  status: MembershipStatus.ACCEPTED | MembershipStatus.REJECTED;
}
