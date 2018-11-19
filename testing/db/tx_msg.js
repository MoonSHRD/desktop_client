"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const ChatModel_1 = require("../../models/ChatModel");
const AccountModel_1 = require("../../models/AccountModel");
let chat_id = "0x100feeb554dadbfe5d97763145807dbe0a5d0e34_0x573d360a6e09e99c59fdc85df5896fa950390ddf";
(() => __awaiter(this, void 0, void 0, function* () {
    try {
        let connection = yield typeorm_1.createConnection({
            type: "sqlite",
            database: `${__dirname}/../../sqlite/data.db`,
            entities: [
                __dirname + '/../../models/' + "*.js"
            ],
            synchronize: true,
            logging: false
        });
        let self_info = this.self_info = (yield AccountModel_1.AccountModel.find({ relations: ["user"], where: { id: 1 }, take: 1 }))[0].user;
        let opp_id = ChatModel_1.ChatModel.get_chat_opponent_id(chat_id, self_info.id);
        let all = connection
            .createQueryRunner()
            .query(`select *, "${chat_id}" as chatId from 
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
        for (let i in all) {
            let obj = all[i];
            // console.log({
            //     type:obj.type,
            //     id:obj.id,
            // })
            console.log(obj);
        }
        // console.log(`select *, "${chat_id}" as chatId from
        //            ((select id,"message" as type, text, time, senderId, null as amount
        //                from message_model msg
        //                where msg.chatId == "${chat_id}"
        //            UNION
        //            select id,"transaction" as type, null as text, time, fromId as senderId, amount
        //                from transaction_model tx
        //                where tx.fromId="${opp_id}" or tx.toId="${opp_id}") msgs
        //            left join (
        //                select id as senderId,avatar from user_model
        //            ) user on user.senderId=msgs.senderId)
        //            order by msgs.time`);
    }
    catch (e) {
        throw e;
    }
}))();
//# sourceMappingURL=tx_msg.js.map