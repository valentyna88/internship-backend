import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCompanyMembers1772115897622 implements MigrationInterface {
    name = 'AddCompanyMembers1772115897622'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company_members" DROP CONSTRAINT "FK_ee30e433648d2a45dfd38cfb366"`);
        await queryRunner.query(`ALTER TABLE "company_members" DROP CONSTRAINT "FK_b90cba2c7d2186fa520ee5e39a9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ee30e433648d2a45dfd38cfb36"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b90cba2c7d2186fa520ee5e39a"`);
        await queryRunner.query(`ALTER TABLE "company_members" DROP CONSTRAINT "PK_32cfc84ca28ef5a0eae635214a1"`);
        await queryRunner.query(`ALTER TABLE "company_members" ADD CONSTRAINT "PK_b90cba2c7d2186fa520ee5e39a9" PRIMARY KEY ("userId")`);
        await queryRunner.query(`ALTER TABLE "company_members" DROP COLUMN "companyId"`);
        await queryRunner.query(`ALTER TABLE "company_members" DROP CONSTRAINT "PK_b90cba2c7d2186fa520ee5e39a9"`);
        await queryRunner.query(`ALTER TABLE "company_members" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "company_members" ADD "usersId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company_members" ADD CONSTRAINT "PK_1c5dc6a7b929fb1cfe809d1015b" PRIMARY KEY ("usersId")`);
        await queryRunner.query(`ALTER TABLE "company_members" ADD "companiesId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company_members" DROP CONSTRAINT "PK_1c5dc6a7b929fb1cfe809d1015b"`);
        await queryRunner.query(`ALTER TABLE "company_members" ADD CONSTRAINT "PK_539d65a2a7501684917c38600bb" PRIMARY KEY ("usersId", "companiesId")`);
        await queryRunner.query(`CREATE INDEX "IDX_1c5dc6a7b929fb1cfe809d1015" ON "company_members" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_48a815181e9f697afe8acc703f" ON "company_members" ("companiesId") `);
        await queryRunner.query(`ALTER TABLE "company_members" ADD CONSTRAINT "FK_1c5dc6a7b929fb1cfe809d1015b" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "company_members" ADD CONSTRAINT "FK_48a815181e9f697afe8acc703fd" FOREIGN KEY ("companiesId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company_members" DROP CONSTRAINT "FK_48a815181e9f697afe8acc703fd"`);
        await queryRunner.query(`ALTER TABLE "company_members" DROP CONSTRAINT "FK_1c5dc6a7b929fb1cfe809d1015b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_48a815181e9f697afe8acc703f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1c5dc6a7b929fb1cfe809d1015"`);
        await queryRunner.query(`ALTER TABLE "company_members" DROP CONSTRAINT "PK_539d65a2a7501684917c38600bb"`);
        await queryRunner.query(`ALTER TABLE "company_members" ADD CONSTRAINT "PK_1c5dc6a7b929fb1cfe809d1015b" PRIMARY KEY ("usersId")`);
        await queryRunner.query(`ALTER TABLE "company_members" DROP COLUMN "companiesId"`);
        await queryRunner.query(`ALTER TABLE "company_members" DROP CONSTRAINT "PK_1c5dc6a7b929fb1cfe809d1015b"`);
        await queryRunner.query(`ALTER TABLE "company_members" DROP COLUMN "usersId"`);
        await queryRunner.query(`ALTER TABLE "company_members" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company_members" ADD CONSTRAINT "PK_b90cba2c7d2186fa520ee5e39a9" PRIMARY KEY ("userId")`);
        await queryRunner.query(`ALTER TABLE "company_members" ADD "companyId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company_members" DROP CONSTRAINT "PK_b90cba2c7d2186fa520ee5e39a9"`);
        await queryRunner.query(`ALTER TABLE "company_members" ADD CONSTRAINT "PK_32cfc84ca28ef5a0eae635214a1" PRIMARY KEY ("companyId", "userId")`);
        await queryRunner.query(`CREATE INDEX "IDX_b90cba2c7d2186fa520ee5e39a" ON "company_members" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ee30e433648d2a45dfd38cfb36" ON "company_members" ("companyId") `);
        await queryRunner.query(`ALTER TABLE "company_members" ADD CONSTRAINT "FK_b90cba2c7d2186fa520ee5e39a9" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "company_members" ADD CONSTRAINT "FK_ee30e433648d2a45dfd38cfb366" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
