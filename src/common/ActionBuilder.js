import { ACTION } from "./Constant.js";
import { FetchObjectInbound } from "../action/FetchObjectInbound.js";
import { FetchObjectOutbound } from "../action/FetchObjectOutbound.js";
import { LinkActionExecuteInbound } from "../action/LinkActionExecuteInbound.js";
import { LinkActionExecuteOutbound } from "../action/LinkActionExecuteOutbound.js";
import { ModifyCursor } from "../action/ModifyCursor.js";
import { ValidateInbound } from "../action/ValidateInbound.js";
import { ValidateOutbound } from "../action/ValidateOutbound.js";
import { ModifyObject } from "../action/ModifyObject.js";
import { VerifyCursor } from "../action/VerifyCursor.js";
import { Cleanup } from "../action/Cleanup.js";
export class ActionBuilder {
    constructor() {

    }

    static createAction(action, input) {
        try {
            switch (action) {
                case ACTION.FETCH_OBJECT_INBOUND:
                    return new FetchObjectInbound(action, input);
                case ACTION.FETCH_OBJECT_OUTBOUND:
                    return new FetchObjectOutbound(action, input);
                case ACTION.MODIFY_CURSOR:
                    return new ModifyCursor(action, input);
                case ACTION.EXECUTE_LINK_ACTION_INBOUND:
                    return new LinkActionExecuteInbound(action, input);
                case ACTION.EXECUTE_LINK_ACTION_OUTBOUND:
                    return new LinkActionExecuteOutbound(action, input);
                case ACTION.VALIDATE_INBOUND:
                    return new ValidateInbound(action, input);
                case ACTION.VALIDATE_OUTBOUND:
                    return new ValidateOutbound(action, input);
                case ACTION.MODIFY_OBJECT:
                    return new ModifyObject(action, input);
                case ACTION.VERIFY_CURSOR:
                    return new VerifyCursor(action, input);
                case ACTION.CLEANUP:
                    return new Cleanup(action, input);
                default:
                    console.error('Action Not found : ' + action);
            }
        }
        catch (err) {
            console.error('Possible Cause: Check TestSuite Config for Invalid JSON');
            console.error('ActionBuilder - Failed while creating action: ' + action);
            throw new Error(err);
        }
    }
}