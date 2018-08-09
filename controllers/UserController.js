const UserModel=require('../models/user');

function UserController() {
    this.get_messages=(id)=>{
        return UserModel.get_messages(id)
    };

    this.get_profile=(id)=>{

    };
}

module.exports=new UserController();
