import { Action } from "../common/Action.js";
import { HttpClient } from "link-action-sandbox/src/HTTPClient.js";
import { Config } from "link-action-sandbox/src/Config.js";
import { FileUtils } from "link-action-sandbox/src/utils/fileUtils.js";
import { LinkActionMain } from "link-action-sandbox/src/LinkActionMain.js";
import { DateUtil } from "../util/DateUtil.js";
import { ACTION, FAIL, SUCCESS } from "../common/Constant.js";
import { JSONPath } from "jsonpath-plus";

export class FetchObjectOutbound extends Action {
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
            const uris = this.getURIs(context);
            const ext = ".json";
            const fullPaths = [];

            uris.forEach(uri => {
                // fetch data with uri
                const data = this.fetchData(context, uri);

                // store file in a folder
                const fullPath = 'testData/FETCH_OBJECT_OUTPUT' + uri + ext;
                fullPaths.push(fullPath);
                this.storeData(context, fullPath, data);
            });
            return { "status": SUCCESS, "path": fullPaths }
        }
        catch (error) {
            return { status: FAIL, failureReason: this.failureReason.concat(error) }
        }
    }

    fetchData(context, uri) {
        try {
            const config = context.config;
            const expandObjects = this.input.expandObjects;
            const header = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${context.oauth2.bearerToken}`
            };
            uri = config.url + uri;
            let data = context.httpClient.get(uri, header);
            const body = JSON.parse(data.body);

            data = this.fetchSubResources(expandObjects, context.httpClient, body, header)
            return data;
        }
        catch (err) {
            console.log('Failed in FetchObject.fetchData: ' + err);
            throw err;
        }
    }

    storeData(context, path, data) {
        FileUtils.writeDataToFile(path, data);
    }

    getURIs(context) {
        const uris = [];
        const config = context.config;
        const timezone = this.input.timezone;
        let queryURL = this.input.queryURL;
        const header = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${context.oauth2.bearerToken}`
        };
        // get epoch time
        //const epochTime = context.executionStartTime;
        const epochTime = this.getLinkActionExecutionStartTime(context);
        //const epochTime = 1716811893000;
        //convert epoch to correct dateTimeFormat
        const dateFormat = this.input.dateTimeFormat;
        const dateTime = DateUtil.convertEpochTime(epochTime, timezone, dateFormat);

        // replace dateTime in queryURL
        queryURL = config.url + queryURL.replace("$dateTime", dateTime);
        const data = context.httpClient.get(queryURL, header);
        // add uri in uris array
        if (data) {
            const body = JSON.parse(data.body);
            const uris = body.items.map(i => { return '/' + this.input.recordType + '/' + i.id });
            return uris;
        }

    }

    fetchSubResources(expandObjects, httpClient, object, header) {
        try {

            // fetch subResources by expanding expandObjects recursively and update json
            // replace obj with expanded object
            const updater = (cb) => (value, _, { parent, parentProperty }) => {
                return parent[parentProperty] = cb(value);
            }
            expandObjects.sort();

            for (let jsonPath of expandObjects) {
                let combinedResponse = {};
                const subResourceLinkObj = JSONPath({ path: jsonPath, json: object });
                const isArray = subResourceLinkObj[0] instanceof Array;
                const uris = getURI(subResourceLinkObj);
                if (!isArray) {
                    if (uris) {
                        const uri = uris[0];
                        const response = httpClient.get(uri, header);
                        combinedResponse = JSON.parse(response.body);
                    }

                }
                else {
                    combinedResponse = [];
                    if (uris) {
                        uris.forEach(uri => {
                            const response = httpClient.get(uri, header);
                            const subResponse = JSON.parse(response.body);
                            combinedResponse.push(subResponse);
                        });
                    }
                }
                JSONPath({
                    json: object,
                    path: jsonPath,
                    resultType: 'all',
                    callback: updater(value => combinedResponse),
                });
            }
            return object;
        } catch (error) {
            // Handle errors
            console.error('Error fetching subResource:', error);
            throw error;
        }

        function getURI(data) {
            const uris = findAllTags(data, 'href');
            return uris;
        }

        function findAllTags(obj, targetTag) {
            let results = [];

            function recursiveFind(obj) {
                if (typeof obj === 'object' && obj !== null) {
                    for (const key in obj) {
                        if (key === targetTag) {
                            results.push(obj[key]);
                        }
                        recursiveFind(obj[key]);
                    }
                } else if (Array.isArray(obj)) {
                    for (let i = 0; i < obj.length; i++) {
                        recursiveFind(obj[i]);
                    }
                }
            }

            recursiveFind(obj);
            return results.length > 0 ? results : undefined;
        }
    }



    getLinkActionExecutionStartTime(context) {
        const laAction = context.actions.find(a => { return a.name === ACTION.EXECUTE_LINK_ACTION_OUTBOUND });
        return laAction.executionStartTime;
    }
}