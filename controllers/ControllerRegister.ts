import * as Queue from 'better-queue';

const Controllers = {
    AuthController: require(__dirname + '/Auth/AuthController'),
    ChatsController: require(__dirname + '/Main/ChatsController'),
    MessagesController: require(__dirname + '/Main/MessagesController'),
    MenuController: require(__dirname + '/Main/MenuController'),
    EventsController: require(__dirname + '/Main/EventsController'),
};

export class ControllerRegister {
    private static instance: ControllerRegister;
    private Controllers: any = [];
    private queue: Queue;
    readonly window: any;

    private constructor(window) {
        this.window = window;

        this.queue = new Queue(async (fn, cb) => {
            try {
                await fn();
            } catch (e) {
                console.log(e);
            }
            cb();
        });
    }

    public static getInstance(window: any = null) {
        if (!ControllerRegister.instance) {
            if (!window)
                throw new Error('must pass window parameter');
            ControllerRegister.instance = new ControllerRegister(window);
        }
        return ControllerRegister.instance;
    }

    private get_controller(controller: string) {
        if (!this.Controllers[controller]) {
            this.Controllers[controller] = new Controllers[controller](this.window);
        }
        return this.Controllers[controller];
    }

    public async queue_controller(controller: string, func: string, ...args) {
        this.queue.push(async () => {
            return await this.get_controller(controller)[func](...args);
        });
    }

    public async run_controller(controller: string, func: string, ...args) {
        return await this.get_controller(controller)[func](...args);
    }

    public get_controller_parameter(controller: string, parameter: string) {
        if (!this.Controllers[controller]) {
            this.Controllers[controller] = new Controllers[controller](this.window);
        }
        return this.Controllers[controller][parameter];
    }
}
