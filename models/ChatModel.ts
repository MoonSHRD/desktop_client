import {Entity, PrimaryColumn, Column, BaseEntity, OneToMany, ManyToMany, JoinTable} from "typeorm";
// import {MessageModel} from "./MessageModel";
import {UserModel} from "./UserModel";

@Entity()
export class ChatModel extends BaseEntity {

    @PrimaryColumn()
    id: string;
    @Column()
    domain: string;
    @Column()
    name: string;
    @Column()
    bio: string = '';
    @Column()
    avatar: string = '';
    @Column()
    role: string = '';
    @Column()
    type: string = '';
    @Column()
    contract_address: string = '';

    // @OneToMany(type => MessageModel, message => message.chat)
    // messages: MessageModel[];
    //
    //
    // @ManyToMany(type => UserModel)
    // @JoinTable()
    // users: UserModel[];

    // get_users_chats(){
    //     ChatModel.find({where:{users:Between(1, 10)}})
    // }
}
