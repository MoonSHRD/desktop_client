import {Entity, In, PrimaryColumn, Column, BaseEntity, OneToMany, ManyToMany, JoinTable, getConnection} from "typeorm";
import {MessageModel} from "./MessageModel";
import {UserModel} from "./UserModel";
import {chat_types, helper} from "../src/var_helper";
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
    @Column()
    unread_messages: number = 0;

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
    last_active:number=0;

    time:Date=null;
    text:string=null;
    senderId:string=null;

    static get_user_chat_id(self_id:string,user_id:string){
        let sort=[self_id,user_id];
        sort.sort();
        return sort.join('_');
    }

    static async get_user_chat(self_id:string,user_id:string){
        return await ChatModel.findOne(ChatModel.get_user_chat_id(self_id,user_id));
    }

    static async get_user_chat_raw(self_id:string,user_id:string){
        let chat_id=ChatModel.get_user_chat_id(self_id,user_id);
        return (await getConnection()
            .createQueryRunner()
            .query(
                `select * from 
                   ((select id,usr.domain as domain,usr.name as name,usr.avatar as avatar, usr.online as online, type, unread_messages
                   from chat_model ch
                       inner join (
                               select name, avatar, id user_id, online, domain
                               from user_model 
                               where user_model.id == "${user_id}"
                           ) usr 
                       on instr(ch.id,user_id) > 0
                       where ch.id == "${chat_id}") ch2
                   left join (
                           select time, text, chatId, senderId
                           from message_model msg
                           group by msg.chatId
                           order by msg.time
                       ) msg
                       on msg.chatId = ch2.id) ch3
                   order by ch3.time`
            ))[0];
    };

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

    static async get_chat_opponent(chat_id:string,self_id:string):Promise<UserModel>{
        let opp_id = await ChatModel.get_chat_opponent_id(chat_id,self_id);
        return await UserModel.findOne(opp_id);
        // let account_id = 1;
        // let account = (await AccountModel.find({relations: ["user"], where: {id: account_id}, take: 1}))[0].user;
    }

    static get_chat_opponent_id(chat_id:string,self_id:string):string{
        let opps = chat_id.split("_");
        if (opps[0]==self_id) {
            return opps[1];
        } else {
            return opps[0];
        }
    }

    async get_user_chat_meta(self_id:string):Promise<string>{
        let data:UserModel=(await ChatModel.get_chat_opponent(this.id,self_id));
        this.avatar=data.avatar;
        this.name=data.name;
        console.log("active",data.last_active);
        console.log("data",data);
        this.online=data.last_active>(Date.now()-1000*60*5);
        this.domain=data.domain;
        return data.id
    }

    static async get_chats_with_last_msgs(self_info){
        return (await getConnection()
            .createQueryRunner()
            .query(
                 `select * from 
                   ((select id,usr.domain as domain,usr.name as name,usr.avatar as avatar, usr.last_active as last_active, type, unread_messages
                   from chat_model ch
                       inner join (
                               select name, avatar, id user_id, last_active, domain
                               from user_model 
                           ) usr 
                       on (
                         (substr(ch.id,1,42)=user_id and user_id!="${self_info.id}") or
                         (substr(ch.id,44,42)=user_id and user_id!="${self_info.id}") or 
                         (substr(ch.id,1,42)="${self_info.id}" and substr(ch.id,44,42)="${self_info.id}" and user_id="${self_info.id}")
                       )
                       where ch.type == "${chat_types.user}"
                   UNION
                   select id,domain,name,avatar, 0 as last_active, type, unread_messages
                       from chat_model ch1
                       where ch1.type != "${chat_types.user}") ch2
                   left join (
                           select time, text, chatId, senderId
                           from message_model msg
                           group by msg.chatId
                           order by msg.time
                       ) msg
                       on msg.chatId = ch2.id) ch3
                   order by ch3.time`
            ));
    }
}
