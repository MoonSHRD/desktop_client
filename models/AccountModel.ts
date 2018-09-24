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
    // @Column()
    // address: string="";
    // @Column()
    // domain: string;
    // @Column()
    // name: string;
    // @Column()
    // firstname: string;
    // @Column()
    // lastname: string="";
    // @Column()
    // bio: string="";
    // @Column()
    // avatar: string="";

    @OneToOne(type => UserModel, user => user.account)
    @JoinColumn()
    user: UserModel;


    host: string;
    jidhost: string;
    port: number;
}
