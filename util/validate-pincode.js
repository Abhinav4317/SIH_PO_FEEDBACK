//to validate pincode
import fs from "fs";
import path from "path";
import csvParser from "csv-parser";
import { fileURLToPath } from "url";
export const isValidPostalID = async (postalID) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const csvFilePath = path.resolve(__dirname, "../all_india_pin_code.csv");
  return new Promise((resolve, reject) => {
    let isValid = false;
    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on("data", (row) => {
        if (row.pincode && row.pincode.trim() === postalID) {
          isValid = true;
        }
      })
      .on("end", () => {
        resolve(isValid);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
};
