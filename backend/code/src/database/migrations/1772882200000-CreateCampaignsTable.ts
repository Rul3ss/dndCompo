import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCampaignsTable1772882100000 implements MigrationInterface {
  name = 'CreateCampaignsTable1772882100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "campaign_status_enum" AS ENUM (
        'ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED'
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "campaigns" (
        "id"          uuid                   NOT NULL DEFAULT uuid_generate_v4(),
        "name"        character varying      NOT NULL,
        "description" text,
        "system"      "rpg_system_enum"      NOT NULL DEFAULT 'DND_5E',
        "imageUrl"    character varying,
        "gmId"        uuid                   NOT NULL,
        "inviteCode"  character varying      NOT NULL,
        "maxPlayers"  integer                NOT NULL DEFAULT 6,
        "status"      "campaign_status_enum" NOT NULL DEFAULT 'ACTIVE',
        "createdAt"   TIMESTAMP              NOT NULL DEFAULT now(),
        "updatedAt"   TIMESTAMP              NOT NULL DEFAULT now(),
        CONSTRAINT "PK_campaigns"          PRIMARY KEY ("id"),
        CONSTRAINT "UQ_campaigns_inviteCode" UNIQUE ("inviteCode"),
        CONSTRAINT "FK_campaigns_gm"
          FOREIGN KEY ("gmId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "campaigns"`);
    await queryRunner.query(`DROP TYPE "campaign_status_enum"`);
  }
}
