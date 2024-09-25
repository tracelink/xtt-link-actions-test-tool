import { Action } from "../common/Action.js";
import { Helper } from "link-action-sandbox/src/helper.js";
import { FAIL, SUCCESS } from "../common/Constant.js";
export class VerifyCursor extends Action {
    constructor(name, input) {
        super(name, input);
    }

    async execute(context) {
        let response;
        try {
            await this.sleep(1000);
            let cursor = Helper.readConfig('testData/cursor.json');
            let cursorOutput = Helper.readConfig('testData/EXECUTE_LINK_ACTION/cursor_output.json');
            if (cursor.fetchedTillTime !== cursorOutput.fetchedTillTime) {
                response = { "status": SUCCESS }
            }
            else {
                response = { "status": FAIL, failureReason: "cursor fetchedTillTime is same" }
            }
        }
        catch (error) {
            console.error(error);
            response = { "status": FAIL, failureReason: 'Check whether cursor.json/cursor_output.json file is present' };
        }
        return response;
    }

    sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }
}