import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";

@Entity()
export class SettingsModel extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    downloads: string = "./downloads/";
    @Column()
    width: number = 1000;
    @Column()
    height: number = 700;
    @Column()
    width_chats: number = 370;
    @Column()
    last_chat: string;
    @Column()
    language: string = "en";
}
