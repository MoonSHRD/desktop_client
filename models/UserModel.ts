import {Entity, PrimaryColumn, Column, BaseEntity, OneToMany, ManyToMany, JoinTable} from "typeorm";
import {ChatModel} from "./ChatModel";
import {UserMessageModel} from "./UserMessageModel";

@Entity()
export class UserModel extends BaseEntity {

    @PrimaryColumn()
    id: string;
    @Column()
    domain: string;
    @Column()
    name: string = '';
    @Column()
    firstname: string = '';
    @Column()
    lastname: string = '';
    @Column()
    bio: string = '';
    @Column()
    avatar: string = '';
    @Column()
    online: boolean;

    type: string;

    @OneToMany(type => UserMessageModel, message => message.sender)
    messages: UserMessageModel[];


    // @ManyToMany(type => ChatModel)
    // @JoinTable()
    // chats: ChatModel[];
}
