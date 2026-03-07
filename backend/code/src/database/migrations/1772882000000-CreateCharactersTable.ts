import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCharactersTable1772882000000 implements MigrationInterface {
  name = 'CreateCharactersTable1772882000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "rpg_system_enum" AS ENUM (
        'DND_5E', 'PATHFINDER', 'VAMPIRE_MASQUERADE', 'CALL_OF_CTHULHU', 'CUSTOM'
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "characters" (
        "id"          uuid              NOT NULL DEFAULT uuid_generate_v4(),
        "name"        character varying NOT NULL,
        "system"      "rpg_system_enum" NOT NULL DEFAULT 'DND_5E',
        "imageUrl"    character varying,
        "backstory"   text,
        "sheetData"   jsonb,
        "isPublic"    boolean           NOT NULL DEFAULT false,
        "ownerId"     uuid              NOT NULL,
        "createdAt"   TIMESTAMP         NOT NULL DEFAULT now(),
        "updatedAt"   TIMESTAMP         NOT NULL DEFAULT now(),
        CONSTRAINT "PK_characters" PRIMARY KEY ("id"),
        CONSTRAINT "FK_characters_owner"
          FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "characters"`);
    await queryRunner.query(`DROP TYPE "rpg_system_enum"`);
  }
}
