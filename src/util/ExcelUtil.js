import xlsx from 'xlsx';
import fs from 'fs';

export class ExcelUtil {
    // Function to read Excel file
    static readExcel(filePath) {
        const workbook = xlsx.readFile(filePath);
        const sheetNames = workbook.SheetNames;
        const data = {};

        sheetNames.forEach(sheetName => {
            const sheet = workbook.Sheets[sheetName];
            data[sheetName] = xlsx.utils.sheet_to_json(sheet);
        });

        return data;
    }

    // Function to write JSON data to Excel file
    static writeExcel(data, outputPath) {
        const workbook = xlsx.utils.book_new();

        // Iterate over each sheet in the data object
        for (const sheetName in data) {
            if (Object.hasOwnProperty.call(data, sheetName)) {
                const sheetData = data[sheetName];
                const worksheet = xlsx.utils.json_to_sheet(sheetData);
                xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
            }
        }

        // Write the workbook to a file
        xlsx.writeFile(workbook, outputPath);
    }
}
