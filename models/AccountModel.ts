import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne,JoinColumn} from "typeorm";
import {UserModel} from "./UserModel";

@Entity()
export class AccountModel extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    privKey: string;
    @Column()
    privKeyLoom: string="";
    @Column()
    passphrase: string;

    @OneToOne(type => UserModel, user => user.account)
    @JoinColumn()
    user: UserModel;


    host: string;
    jidhost: string;
    port: number;
}
