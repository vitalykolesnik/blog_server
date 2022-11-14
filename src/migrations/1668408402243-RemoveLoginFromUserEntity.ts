import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveLoginFromUserEntity1668408402243 implements MigrationInterface {
    name = 'RemoveLoginFromUserEntity1668408402243'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "login"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "login" character varying NOT NULL`);
    }

}
