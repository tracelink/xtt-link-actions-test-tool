import { FileUtils } from "link-action-sandbox/src/utils/FileUtils.js";
import { Action } from "../common/Action.js";
import { Helper } from "link-action-sandbox/src/helper.js";
import { FAIL, SUCCESS } from "../common/Constant.js";
export class ModifyCursor extends Action {
    constructor(name, input) {
        super(name, input);
    }

    execute(context) {
        try {
            let cursor = Helper.readConfig('testData/cursor.json');
            cursor.fetchedTillTime = new Date().getTime();
            FileUtils.writeDataToFile('testData/cursor.json', cursor);
            return { "status": SUCCESS }
        }
        catch (error) {
            response = { "status": FAIL, failureReason: 'Check whether cursor.json file is present' };
        }
    }
}