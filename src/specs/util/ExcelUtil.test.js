import { ExcelUtil } from '../../util/ExcelUtil.js'; // Assuming the functions are in excelUtils.js
import fs from 'fs';
import { expect } from 'chai';
import xlsx from 'xlsx';

describe('ExcelUtil', () => {
  describe('testData/readExcel', () => {
    it('should read Excel file and return data object', () => {
      const filePath = 'test.xlsx';
      const testData = [
        { Name: 'John', Age: 30 },
        { Name: 'Alice', Age: 25 }
      ];

      // Create a test Excel file
      const workbook = xlsx.utils.book_new();
      const worksheet = xlsx.utils.json_to_sheet(testData);
      xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      xlsx.writeFile(workbook, filePath);

      // Test the readExcel method
      const data = ExcelUtil.readExcel(filePath);
      expect(data).to.deep.equal({ Sheet1: testData });

      // Delete the test Excel file
      fs.unlinkSync(filePath);
    });
  });

  describe('writeExcel', () => {
    it('should write data to Excel file', () => {
      const outputPath = 'testData/output.xlsx';
      const testData = {
        "Sheet1": [
          { Name: 'John', Age: 30 },
          { Name: 'Alice', Age: 25 }
        ],
        "Sheet2": [
          { Name: 'Dave', Age: 50 },
          { Name: 'Bob', Age: 20 }
        ]
      };

      // Test the writeExcel method
      ExcelUtil.writeExcel(testData, outputPath);

      // Read the written Excel file
      const data = ExcelUtil.readExcel(outputPath);
      expect(data).to.deep.equal(testData);
      fs.unlinkSync(outputPath);
    });
  });
});