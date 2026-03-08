import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { JoinCampaignDto } from './dto/join-campaign.dto';
import { RespondMembershipDto } from './dto/respond-membership.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('campaigns')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  create(@Request() req: any, @Body() dto: CreateCampaignDto) {
    return this.campaignService.create(req.user.userId, dto);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.campaignService.findAllForUser(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campaignService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: UpdateCampaignDto,
  ) {
    return this.campaignService.update(id, req.user.userId, dto);
  }

  @Delete(':id')
  archive(@Param('id') id: string, @Request() req: any) {
    return this.campaignService.archive(id, req.user.userId);
  }

  // Jogador solicita entrada via código de convite
  @Post('join/:inviteCode')
  join(
    @Param('inviteCode') inviteCode: string,
    @Request() req: any,
    @Body() dto: JoinCampaignDto,
  ) {
    return this.campaignService.joinByCode(req.user.userId, inviteCode, dto);
  }

  // GM lista membros/solicitações
  @Get(':id/members')
  listMembers(@Param('id') id: string, @Request() req: any) {
    return this.campaignService.listMembers(id, req.user.userId);
  }

  // GM aceita ou rejeita uma solicitação
  @Patch(':id/members/:membershipId')
  respondMembership(
    @Param('id') id: string,
    @Param('membershipId') membershipId: string,
    @Request() req: any,
    @Body() dto: RespondMembershipDto,
  ) {
    return this.campaignService.respondMembership(id, membershipId, req.user.userId, dto);
  }

  // GM faz upload da capa da campanha
  @Post(':id/image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/campaigns',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new BadRequestException('Apenas imagens são permitidas!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadImage(
    @Param('id') id: string,
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Nenhum arquivo enviado');
    const protocol = req.protocol;
    const host = req.get('host');
    const imageUrl = `${protocol}://${host}/public/campaigns/${file.filename}`;
    return this.campaignService.updateImage(id, req.user.userId, imageUrl);
  }
}
