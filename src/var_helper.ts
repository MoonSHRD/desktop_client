export const paths = {
    root: __dirname + '/../',
    src: __dirname,
    components: __dirname + '/components/',
    controllers: __dirname + '/../controllers/',
    models: __dirname + '/../models/',
    storage: __dirname + '/../storage/',
    db: __dirname + '/../storage/data.db',
};

export const pug_options = {
    cache: true,
};

export const files_config = {
    files_path: './downloads/',
};

export const chat_types = {
    user: 'user_chat',
    group: 'group_chat',
    // group_chat: 'group',
    // channel: 'channel',
};

export const chat_to_menu = {
    user: 'menu_user_chats',
    group: 'menu_chats',
    // channel: 'channel',
    // join_channel: 'join_channel',
    // join_group_chat: 'join_group_chat',
};

export const group_chat_types = {
    group: 'group',
    channel: 'channel',
    join_group: 'join_group',
    join_channel: 'join_channel',
};

export const event_types = {
    info:'info',
    primary:'primary',
    success:'success',
    error:'danger',
    warning:'warning',
};

// const menues

export const events = {
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
    reload_chat: "reload_chat",
    reading_messages: "reading_messages",
    change_directory: "change_directory",
};

export const helper = {
    paths,
    chat_types,
    group_chat_types,
    chat_to_menu,
    events,
    event_types,
    pug_options
};
