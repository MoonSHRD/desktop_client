const db = require('electron-db');

class AccountModel {
    static exit_programm = (id)=>{
        console.log('Goodbye!');
        return true // если успешно вышел
    };

    static get_contacts = (id)=>{
        let list_contacts = [];
        return list_contacts
    };

    static get_own_profile = (id)=>{
        return {
            first_name: 'Вася',
            second_name: 'Пупкин',
            address: '0xertt54bw35y54by44w'
        }
    };

    static get_groups = (id)=>{
        let list_group = [];
        list_group[0] = {
            id: '1',
            name: 'first simple group'
        };
        list_group[1] = {
            id: '2',
            name: 'second simple group'
        };
        list_group[2] = {
            id: '3',
            name: 'third simple group'
        };
        return list_group;
    };
}

module.exports=AccountModel;