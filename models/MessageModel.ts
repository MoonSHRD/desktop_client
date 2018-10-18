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
import {FileModel} from "./FileModel";
// import {ChatModel} from "./ChatModel";

@Entity()
export class MessageModel extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    server_id: number=0;
    @Column()
    text: string = '';
    @Column()
    time: string = '';

    @ManyToOne(type => ChatModel, chat => chat.messages)
    @JoinColumn()
    chat: ChatModel;
    @ManyToOne(type => UserModel, user => user.messages)
    @JoinColumn()
    sender: UserModel;
    @OneToMany(type => FileModel, files => files.message)
    files: FileModel[];

    mine:boolean;
    sender_avatar:string;

    static async get_chat_messages_with_sender(chat_id:string):Promise<MessageModel[]>{
        return await MessageModel.find({relations:['sender'],where:{chat:chat_id}})
    }

    static async get_chat_messages_with_sender_chat_files(chat_id:string):Promise<MessageModel[]>{
        return await MessageModel.find({
            relations:['sender','chat','files'],
            where:{chat:chat_id},
            take:5,
            order: {
                id: "DESC"
            }
        });
    }
}
