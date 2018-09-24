import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn} from "typeorm";
import {UserModel} from "./UserModel";
import {ChatModel} from "./ChatModel";
// import {ChatModel} from "./ChatModel";

@Entity()
export class MessageModel extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: string;
    // @Column()
    // sender: string;
    // @Column()
    // chat: string = '';
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

    mine:boolean;
    sender_avatar:string;

    static async get_chat_messages_with_sender(chat_id:string):Promise<MessageModel[]>{
        return await MessageModel.find({relations:['sender'],where:{chat:chat_id}})
    }

    // @ManyToOne(type => ChatModel, chat => chat.users)
    // chat: UserModel;
}
