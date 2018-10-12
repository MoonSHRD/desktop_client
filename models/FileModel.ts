import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    ManyToOne,
    JoinColumn,
    ManyToMany,
    OneToMany
} from "typeorm";
import {UserModel} from "./UserModel";
import {ChatModel} from "./ChatModel";
import {MessageModel} from "./MessageModel";
// import {ChatModel} from "./ChatModel";

@Entity()
export class FileModel extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    hash: string;
    @Column()
    type: string;
    @Column()
    name: string;

    @ManyToOne(type => MessageModel, message => message.files)
    message: MessageModel;

    @ManyToOne(type => ChatModel, chat => chat.files)
    chat: ChatModel;

    file:any=null;
    preview:boolean=false;
}
