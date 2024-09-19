import js_beautify from 'js-beautify';
import figlet from 'figlet';
import minimist from "minimist";

export class CommonUtils {
    constructor() {

    }

    static stringify(object) {
        if (!(object instanceof String)) {
            return JSON.stringify(object);
        }
        return object;
    }

    static beautify(dataObj) {
        let dataJson;
        const options = { indent_size: 2, space_in_empty_paren: true };
        if (dataObj instanceof String) {

            dataJson = dataObj;
        }
        else {
            dataJson = JSON.stringify(dataObj);
        }

        return js_beautify(dataJson, options)
    }

    // Function to generate a banner with a message
    static generateBanner(message) {
        console.log(
            figlet.textSync(message, {
                horizontalLayout: "default",
                verticalLayout: "default",
                whitespaceBreak: true,
            })
        );
    }

    /**
     * 
     * @runtime_param la = linkaction relative or absolute path,
     * @runtime_param file = in case of inbound it is maxFile and in case of outbound it is payload for ERP, 
     * @runtime_param config = config relative or absolute path path
     */
    static readArgs() {
        const argv = minimist(process.argv.slice(2));
        if (argv.help || argv.h || !(argv.t)) {
            console.log(`
    Usage: node index.js [options]
    
    Options:
      --t         Specify the TestSuite file (required)
    `);
            process.exit(0);
        }
        return argv;
    }

    static compareLiteralValues(value1, value2) {
        return value1 === value2;
    }

    static cleanData(testSuiteData, dataValidSheetName) {
        const data_validation_config = testSuiteData[dataValidSheetName];
        const copy_of_data_validation_config = [...data_validation_config];
        let i = 0, j = 0;
        for (let i = 0; i < data_validation_config.length; i++, j++) {
            const condition = this.isBlankOrEmpty(data_validation_config[i]['SOURCE_FILE']) || this.isBlankOrEmpty(data_validation_config[i]['DESTINATION_FILE']) || this.isBlankOrEmpty(data_validation_config[i]['DESTINATION_JSON_PATH']);
            if (condition) {
                copy_of_data_validation_config.splice(j, 1);
                j--;
            }
        }
        testSuiteData[dataValidSheetName] = copy_of_data_validation_config;
    }

    static isBlankOrEmpty(str) {
        // Check if the string is null, undefined, empty, or contains only whitespace
        return !str || str.trim().length === 0;
    }
}