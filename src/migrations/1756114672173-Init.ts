import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1756114672173 implements MigrationInterface {
    name = 'Init1756114672173'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "fk_subscription_user"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "fk_subscription_service"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "fk_subscription_payment"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "service_price_check"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "payment_amount_check"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "payment_status_check"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "uk_service_name_type"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "uk_payment_transaction_no"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "transaction_no"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "service_id"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "user_email" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "pg_payment_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "user_id" bigint`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD "updated_at" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD "product_id" bigint`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "product_id_seq" OWNED BY "product"."id"`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "id" SET DEFAULT nextval('"product_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "price" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "status" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "amount" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "payment_date" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "subscription" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "subscription" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subscription" ALTER COLUMN "payment_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "UQ_25f8afce4159ee83cf8c6da622d" UNIQUE ("payment_id")`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`CREATE UNIQUE INDEX "uq_subscription_payment_id" ON "subscription" ("payment_id") `);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_c66c60a17b56ec882fcd8ec770b" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "FK_940d49a105d50bbd616be540013" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "FK_7fe49a45c06703b6cb93244817f" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "FK_25f8afce4159ee83cf8c6da622d" FOREIGN KEY ("payment_id") REFERENCES "payment"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_25f8afce4159ee83cf8c6da622d"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_7fe49a45c06703b6cb93244817f"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_940d49a105d50bbd616be540013"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_c66c60a17b56ec882fcd8ec770b"`);
        await queryRunner.query(`DROP INDEX "public"."uq_subscription_payment_id"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updated_at" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "UQ_25f8afce4159ee83cf8c6da622d"`);
        await queryRunner.query(`ALTER TABLE "subscription" ALTER COLUMN "payment_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subscription" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subscription" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "payment_date" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "amount" bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "status" character varying(20) NOT NULL DEFAULT 'PAID'`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "updated_at" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "price" bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "updated_at" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "id" SET DEFAULT nextval('service_id_seq')`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "product_id_seq"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "product_id"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "pg_payment_id"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "user_email"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "name" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD "service_id" bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "transaction_no" character varying(128) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "uk_payment_transaction_no" UNIQUE ("transaction_no")`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "uk_service_name_type" UNIQUE ("name", "type")`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "payment_status_check" CHECK (((status)::text = ANY ((ARRAY['PAID'::character varying, 'REFUNDED'::character varying, 'CANCELED'::character varying])::text[])))`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "payment_amount_check" CHECK ((amount >= 0))`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "service_price_check" CHECK ((price >= 0))`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "fk_subscription_payment" FOREIGN KEY ("payment_id") REFERENCES "payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "fk_subscription_service" FOREIGN KEY ("service_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "fk_subscription_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
