import {Entity, PrimaryColumn, Column, BaseEntity, ManyToOne} from "typeorm";
import {UserModel} from "./UserModel";
import {ChatModel} from "./ChatModel";

@Entity()
export class UserMessageModel extends BaseEntity {

    @PrimaryColumn()
    id: string;
    // @Column()
    // sender: string;
    // @Column()
    // chat: string = '';
    @Column()
    text: string = '';
    @Column()
    time: string = '';

    @ManyToOne(type => UserModel, user => user.messages)
    sender: UserModel;

    // @ManyToOne(type => ChatModel, chat => chat.users)
    // chat: UserModel;
}
