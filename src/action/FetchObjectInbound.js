import { Action } from "../common/Action.js";
import { HttpClient } from "link-action-sandbox/src/HTTPClient.js";
import { OAuth2 } from "link-action-sandbox/src/OAuth2.js";
import { Config } from "link-action-sandbox/src/Config.js";
import { FileUtils } from "link-action-sandbox/src/utils/fileUtils.js";
import { LinkActionMain } from "link-action-sandbox/src/LinkActionMain.js";
import { FAIL, SUCCESS } from "../common/Constant.js";

export class FetchObjectInbound extends Action {
    constructor(name, input) {
        super(name, input);
    }

    /**
     * 
     * @param {*} context 
     * @returns actionResult object
     */
    execute(context) {
        try {
            // read masterDataURIs
            const column = this.input.column;
            const dataVlidationSheet = context.testSuiteData[this.input.sheetName];
            let masterDataURIs = dataVlidationSheet.map(row => { return row[column] });
            masterDataURIs = [...new Set(masterDataURIs)];
            const ext = ".json";
            for (const uri of masterDataURIs) {
                // fetch data with uri
                const data = this.fetchData(context, uri);

                if (data) {
                    // store file in a folder
                    const fullPath = 'testData/FETCH_OBJECT_OUTPUT/' + uri + ext;
                    this.storeData(context, fullPath, data.body);
                }
                else {
                    const failureReason = 'Error in fetchData for URI : ' + uri;
                    return { status: "fail", failureReason: failureReason }
                }
            }
            return { "status": SUCCESS }
        }
        catch (error) {
            console.log(error);
            return { status: FAIL, failureReason: this.failureReason.concat(error.stack) }
        }
    }

    fetchData(context, uri) {
        try {
            const config = context.config;
            const header = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${context.oauth2.bearerToken}`
            };
            uri = config.url + '/' + uri;
            const data = context.httpClient.get(uri, header);
            return data;
        }
        catch (err) {
            console.log('Failed in FetchObject.fetchData: ' + err);
            throw err;
        }
    }

    storeData(context, path, data) {
        FileUtils.writeDataToFile(path, JSON.parse(data));
    }
}