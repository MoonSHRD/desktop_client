import {Entity, In, PrimaryColumn, Column, BaseEntity, OneToMany, ManyToMany, JoinTable} from "typeorm";
import {MessageModel} from "./MessageModel";
import {UserModel} from "./UserModel";
import {helper} from "../src/var_helper";
import {AccountModel} from "./AccountModel";
import {EventModel} from "./EventModel";
import {FileModel} from "./FileModel";

// helper

@Entity()
export class ChatModel extends BaseEntity {

    @PrimaryColumn()
    id: string;
    @Column()
    domain: string = '';
    @Column()
    name: string = '';
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

    @OneToMany(type => MessageModel, messages => messages.chat)
    messages: MessageModel[];

    @OneToMany(type => EventModel, events => events.chat)
    events: EventModel[];

    @ManyToMany(type => UserModel)
    @JoinTable()
    users: UserModel[];

    @OneToMany(type => FileModel, files => files.chat)
    files: FileModel[];

    active:boolean=false;
    online:boolean=false;

    static get_user_chat_id(self_id:string,user_id:string){
        let sort=[self_id,user_id];
        sort.sort();
        return sort.join('_');
    }

    static async get_user_chat(self_id:string,user_id:string){
        return await ChatModel.findOne(ChatModel.get_user_chat_id(self_id,user_id));
    }

    static async get_chat_with_events(chat_id:string){
        return (await ChatModel.find({relations:['events'], where:{id:chat_id}}))[0];
    }

    static async get_user_chat_with_messages(self_id:string,user_id:string){
        return (await ChatModel.find({ relations: ["messages"], where: {id:ChatModel.get_user_chat_id(self_id,user_id)}, take:1 }))[0];
    }

    static async get_user_chat_messages(self_id:string,user_id:string){
        return await ChatModel.get_chat_messages(ChatModel.get_user_chat_id(self_id,user_id));
    }

    static async get_chat_messages(chat_id:string){
        return (await ChatModel.find({ relations: ["messages"], where: {id:chat_id}, take:1 }))[0].messages;
    }

    static async get_chats_by_type(type:string){
        let chats:ChatModel[];
        switch (type) {
            case helper.chat_types.user:
                chats = await ChatModel.find({ where: {type:type}, take:20 });
                break;
            case helper.chat_types.group:
                chats = await ChatModel.find({ where: {type:In(Object.values(helper.group_chat_types))}, take:20 });
        }
        return chats;
    }

    static async get_chat_with_users(chat_id:string):Promise<ChatModel>{
        return (await ChatModel.find({where:{id:chat_id},relations:['users']}))[0]
    }

    static async get_chat_with_users_messages(chat_id:string):Promise<ChatModel>{
        return (await ChatModel.find({where:{id:chat_id},relations:['users','messages']}))[0]
    }

    static async get_chat_users(chat_id:string):Promise<UserModel[]>{
        return (await ChatModel.get_chat_with_users(chat_id)).users;
    }

    static async get_chat_opponent(chat_id:string):Promise<UserModel>{
        let opps = await ChatModel.get_chat_users(chat_id);
        let account_id = 1;
        let account = (await AccountModel.find({relations: ["user"], where: {id: account_id}, take: 1}))[0].user;
        return opps.find(x => x.id !== account.id);
    }

    async get_user_chat_meta():Promise<string>{
        let data:UserModel=(await ChatModel.get_chat_opponent(this.id));
        this.avatar=data.avatar;
        this.name=data.name;
        this.online=data.online;
        this.domain=data.domain;
        return data.id
    }
}
