import { Action } from "../common/Action.js";
import { FAIL, SUCCESS } from "../common/Constant.js";
import { FileUtils } from "../util/FileUtils.js";
export class Cleanup extends Action {
    constructor(name, input) {
        super(name, input);
    }

    async execute(context) {
        let response;
        try {
            const folder = this.input.folder;
            const skipFiles = this.input.skipFiles;
            FileUtils.deleteAllFilesAndFolders(folder, skipFiles);
            response = { "status": SUCCESS }
        }
        catch (error) {
            console.log('Error in Cleanup : ' + error);
            response = { "status": FAIL }
        }
        return response;
    }
}