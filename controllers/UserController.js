const UserModel=require('../models/UserModel');

function UserController() {
    this.get_messages=(id)=>{
        console.log("in controller");
        console.log(UserModel.get_messages(id));
        return UserModel.get_messages(id)
    };

    this.get_profile=(id)=>{
        return UserModel.get_profile(id)
    };


    this.find_one = (address)=>{
        return UserModel.find_one(address)
    };


}

module.exports=new UserController();
