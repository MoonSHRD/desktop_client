const paths = {
    root:__dirname+'/../',
    src:__dirname,
    components:__dirname+'/components/',
    controllers:__dirname+'/../controllers/',
    models:__dirname+'/../models/',
    storage:__dirname+'/../storage/',
    db:__dirname+'/../storage/data.db',
};

const pug_options = {
    cache: true,
};

const chat_types = {
    user: 'user_chat',
    group_chat: 'group_chat',
    channel: 'channel',
    join_channel: 'join_channel',
    join_group_chat: 'join_group_chat',
};

const events = {
    change_app_state:"change_app_state",
    generate_mnemonic:"generate_mnemonic",
    submit_mnemonic:"submit_mnemonic",
    submit_profile:"submit_profile",
    online:"online",
    buddy:"buddy",
    send_subscribe:"send_subscribe",
    get_buddies:"get_buddies",
    send_message:"send_message",
    get_chat_msgs:"get_chat_msgs",
    subscribe:"subscribe",
    chat:"chat",
    find_groups:"find_groups",
    received_vcard:"received_vcard",
    get_my_vcard:"get_my_vcard",
};

module.exports = {
    paths,
    chat_types,
    events,
    pug_options
};
