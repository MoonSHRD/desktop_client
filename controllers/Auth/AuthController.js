const Controller = require('../Controller');
class AuthController extends Controller {
    init_auth(){
        const html=this.render('auth/123.pug');
        console.log(this.events.change_app_state);
        this.send_data(this.events.change_app_state,html);
        console.log('initialised auth');
    };

    generate_mnemonic(){
        this.send_data(this.events.generate_mnemonic,this.eth.generate_mnemonic());
    };

    save_acc(data){
        console.log(data);
        let acc=this.get_model('AccountModel');
        let new_acc=new acc(data);
        acc.save();
        acc.get_one('1',(row)=>{
            console.log(row)
        });
    };
}
module.exports=AuthController;
