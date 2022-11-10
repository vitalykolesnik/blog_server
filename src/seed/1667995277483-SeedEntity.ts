import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedEntity1667995277483 implements MigrationInterface {
  name = 'SeedEntity1667995277483';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO tags(name, description) VALUES ('coffee', 'oh yes'), ('pizza', 'cool');`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
