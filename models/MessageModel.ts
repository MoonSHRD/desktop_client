import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn} from "typeorm";
import {UserModel} from "./UserModel";
import {ChatModel} from "./ChatModel";
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
    @Column()
    with_file: boolean = false;

    @ManyToOne(type => ChatModel, chat => chat.messages)
    @JoinColumn()
    chat: ChatModel;
    @ManyToOne(type => UserModel, user => user.messages)
    @JoinColumn()
    sender: UserModel;

    mine:boolean;
    sender_avatar:string;

    file:any;

    static async get_chat_messages_with_sender(chat_id:string):Promise<MessageModel[]>{
        return await MessageModel.find({relations:['sender'],where:{chat:chat_id}})
    }

    static async get_chat_messages_with_sender_chat(chat_id:string):Promise<MessageModel[]>{
        return await MessageModel.find({relations:['sender','chat'],where:{chat:chat_id}})
    }
}
