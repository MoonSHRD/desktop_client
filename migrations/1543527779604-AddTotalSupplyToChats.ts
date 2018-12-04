import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTotalSupplyToChats1543527779604 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        console.log("mgr_up 1");
        // await queryRunner.query(`PRAGMA foreign_keys=OFF`);
        await queryRunner.query(`CREATE TABLE "temporary_chat_model" ("id" varchar PRIMARY KEY NOT NULL, "domain" varchar NOT NULL, "name" varchar NOT NULL, "bio" varchar NOT NULL, "avatar" varchar NOT NULL, "role" varchar NOT NULL, "type" varchar NOT NULL, "contract_address" varchar NOT NULL, "unread_messages" integer NOT NULL, "total_supply" varchar)`);
        await queryRunner.query(`INSERT INTO "temporary_chat_model"("id", "domain", "name", "bio", "avatar", "role", "type", "contract_address", "unread_messages", "total_supply") SELECT "id", "domain", "name", "bio", "avatar", "role", "type", "contract_address", "unread_messages", "title" FROM "chat_model"`);
        await queryRunner.query(`DROP TABLE "chat_model";`);
        await queryRunner.query(`ALTER TABLE "temporary_chat_model" RENAME TO "chat_model"`);
        // await queryRunner.query(`PRAGMA foreign_keys=ON`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "chat_model" RENAME TO "temporary_chat_model"`);
        await queryRunner.query(`CREATE TABLE "chat_model" ("id" varchar PRIMARY KEY NOT NULL, "domain" varchar NOT NULL, "name" varchar NOT NULL, "bio" varchar NOT NULL, "avatar" varchar NOT NULL, "role" varchar NOT NULL, "type" varchar NOT NULL, "contract_address" varchar NOT NULL, "unread_messages" integer NOT NULL, "title" varchar)`);
        await queryRunner.query(`INSERT INTO "chat_model"("id", "domain", "name", "bio", "avatar", "role", "type", "contract_address", "unread_messages", "title") SELECT "id", "domain", "name", "bio", "avatar", "role", "type", "contract_address", "unread_messages", "total_supply" FROM "temporary_chat_model"`);
        await queryRunner.query(`DROP TABLE "temporary_chat_model"`);
    }
    //
    // async up(queryRunner: QueryRunner): Promise<any> {
    //     console.log("mgr_up");
    //
    //     const table = await queryRunner.getTable("chat_model");
    //     console.log(table.foreignKeys);
    //     // const foreignKey = table.foreignKeys;
    //     // await queryRunner.query(`ALTER TABLE "chat_model" add column "total_supply" varchar(255)`);
    // }
    //
    // async down(queryRunner: QueryRunner): Promise<any> {
    //     // await queryRunner.query(``);
    // }

}
