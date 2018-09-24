
const Controllers={
    AuthController:require(__dirname+'/Auth/AuthController'),
    ChatsController:require(__dirname+'/Main/ChatsController'),
    MessagesController:require(__dirname+'/Main/MessagesController'),
    MenuController:require(__dirname+'/Main/MenuController'),
};

module.exports = Controllers;
