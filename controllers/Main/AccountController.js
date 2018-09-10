//Включает в себя все действия, связанные непосредственно с аккаунтом (получение информации о себе, чатах и т.п.)
const AccountModel=require('../models/AccountModel');
const pug = require('pug');

function AccountController() {

    this.account_exists=()=>{
        return false
    };

    this.get_auth_html=()=>{
        return pug.renderFile(__dirname+'/../src/components/auth/mnem.pug');
    };

    this.get_profuile_html=()=>{
        return pug.renderFile(__dirname+'/../src/components/auth/profile.pug');
    };

    this.add_account=(obj)=>{

    };

    this.update_account=(obj)=>{

    };

    this.delete_account=(address)=>{

    };

    this.exit = (id)=>{
        return AccountModel.exit_programm(id)
    };

    this.get_contacts = (id)=>{
        return AccountModel.get_contacts(id)
    };

    this.get_groups = (id)=>{
        return AccountModel.get_groups(id)
    };

    this.get_own_profile = (my_id)=>{
        return AccountModel.get_own_profile(my_id)
    };


}

module.exports = new AccountController();
