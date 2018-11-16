
import {createConnection, getConnection} from "typeorm";
import {ChatModel} from "../../models/ChatModel";
import {AccountModel} from "../../models/AccountModel";

let chat_id="0x100feeb554dadbfe5d97763145807dbe0a5d0e34_0x573d360a6e09e99c59fdc85df5896fa950390ddf";

(async ()=>{
    try {

        await createConnection({
            type: "sqlite",
            database: `${__dirname}/../../sqlite/data.db`,
            entities: [
                __dirname + '/../../models/' + "*.js"
            ],
            synchronize: true,
            logging: false
        });


        let self_info = this.self_info = (await AccountModel.find({relations: ["user"], where: {id: 1}, take: 1}))[0].user;
        let opp_id=ChatModel.get_chat_opponent_id(chat_id,self_info.id);
        let all=await getConnection()
            .createQueryRunner()
            .query(
                `select *, "${chat_id}" as chatId from 
                   ((select id,"message" as type, text, time, senderId, null as amount
                       from message_model msg
                       where msg.chatId == "${chat_id}"
                   UNION
                   select id,"transaction" as type, null as text, time, fromId as senderId, amount
                       from transaction_model tx
                       where tx.fromId="${opp_id}" or tx.toId="${opp_id}") msgs
                   left join (
                       select id as senderId,avatar from user_model
                   ) user on user.senderId=msgs.senderId)
                   order by msgs.time`
            );
        for (let i in all) {
            let obj=all[i];
            // console.log({
            //     type:obj.type,
            //     id:obj.id,
            // })
            console.log(obj)
        }

        console.log(`select *, "${chat_id}" as chatId from 
                   ((select id,"message" as type, text, time, senderId, null as amount
                       from message_model msg
                       where msg.chatId == "${chat_id}"
                   UNION
                   select id,"transaction" as type, null as text, time, fromId as senderId, amount
                       from transaction_model tx
                       where tx.fromId="${opp_id}" or tx.toId="${opp_id}") msgs
                   left join (
                       select id as senderId,avatar from user_model
                   ) user on user.senderId=msgs.senderId)
                   order by msgs.time`);
    } catch (e) {
        throw e;
    }
})();
