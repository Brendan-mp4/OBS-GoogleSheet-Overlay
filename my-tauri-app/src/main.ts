// main.ts

import { OBS } from "./obs";
import { Spreadsheet } from "./sheet";
import preset from "./preset.json";

// Define an interface for input mappings as specified in your preset
interface InputMapping {
  name: string;
  type: "text" | "image";
  provider: string;
  data: string;
}

async function main() {
  // 1. Load configuration from preset.json
  const { obsSettings, sheetSettings, controllerSettings } = preset;

  // 2. Connect to OBS using settings from the preset
  const obs = new OBS(obsSettings.ipAddress, obsSettings.password);
  const connected = await obs.connect();
  if (!connected) {
    console.error("Failed to connect to OBS. Exiting.");
    return;
  }

  // 3. Instantiate the Spreadsheet class with your Google Sheet settings
  const spreadsheet = new Spreadsheet(
    sheetSettings.sheetID,
    sheetSettings.tabname,
    sheetSettings.range,
    sheetSettings.apiKey
  );

  // 4. Fetch data from Google Sheets and handle potential errors
  let sheetData: any[][];
  try {
    sheetData = await spreadsheet.getData();
    console.log("Google Sheet data fetched:", sheetData);
  } catch (err) {
    console.error("Error fetching sheet data:", err);
    return;
  }

  // 5. Helper function to extract a cell's value from the sheet data.
  // This function converts a cell reference like "A8" into the proper array indices.
  function getCellValue(cell: string): string {
    // Extract the column letters and row numbers from the cell reference (e.g., "A8")
    const colLetter = cell.match(/[A-Z]+/)?.[0] || "";
    const rowStr = cell.match(/\d+/)?.[0] || "1";
    // Convert the column letter to a zero-based index (A -> 0, B -> 1, etc.)
    const colIndex = colLetter.charCodeAt(0) - "A".charCodeAt(0);
    // Convert the row string to a zero-based index (subtracting 1)
    const rowIndex = parseInt(rowStr, 10) - 1;
    return sheetData[colIndex][rowIndex];
  }

  // 6. Loop through each input mapping defined in your preset and update OBS accordingly
  const inputMappings: InputMapping[] = controllerSettings.inputs as InputMapping[];
  for (const mapping of inputMappings) {
    const cellValue = getCellValue(mapping.data);
    console.log(
      `Updating OBS input "${mapping.name}" of type "${mapping.type}" with data from cell ${mapping.data}:`,
      cellValue
    );
    const updateSuccessful = await obs.updateInput(mapping.name, mapping.type, cellValue);
    if (!updateSuccessful) {
      console.error(`Failed to update input ${mapping.name}`);
    }
  }
}

// Execute the main function and catch any errors that occur during execution
main().catch(err => console.error("Error in main execution:", err));