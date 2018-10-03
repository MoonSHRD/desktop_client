import {Controller} from "../Controller";
import {Loom} from "../../loom/loom";

export abstract class MainController extends Controller {
    protected loom=Loom.getInstance();
}
