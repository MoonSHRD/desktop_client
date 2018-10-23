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
import {group_chat_types} from "../src/var_helper";
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
    time: number;

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
    sender_name:string;

    static async get_chat_messages_with_sender(chat_id:string):Promise<MessageModel[]>{
        return await MessageModel.find({relations:['sender'],where:{chat:chat_id}})
    }

    static async get_chat_messages_with_sender_chat_files(chat_id:string):Promise<MessageModel[]>{
        return await MessageModel.find({
            relations:['sender','chat','files'],
            where:{chat:chat_id},
            take:30,
            order: {
                id: "DESC"
            }
        });
    }

    fill_sender_data(){
        if (this.sender && (this.chat.type !== group_chat_types.channel || this.mine)) {
            this.sender_avatar=this.sender.avatar;
            this.sender_name=this.sender.name;
        } else {
            this.sender_avatar=this.chat.avatar;
            this.sender_name=this.chat.name;
        }
    }
}
