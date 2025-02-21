export class Spreadsheet {
    constructor(private sheetID: string, private tabname: string, private range: string, private apiKey: string) {}
  
    public async getData(): Promise<any> {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetID}/values/${this.tabname}!${this.range}?key=${this.apiKey}&majorDimension=COLUMNS`;
      const response = await fetch(url);
      const data = await response.json();
      return data.values;
    }
  }