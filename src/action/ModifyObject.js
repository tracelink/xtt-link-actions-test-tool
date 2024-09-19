import { NetsuiteOAuth2 } from "link-action-sandbox/src/NetsuiteOAuth2.js";
import { Action } from "../common/Action.js";
import { HttpClient } from "link-action-sandbox/src/HTTPClient.js";
import { OAuth2 } from "link-action-sandbox/src/OAuth2.js";
import { Config } from "link-action-sandbox/src/Config.js";
import { FileUtils } from "link-action-sandbox/src/utils/fileUtils.js";
import { LinkActionMain } from "link-action-sandbox/src/LinkActionMain.js";
import { FAIL, SUCCESS } from "../common/Constant.js";

export class ModifyObject extends Action {
    constructor(name, input) {
        super(name, input);
    }

    /**
     * 
     * @param {*} context 
     * @returns actionResult object
     */
    execute(context) {
        // read masterDataURIs
        try {
            this.modifyObject(context);
        }
        catch (error) {
            const failureReason = "Error in ModifyObject.execute" + error;
            console.error('Error in ModifyObject.execute' + error);
            return { "status": FAIL, failureReason: failureReason };
        }

        return { "status": SUCCESS }
    }

    async modifyObject(context) {
        try {
            const config = context.config;
            const header = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${context.oauth2.bearerToken}`
            };
            let uri = config.url + this.input.uri;
            const payloadFile = this.input.body;
            const payloadStr = await FileUtils.readDataFromFile(payloadFile)
            //const payload = JSON.parse(payloadStr);
            const data = context.httpClient.patch(uri, header, payloadStr);
            return data;
        }
        catch (err) {
            console.log('Failed in FetchObject.fetchData: ' + err);
            throw err;
        }
    }
}