import { Action } from "../common/Action.js";
import { DIRECTION, FAIL, SUCCESS } from "../common/Constant.js";
import { LinkActionMain } from "link-action-sandbox/src/LinkActionMain.js";

export class LinkActionExecuteInbound extends Action {
    constructor(name, input) {
        super(name, input);
        this.validateParams = ["linkAction", "file"];
    }

    async execute(context) {
        try {
            const direction = this.input.direction;
            const linkAction = this.input.linkAction;
            const file = this.input.file;
            const configFile = context.configFile;
            let response;
            response = await this.executeInbound(linkAction, file, configFile);
            if (response && response.success) {
                return { "status": SUCCESS };
            }
            else {
                return { status: FAIL, failureReason: response.errorString }
            }
        }
        catch (error) {
            console.error('Error occured in LinkActionExecute.execute ' + error);
            return { "status": "fail" };
        }

    }

    async executeInbound(linkAction, file, config) {
        return await LinkActionMain.testInboundLinkAction(linkAction, file, config)
    }

}