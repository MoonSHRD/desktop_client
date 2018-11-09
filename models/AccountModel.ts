import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne,JoinColumn} from "typeorm";
import {UserModel} from "./UserModel";

@Entity()
export class AccountModel extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    privKey: string;
    @Column()
    downloads: string = "./downloads/";
    @Column()
    passphrase: string;
    @Column()
    width: number = 1000;
    @Column()
    height: number = 700;
    @Column()
    width_chats: number = 370;
    @Column()
    last_chat: string;

    @OneToOne(type => UserModel, user => user.account)
    @JoinColumn()
    user: UserModel;


    host: string;
    jidhost: string;
    port: number;
}
