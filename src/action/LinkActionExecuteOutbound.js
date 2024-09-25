import { Action } from "../common/Action.js";
import { LinkActionMain } from "link-action-sandbox/src/LinkActionMain.js";
import { FAIL, SUCCESS } from "../common/Constant.js";

export class LinkActionExecuteOutbound extends Action {
    constructor(name, input) {
        super(name, input);
        this.validateParams = ["linkAction", "file"];
    }

    async execute(context) {
        try {
            const linkAction = this.input.linkAction;
            const file = this.input.file;
            const configFile = context.configFile;
            let response;
            this.executionStartTime = new Date().getTime();
            response = await this.executeOutbound(linkAction, file, configFile);
            if (response && response.success) {
                return { "status": SUCCESS };
            }
            else {
                return { status: FAIL, failureReason: response.errorString }
            }
        }
        catch (error) {
            console.error('Error occured in LinkActionExecute.execute ' + error);
            return { "status": FAIL };
        }

    }
    async executeOutbound(linkAction, file, config) {
        return await LinkActionMain.testOutboundLinkAction(linkAction, file, config);
    }

}