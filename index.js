import { ExcelUtil } from "./src/util/ExcelUtil.js";
import { TestCase } from "./src/common/TestCase.js"
import { Context } from "./src/common/Context.js";
import { CommonUtils } from "./src/util/CommonUtils.js";
import { logger } from "./src/util/Logger.js";


async function main() {
    CommonUtils.generateBanner("Link Action Test Tool");
    const argv = CommonUtils.readArgs();
    const { t } = argv;
    // read excel test suite -> actions
    //const testSuite = 'testData/NETSUITE_PURCHASEORDER_INBOUND_LINKACTION.xlsx';
    //const testSuite = 'testData/NETSUITE_PURCHASEORDER_OUTBOUND_LINKACTION.xlsx';
    const testSuite = t;
    const testSuiteData = ExcelUtil.readExcel(testSuite);

    //set context
    const context = getContext(testSuiteData);
    const testCaseSheetName = 'TestCase_1';
    const dataValidSheetName = 'data_validation_config';
    //context.setTestSuiteData(testSuiteData);
    context['testCaseSheetName'] = testCaseSheetName;

    resetStatus(testSuiteData, [testCaseSheetName, dataValidSheetName]);
    CommonUtils.cleanData(testSuiteData, dataValidSheetName);
    // execute test case <- actions
    const testCaseData1 = testSuiteData[testCaseSheetName];

    const testCase = new TestCase(testCaseData1);
    await testCase.execute(context);
    ExcelUtil.writeExcel(context.testSuiteData, testSuite);
}
function getContext(testSuiteData) {
    const context = new Context(testSuiteData);
    return context;
}

function resetStatus(testSuiteData, sheetNames) {
    for (const sheet of sheetNames) {
        const data = testSuiteData[sheet];
        for (const row of data) {
            row.STATUS = '';
            row.FAILURE_REASON = '';
        }
    }
}

main();