import {
    Entity,
    PrimaryColumn,
    Column,
    BaseEntity,
    OneToMany,
    ManyToMany,
    JoinTable,
    OneToOne,
    JoinColumn
} from "typeorm";
import {ChatModel} from "./ChatModel";
import {AccountModel} from "./AccountModel";
import {MessageModel} from "./MessageModel";

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
    online: boolean = false;
    @Column()
    self: boolean = false;

    type: string;
    state: string;

    // @OneToOne(type => AccountModel, account => account.user)
    // @JoinColumn()
    // account: AccountModel;

    // @OneToOne(type => ChatModel, user_chat => user_chat.id)
    // @JoinColumn()
    // user_chat: ChatModel;

    @OneToMany(type => MessageModel, message => message.chat)
    messages: MessageModel[];


    @ManyToMany(type => ChatModel)
    @JoinTable()
    chats: ChatModel[];
}
