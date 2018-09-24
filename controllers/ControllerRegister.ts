const Controllers={
    AuthController:require(__dirname+'/Auth/AuthController'),
    ChatsController:require(__dirname+'/Main/ChatsController'),
    MessagesController:require(__dirname+'/Main/MessagesController'),
    MenuController:require(__dirname+'/Main/MenuController'),
};

export class ControllerRegister {
    private static instance: ControllerRegister;
    private Controllers:any=[];
    readonly window:any;

    private constructor(window) {
        this.window=window;
    }


    public static getInstance(window:any=null) {
        if (!ControllerRegister.instance) {
            if (!window)
                throw new Error('must pass window parameter');
            ControllerRegister.instance = new ControllerRegister(window);
        }
        return ControllerRegister.instance;
    }

    public async run_controller(controller:string,func:string,...args){
        if (!this.Controllers[controller]){
            this.Controllers[controller]=new Controllers[controller](this.window);
        }
        return await this.Controllers[controller][func](...args);
    }
}
