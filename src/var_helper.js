"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var paths = {
    root: __dirname + '/../',
    src: __dirname,
    components: __dirname + '/components/',
    controllers: __dirname + '/../controllers/',
    models: __dirname + '/../models/',
    storage: __dirname + '/../storage/',
    db: __dirname + '/../storage/data.db',
};
var pug_options = {
    cache: true,
};
var chat_types = {
    user: 'user_chat',
    group: 'group_chat',
};
var chat_to_menu = {
    user: 'menu_user_chats',
    group: 'menu_chats',
};
var group_chat_types = {
    group: 'group',
    channel: 'channel',
};
// const menues
var events = {
    change_app_state: "change_app_state",
    change_menu_state: "change_menu_state",
    generate_mnemonic: "generate_mnemonic",
    submit_mnemonic: "submit_mnemonic",
    submit_profile: "submit_profile",
    online: "online",
    buddy: "buddy",
    send_subscribe: "send_subscribe",
    get_buddies: "get_buddies",
    send_message: "send_message",
    get_chat_msgs: "get_chat_msgs",
    subscribe: "subscribe",
    chat: "chat",
    find_groups: "find_groups",
    received_vcard: "received_vcard",
    get_my_vcard: "get_my_vcard",
};
exports.helper = {
    paths: paths,
    chat_types: chat_types,
    group_chat_types: group_chat_types,
    chat_to_menu: chat_to_menu,
    events: events,
    pug_options: pug_options
};
//# sourceMappingURL=var_helper.js.map