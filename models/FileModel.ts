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
    @Column({ nullable: true })
    type: string;
    @Column()
    name: string;
    @Column()
    path: string;

    @ManyToOne(type => MessageModel, message => message.files)
    message: MessageModel;

    @ManyToOne(type => ChatModel, chat => chat.files)
    chat: ChatModel;

    messageId:string;
    file:any=null;
    preview:boolean=false;
    downloaded:boolean=false;
}
