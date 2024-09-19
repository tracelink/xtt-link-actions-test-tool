import { FAIL } from "./Constant.js";

export class Action {
    constructor(name, input) {
        this.name = name;
        if (input) {
            this.input = JSON.parse(input);
        }

    }

    execute(context) {

    }

    validate() {
        if (this.validateParams) {
            for (const param of this.validateParams) {
                if (!this.input[param]) {
                    console.error('Missing required configuration parameter: ' + param + ' In action : ' + this.name)
                    return false;
                }
            }
        }
        return true;
    }

    postProcess(context) {
        const configRow = context.testSuiteData[context.testCaseSheetName].find(a => a.ACTION === this.name);
        if (!this.actionResult) {
            this.actionResult = { status: FAIL }
        }
        configRow.STATUS = this.actionResult.status;
        configRow.FAILURE_REASON = this.actionResult.failureReason;
    }
}