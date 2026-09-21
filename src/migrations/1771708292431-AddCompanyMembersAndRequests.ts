import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCompanyMembersAndRequests1771708292431 implements MigrationInterface {
    name = 'AddCompanyMembersAndRequests1771708292431'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."company_requests_type_enum" AS ENUM('invitation', 'join_request')`);
        await queryRunner.query(`CREATE TYPE "public"."company_requests_status_enum" AS ENUM('pending', 'accepted', 'declined')`);
        await queryRunner.query(`CREATE TABLE "company_requests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "companyId" uuid NOT NULL, "userId" uuid NOT NULL, "type" "public"."company_requests_type_enum" NOT NULL, "status" "public"."company_requests_status_enum" NOT NULL DEFAULT 'pending', CONSTRAINT "PK_bf46902b128a79355c19161f3e0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "company_members" ("companyId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_32cfc84ca28ef5a0eae635214a1" PRIMARY KEY ("companyId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ee30e433648d2a45dfd38cfb36" ON "company_members" ("companyId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b90cba2c7d2186fa520ee5e39a" ON "company_members" ("userId") `);
        await queryRunner.query(`ALTER TABLE "company_requests" ADD CONSTRAINT "FK_6d8bd0ab85beb418877588274d5" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "company_requests" ADD CONSTRAINT "FK_38218ddb417caeb420270195969" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "company_members" ADD CONSTRAINT "FK_ee30e433648d2a45dfd38cfb366" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "company_members" ADD CONSTRAINT "FK_b90cba2c7d2186fa520ee5e39a9" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company_members" DROP CONSTRAINT "FK_b90cba2c7d2186fa520ee5e39a9"`);
        await queryRunner.query(`ALTER TABLE "company_members" DROP CONSTRAINT "FK_ee30e433648d2a45dfd38cfb366"`);
        await queryRunner.query(`ALTER TABLE "company_requests" DROP CONSTRAINT "FK_38218ddb417caeb420270195969"`);
        await queryRunner.query(`ALTER TABLE "company_requests" DROP CONSTRAINT "FK_6d8bd0ab85beb418877588274d5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b90cba2c7d2186fa520ee5e39a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ee30e433648d2a45dfd38cfb36"`);
        await queryRunner.query(`DROP TABLE "company_members"`);
        await queryRunner.query(`DROP TABLE "company_requests"`);
        await queryRunner.query(`DROP TYPE "public"."company_requests_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."company_requests_type_enum"`);
    }

}
