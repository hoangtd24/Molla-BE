import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1694597999814 implements MigrationInterface {
    name = 'Migrations1694597999814'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "discount" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "discount_percent" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL, "quantity_day" integer NOT NULL, CONSTRAINT "PK_d05d8712e429673e459e7f1cddb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "review" ("id" SERIAL NOT NULL, "content" character varying NOT NULL, "rating" double precision NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "productId" integer, CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "price" integer NOT NULL, "images" text array NOT NULL, "averageRating" double precision, "discountId" integer, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "payment" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "desc" character varying NOT NULL, CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "address" character varying NOT NULL, "total" double precision NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "paymentId" integer, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cart" ("id" SERIAL NOT NULL, "qty" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "productId" integer, "userId" integer, "orderId" integer, CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "phone" character varying, "address" character varying, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "wishlist" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "productId" integer, "userId" integer, CONSTRAINT "PK_620bff4a240d66c357b5d820eaa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "review_like_user" ("reviewId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_06cc22922d9c46187f544e35c19" PRIMARY KEY ("reviewId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_726c5c0134dbc02d0a4cec4b6f" ON "review_like_user" ("reviewId") `);
        await queryRunner.query(`CREATE INDEX "IDX_746beb30da37ccec71f5da3135" ON "review_like_user" ("userId") `);
        await queryRunner.query(`CREATE TABLE "review_dislike_user" ("reviewId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_81a344fb7ba194042c837941461" PRIMARY KEY ("reviewId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c87ed22ad6650a15ae839212aa" ON "review_dislike_user" ("reviewId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3123f0ed6049d7ad53ca9e2f29" ON "review_dislike_user" ("userId") `);
        await queryRunner.query(`CREATE TABLE "product_categories_category" ("productId" integer NOT NULL, "categoryId" integer NOT NULL, CONSTRAINT "PK_17f2a361443184000ee8d79f240" PRIMARY KEY ("productId", "categoryId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_342d06dd0583aafc156e076379" ON "product_categories_category" ("productId") `);
        await queryRunner.query(`CREATE INDEX "IDX_15520e638eb4c46c4fb2c61c4b" ON "product_categories_category" ("categoryId") `);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_1337f93918c70837d3cea105d39" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_2a11d3c0ea1b2b5b1790f762b9a" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_1e0bf1305eddcd6627b4a32a6c6" FOREIGN KEY ("discountId") REFERENCES "discount"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_9ad13532f48db4ac5a3b3dd70e5" FOREIGN KEY ("paymentId") REFERENCES "payment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart" ADD CONSTRAINT "FK_371eb56ecc4104c2644711fa85f" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart" ADD CONSTRAINT "FK_756f53ab9466eb52a52619ee019" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart" ADD CONSTRAINT "FK_ae4bf95cc793726b3e35f7ad982" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wishlist" ADD CONSTRAINT "FK_17e00e49d77ccaf7ff0e14de37b" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wishlist" ADD CONSTRAINT "FK_f6eeb74a295e2aad03b76b0ba87" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review_like_user" ADD CONSTRAINT "FK_726c5c0134dbc02d0a4cec4b6f7" FOREIGN KEY ("reviewId") REFERENCES "review"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "review_like_user" ADD CONSTRAINT "FK_746beb30da37ccec71f5da31352" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "review_dislike_user" ADD CONSTRAINT "FK_c87ed22ad6650a15ae839212aa7" FOREIGN KEY ("reviewId") REFERENCES "review"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "review_dislike_user" ADD CONSTRAINT "FK_3123f0ed6049d7ad53ca9e2f296" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_categories_category" ADD CONSTRAINT "FK_342d06dd0583aafc156e0763790" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_categories_category" ADD CONSTRAINT "FK_15520e638eb4c46c4fb2c61c4b4" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_categories_category" DROP CONSTRAINT "FK_15520e638eb4c46c4fb2c61c4b4"`);
        await queryRunner.query(`ALTER TABLE "product_categories_category" DROP CONSTRAINT "FK_342d06dd0583aafc156e0763790"`);
        await queryRunner.query(`ALTER TABLE "review_dislike_user" DROP CONSTRAINT "FK_3123f0ed6049d7ad53ca9e2f296"`);
        await queryRunner.query(`ALTER TABLE "review_dislike_user" DROP CONSTRAINT "FK_c87ed22ad6650a15ae839212aa7"`);
        await queryRunner.query(`ALTER TABLE "review_like_user" DROP CONSTRAINT "FK_746beb30da37ccec71f5da31352"`);
        await queryRunner.query(`ALTER TABLE "review_like_user" DROP CONSTRAINT "FK_726c5c0134dbc02d0a4cec4b6f7"`);
        await queryRunner.query(`ALTER TABLE "wishlist" DROP CONSTRAINT "FK_f6eeb74a295e2aad03b76b0ba87"`);
        await queryRunner.query(`ALTER TABLE "wishlist" DROP CONSTRAINT "FK_17e00e49d77ccaf7ff0e14de37b"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_ae4bf95cc793726b3e35f7ad982"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_756f53ab9466eb52a52619ee019"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_371eb56ecc4104c2644711fa85f"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_9ad13532f48db4ac5a3b3dd70e5"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_1e0bf1305eddcd6627b4a32a6c6"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_2a11d3c0ea1b2b5b1790f762b9a"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_1337f93918c70837d3cea105d39"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_15520e638eb4c46c4fb2c61c4b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_342d06dd0583aafc156e076379"`);
        await queryRunner.query(`DROP TABLE "product_categories_category"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3123f0ed6049d7ad53ca9e2f29"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c87ed22ad6650a15ae839212aa"`);
        await queryRunner.query(`DROP TABLE "review_dislike_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_746beb30da37ccec71f5da3135"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_726c5c0134dbc02d0a4cec4b6f"`);
        await queryRunner.query(`DROP TABLE "review_like_user"`);
        await queryRunner.query(`DROP TABLE "wishlist"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "cart"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TABLE "payment"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "review"`);
        await queryRunner.query(`DROP TABLE "discount"`);
        await queryRunner.query(`DROP TABLE "category"`);
    }

}
