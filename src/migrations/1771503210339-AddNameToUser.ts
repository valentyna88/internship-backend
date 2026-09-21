import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNameToUser1771503210339 implements MigrationInterface {
    name = 'AddNameToUser1771503210339'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
    }

}
