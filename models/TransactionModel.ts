import {Entity, PrimaryColumn, Column, BaseEntity, ManyToOne,JoinColumn} from "typeorm";
import {UserModel} from "./UserModel";

@Entity()
export class TransactionModel extends BaseEntity {

    @PrimaryColumn()
    id: string;
    @Column()
    gas: number;
    @Column()
    amount: number;
    @Column()
    time: number;

    @ManyToOne(type => UserModel, user => user.account)
    @JoinColumn()
    from: UserModel;

    @ManyToOne(type => UserModel, user => user.account)
    @JoinColumn()
    to: UserModel;

    static async getTransaction(id:string){
        return await TransactionModel.findOne(id, { relations: ["from","to"] });
    }

    static async getTransactions(prt:number=0){
        let take=15;
        return await TransactionModel.find({ relations: ["from","to"], take:take, skip:prt*take,order:{time:"DESC"} });
    }

    static NormalizeValue(val:number){
        return val/Math.pow(10,18);
    }

    mine:boolean;
    p_opponent:string;
    p_time:string;
}
