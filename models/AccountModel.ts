import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";

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
    @Column()
    address: string="";
    @Column()
    domain: string;
    @Column()
    name: string;
    @Column()
    firstname: string;
    @Column()
    lastname: string="";
    @Column()
    bio: string="";
    @Column()
    avatar: string="";


    host: string;
    jidhost: string;
    port: number;
}
