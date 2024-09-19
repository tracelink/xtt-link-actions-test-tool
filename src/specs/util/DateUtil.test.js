import { expect } from 'chai';
import { DateUtil } from '../../util/DateUtil.js';

describe('convertEpochTime', () => {
    it('should correctly convert epoch time to given date and time format', () => {
        // Test with a known epoch time and date format
        const epochTime = 1621830600000; // May 24, 2021, 10:00:00 AM UTC (example)
        const dateFormat = "yyyy-MM-dd hh:mm:SS a";

        const expectedOutput = '2021-05-23 09:30:00 PM'; // Expected formatted date and time
        const timezone = 'America/Los_Angeles';

        // Call the function and assert the output matches the expected value
        const actualOutput = DateUtil.convertEpochTime(epochTime, timezone, dateFormat);
        expect(actualOutput).to.equal(expectedOutput);
    });

    // You can add more tests here for different scenarios
});