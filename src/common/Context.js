import { CONFIG_SHEET_NAME, ERP_CONFIG } from "./Constant.js";
import { Config } from "link-action-sandbox/src/Config.js";
import { HttpClient } from "link-action-sandbox/src/HTTPClient.js";
import { LinkActionMain } from "link-action-sandbox/src/LinkActionMain.js";
export class Context {
    constructor(testSuiteData) {
        this.setTestSuiteData(testSuiteData);
        this.setERPConfig();
        this.setHTTPClient();
    }

    setTestSuiteData(testSuiteData) {
        this.testSuiteData = testSuiteData;
    }

    setERPConfig() {
        const configSheet = this.testSuiteData[CONFIG_SHEET_NAME];
        const erpConfigFile = configSheet.find(row => { return row.NAME === ERP_CONFIG }).VALUE;
        const config = new Config(erpConfigFile);
        this.config = config;
        this.configFile = erpConfigFile;
    }

    setHTTPClient() {
        const httpClient = new HttpClient();
        const oauth2 = LinkActionMain.getOAuth2(this.config, httpClient);
        oauth2.generateToken();
        this.httpClient = httpClient;
        this.oauth2 = oauth2;
    }


}