import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';

export class FileUtils {
    static async readDataFromFile(filePath) {
        try {
            const data = await fsPromises.readFile(filePath, 'utf-8');
            return data;
        } catch (error) {
            console.error('Error reading from file:', error);
        }
    }

    static async writeDataToFile(filePath, dataToWrite) {
        if (dataToWrite) {
            if (!(dataToWrite instanceof String)) {
                dataToWrite = JSON.stringify(dataToWrite);
            }
            const folderPath = path.dirname(filePath);
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
            }
            fs.writeFile(filePath, dataToWrite, {
                encoding: "utf8",
                flag: "w"
            }, (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                } else {
                    //console.log('File has been written successfully!');
                }
            });
        }
    }

    // Function to delete all files in a directory
    // Function to delete all files and folders in a directory recursively, except for specified files
    static deleteAllFilesAndFolders(directoryPath, skipFiles) {
        if (fs.existsSync(directoryPath)) {
            fs.readdirSync(directoryPath).forEach((file) => {
                const currentPath = path.join(directoryPath, file);
                const relativePath = path.relative(directoryPath, currentPath);

                // Check if the current file or directory should be skipped
                if (!skipFiles.includes(relativePath)) {
                    if (fs.lstatSync(currentPath).isDirectory()) {
                        // Recurse into subdirectory
                        this.deleteAllFilesAndFolders(currentPath, skipFiles);

                        // Check if the directory is empty before attempting to delete it
                        if (fs.existsSync(currentPath) && fs.readdirSync(currentPath).length === 0) {
                            fs.rmdirSync(currentPath);
                        }
                    } else {
                        // Remove the file
                        fs.unlinkSync(currentPath);
                    }
                }
            });
            //console.log(`Deleted all files and folders in: ${directoryPath} except for: ${skipFiles.join(', ')}`);
        } else {
            console.log(`Directory path not found: ${directoryPath}`);
        }
    }
}



