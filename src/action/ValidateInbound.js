import { FileUtils } from "link-action-sandbox/src/utils/FileUtils.js";
import { Action } from "../common/Action.js";
import { JSONUtil } from "../util/JSONUtil.js";
import path from 'path';
import { JSONPath } from "jsonpath-plus";
import { FAIL, SUCCESS } from "../common/Constant.js";

export class ValidateInbound extends Action {
    constructor(name, input) {
        super(name, input);
    }

    execute(context) {
        const sheetName = this.input.sheetName;
        let validationObj;
        const dataValidationConfig = context.testSuiteData[sheetName];
        validationObj = this.validateInbound(context, dataValidationConfig);
        return validationObj;
    }

    async validateInbound(context, dataValidationConfig) {
        const folderPath = path.resolve('./');
        let sourceFile, destFile;
        let errorMessages = [];
        for (const validationConfig of dataValidationConfig) {
            sourceFile = folderPath + '/testData/FETCH_OBJECT_OUTPUT/' + validationConfig.SOURCE_FILE + '.json';
            destFile = folderPath + '/testData/EXECUTE_LINK_ACTION/' + validationConfig.DESTINATION_FILE;
            const destJSONPath = validationConfig.DESTINATION_JSON_PATH;
            const sourceData = await FileUtils.readDataFromFile(sourceFile);
            const destData = await FileUtils.readDataFromFile(destFile);
            const sourceObj = JSON.parse(sourceData);
            const destFileObj = JSON.parse(destData);
            const destObj = JSONPath({ path: destJSONPath, json: destFileObj })[0];
            let validationObj = JSONUtil.compare(sourceObj, destObj);
            if (validationObj.unmatched && Object.keys(validationObj.unmatched).length !== 0) {
                errorMessages.push(validationObj);
                validationConfig.STATUS = FAIL;
                validationConfig.FAILURE_REASON = JSON.stringify(validationObj.unmatched);
            }
            else {
                validationConfig.STATUS = SUCCESS;
            }
        }

        let response;
        if (errorMessages.length > 0) {
            response = { "status": FAIL, failureReason: errorMessages };
        }
        else {
            response = { "status": SUCCESS };
        }
        return response;
    }
}