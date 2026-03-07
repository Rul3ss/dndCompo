import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCampaignMembershipsTable1772882300000 implements MigrationInterface {
  name = 'CreateCampaignMembershipsTable1772882300000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "membership_status_enum" AS ENUM (
        'PENDING', 'ACCEPTED', 'REJECTED'
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "campaign_memberships" (
        "id"             uuid                     NOT NULL DEFAULT uuid_generate_v4(),
        "campaignId"     uuid                     NOT NULL,
        "userId"         uuid                     NOT NULL,
        "characterId"    uuid,
        "status"         "membership_status_enum" NOT NULL DEFAULT 'PENDING',
        "requestMessage" text,
        "respondedAt"    TIMESTAMP,
        "createdAt"      TIMESTAMP                NOT NULL DEFAULT now(),
        CONSTRAINT "PK_campaign_memberships"  PRIMARY KEY ("id"),
        CONSTRAINT "FK_memberships_campaign"
          FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_memberships_user"
          FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_memberships_character"
          FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE SET NULL
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "campaign_memberships"`);
    await queryRunner.query(`DROP TYPE "membership_status_enum"`);
  }
}
