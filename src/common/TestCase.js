import { Action } from "./Action.js";
import { ActionBuilder } from "./ActionBuilder.js";
import { FAIL } from "./Constant.js";
export class TestCase {
    constructor(testCaseData) {
        this.actions = [];
        for (const actionData of testCaseData) {
            if (actionData.SKIP) {
                console.log('SKIPPING Action: ' + actionData.ACTION);
                continue;
            }
            const action = ActionBuilder.createAction(actionData.ACTION, actionData.INPUT);
            if (action) {
                this.actions.push(action);
            }
        }
    }

    async execute(context) {
        context.actions = [];
        for (const action of this.actions) {
            context.actions.push(action);
            console.log('\n====> TestCase executing action: ' + action.name);
            if (action) {
                let actionResult = action.execute(context);
                if (actionResult instanceof Promise) {
                    actionResult = await actionResult;
                }
                action.actionResult = actionResult;
                action.postProcess(context);
                if (action.actionResult.status === FAIL) {
                    break;
                }
            }
        }
    }
}