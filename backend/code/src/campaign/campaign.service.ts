import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { Campaign, CampaignStatus } from './entities/campaign.entity';
import { CampaignMembership, MembershipStatus } from './entities/campaign-membership.entity';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { JoinCampaignDto } from './dto/join-campaign.dto';
import { RespondMembershipDto } from './dto/respond-membership.dto';

@Injectable()
export class CampaignService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepo: Repository<Campaign>,
    @InjectRepository(CampaignMembership)
    private readonly membershipRepo: Repository<CampaignMembership>,
  ) {}

  private generateInviteCode(): string {
    return randomBytes(4).toString('hex').toUpperCase(); // ex: A3F2C1B8
  }

  async create(gmId: string, dto: CreateCampaignDto): Promise<Campaign> {
    const inviteCode = this.generateInviteCode();
    const campaign = this.campaignRepo.create({ ...dto, gmId, inviteCode });
    return this.campaignRepo.save(campaign);
  }

  async findAllForUser(userId: string): Promise<Campaign[]> {
    // Mesas onde o user é GM
    const asgm = await this.campaignRepo.find({ where: { gmId: userId } });

    // Mesas onde o user é membro aceito
    const memberships = await this.membershipRepo.find({
      where: { userId, status: MembershipStatus.ACCEPTED },
      relations: ['campaign'],
    });
    const asPlayer = memberships.map(m => m.campaign);

    // Mescla e remove duplicatas
    const all = [...asgm, ...asPlayer];
    const unique = all.filter((cam, idx, arr) => arr.findIndex(c => c.id === cam.id) === idx);
    return unique;
  }

  async findOne(id: string): Promise<Campaign> {
    const campaign = await this.campaignRepo.findOne({
      where: { id },
      relations: ['gm'],
    });
    if (!campaign) throw new NotFoundException('Campanha não encontrada');
    return campaign;
  }

  async update(id: string, gmId: string, dto: UpdateCampaignDto): Promise<Campaign> {
    const campaign = await this.findOne(id);
    if (campaign.gmId !== gmId) throw new ForbiddenException('Apenas o GM pode editar a campanha');
    Object.assign(campaign, dto);
    return this.campaignRepo.save(campaign);
  }

  async archive(id: string, gmId: string): Promise<Campaign> {
    return this.update(id, gmId, { status: CampaignStatus.ARCHIVED });
  }

  // Jogador solicita entrada via inviteCode
  async joinByCode(userId: string, inviteCode: string, dto: JoinCampaignDto): Promise<CampaignMembership> {
    const campaign = await this.campaignRepo.findOne({ where: { inviteCode } });
    if (!campaign) throw new NotFoundException('Código de convite inválido');
    if (campaign.gmId === userId) throw new ForbiddenException('O GM não pode solicitar entrada na própria mesa');

    const existing = await this.membershipRepo.findOne({
      where: { campaignId: campaign.id, userId },
    });
    if (existing) throw new ConflictException('Você já tem uma solicitação para esta campanha');

    const membership = this.membershipRepo.create({
      campaignId: campaign.id,
      userId,
      characterId: dto.characterId ?? null,
      requestMessage: dto.requestMessage ?? null,
    } as any) as unknown as CampaignMembership;
    return this.membershipRepo.save(membership);
  }

  // GM lista todas as solicitações da sua campanha
  async listMembers(campaignId: string, gmId: string): Promise<CampaignMembership[]> {
    const campaign = await this.findOne(campaignId);
    if (campaign.gmId !== gmId) throw new ForbiddenException('Apenas o GM pode ver os membros');
    return this.membershipRepo.find({
      where: { campaignId },
      relations: ['user', 'character'],
      order: { createdAt: 'ASC' },
    });
  }

  // GM aceita ou rejeita
  async respondMembership(
    campaignId: string,
    membershipId: string,
    gmId: string,
    dto: RespondMembershipDto,
  ): Promise<CampaignMembership> {
    const campaign = await this.findOne(campaignId);
    if (campaign.gmId !== gmId) throw new ForbiddenException('Apenas o GM pode responder solicitações');

    const membership = await this.membershipRepo.findOne({ where: { id: membershipId, campaignId } });
    if (!membership) throw new NotFoundException('Solicitação não encontrada');

    membership.status = dto.status;
    membership.respondedAt = new Date();
    return this.membershipRepo.save(membership);
  }

  async updateImage(id: string, gmId: string, imageUrl: string): Promise<Campaign> {
    const campaign = await this.findOne(id);
    if (campaign.gmId !== gmId) throw new ForbiddenException('Apenas o GM pode alterar a imagem');
    campaign.imageUrl = imageUrl;
    return this.campaignRepo.save(campaign);
  }
}
