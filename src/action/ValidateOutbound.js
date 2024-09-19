import { FileUtils } from "link-action-sandbox/src/utils/FileUtils.js";
import { Action } from "../common/Action.js";
import { JSONUtil } from "../util/JSONUtil.js";
import path from 'path';
import { JSONPath } from "jsonpath-plus";
import { ACTION, FAIL, SUCCESS } from "../common/Constant.js";
import { CommonUtils } from "../util/CommonUtils.js";

export class ValidateOutbound extends Action {
    constructor(name, input) {
        super(name, input);
    }

    execute(context) {
        const sheetName = this.input.sheetName;
        const ignoreTags = this.input.ignoreTags;
        const dataValidationConfig = context.testSuiteData[sheetName];
        const testCaseSheetName = context.testCaseSheetName;
        const testCase = context.testSuiteData[testCaseSheetName];
        let validationObj;
        validationObj = this.validateOutbound(context, dataValidationConfig);
        return validationObj;
    }

    async validateOutbound(context, dataValidationConfig) {
        const folderPath = path.resolve('./');
        let sourceFile, destFile;
        sourceFile = this.getSourceFile(context);
        destFile = this.getDestFile(context);
        const sourceData = await FileUtils.readDataFromFile(sourceFile);
        const destData = await FileUtils.readDataFromFile(destFile);
        const sourceFileObj = JSON.parse(sourceData);
        const destFileObj = JSON.parse(destData);
        let errorMessages = [];
        for (const validationConfig of dataValidationConfig) {
            const sourceJSONPath = validationConfig.SOURCE_JSON_PATH;
            const destJSONPath = validationConfig.DESTINATION_JSON_PATH;
            const sourceObj = JSONPath({ path: sourceJSONPath, json: sourceFileObj })[0];
            const destObj = JSONPath({ path: destJSONPath, json: destFileObj })[0];
            if (!destObj) {
                console.error('Destination object not found : ' + destJSONPath)
            }
            let isSame = CommonUtils.compareLiteralValues(sourceObj, destObj);
            if (!isSame) {
                validationConfig.STATUS = FAIL;
                validationConfig.FAILURE_REASON = JSON.stringify('Values are not same');
            }
            else {
                validationConfig.STATUS = SUCCESS;
            }
        }
        let response;
        if (errorMessages.length > 0) {
            response = { "status": FAIL, "compare": errorMessages };
        }
        else {
            response = { "status": SUCCESS, "compare": errorMessages };
        }
        return response;
    }

    getSourceFile(context) {
        const testCase = context.testSuiteData[context.testCaseSheetName];
        const executeLAOBAction = testCase.find(a => { return a.ACTION == ACTION.EXECUTE_LINK_ACTION_OUTBOUND });
        if (executeLAOBAction) {
            return JSON.parse(executeLAOBAction.INPUT).file;
        }
        else {
            console.error(ACTION.EXECUTE_LINK_ACTION_OUTBOUND + ' Action is not found in testcase');
        }
    }

    getDestFile(context) {
        const fetchOBAction = context.actions.find(a => { return a.name === ACTION.FETCH_OBJECT_OUTBOUND });
        const destFile = fetchOBAction.actionResult.path;
        if (destFile.length === 1) {
            return destFile[0];
        }
        else {
            console.error('While Validating Outbound, it is observed that multiple files were modified on ERP side. But expected only one file to be modified. Please re-execute the test.');
        }
    }
}