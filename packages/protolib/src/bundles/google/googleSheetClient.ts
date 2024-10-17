import { google } from 'googleapis'

export class GoogleSheetClient {
    auth
    spreadsheetId
    idField
    objFields
    sheetName
    sheets
    constructor(credentials, spreadsheetId, sheetName, idField, objFields) {
        this.auth = new google.auth.GoogleAuth({
            credentials,
            scopes: [
                'https://www.googleapis.com/auth/spreadsheets'
            ]
        })
        this.spreadsheetId = spreadsheetId
        this.idField = idField
        this.objFields = objFields
        this.sheetName = sheetName

        this.sheets = google.sheets({ version: 'v4', auth: this.auth });
    }

    async sheetExists() {
        try {
            const response = await this.sheets.spreadsheets.get({
                spreadsheetId: this.spreadsheetId
            });

            const sheets = response.data.sheets;
            const sheet = sheets.find(sheet => sheet.properties.title === this.sheetName);

            return sheet !== undefined;
        } catch (error) {
            console.error('Error checking if sheet exists:', error);
            return false;
        }
    }

    async createSheet() {
        try {
            await this.sheets.spreadsheets.batchUpdate({
                spreadsheetId: this.spreadsheetId,
                requestBody: {
                    requests: [
                        {
                            addSheet: {
                                properties: {
                                    title: this.sheetName
                                }
                            }
                        }
                    ]
                }
            });
        } catch (error) {
            console.error('Error creating sheet:', error);
        }
    }

    async initialize() {
        if (!(await this.sheetExists())) {
            await this.createSheet();
            const range = this.sheetName + '!A1:Z1';
            try {
                const response = await this.sheets.spreadsheets.values.get({
                    spreadsheetId: this.spreadsheetId,
                    range
                });
                const rows = response.data.values;
                if (!rows || rows.length === 0) {
                    await this.sheets.spreadsheets.values.append({
                        spreadsheetId: this.spreadsheetId,
                        range: this.sheetName + '!A:Z',
                        valueInputOption: 'USER_ENTERED',
                        requestBody: {
                            values: [this.objFields]
                        }
                    });
                }
            } catch (error) {
                console.error('Error retrieving data from the sheet:', error);
            }
        }
    }

    async getAllSheet() {
        this.initialize()
        const range = this.sheetName + '!A:Z';
        return await this.sheets.spreadsheets.values.get({
            spreadsheetId: this.spreadsheetId,
            range
        });
    }

    async findSpreeadSheetElement(id) {
        try {
            const response = await this.getAllSheet();

            const allRows = response.data.values;
            if (allRows?.length) {
                const [header, ...rows] = allRows;
                console.log('Data retrieved from the sheet:', header.join(', '));
                const idPosition = header.indexOf(this.idField);
                for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
                    if (rows[rowIndex][idPosition] == id) {
                        const columnLetter = String.fromCharCode(65 + idPosition); // A=65, B=66, etc.
                        const cellAddress = `${columnLetter}${rowIndex + 2}`; // +2 because header is in row 1
                        return cellAddress;
                    }
                }
            } else {
                return
            }
        } catch (error) {
            console.error('Error retrieving data from the sheet:', error);
            return
        }
    }

    async getSpreadSheetElements() {
        try {
            const response = await this.getAllSheet();

            const allRows = response.data.values;
            if (allRows?.length) {
                const [header, ...rows] = allRows;
                console.log('Data retrieved from the sheet:', header.join(', '));
                return rows.reduce((acc, row) => {
                    const element = header.reduce((acc, key, i) => {
                        acc[key] = row[i];
                        return acc;
                    }, {});
                    acc.push(element);
                    return acc;
                }, []);
            } else {
                return []
            }
        } catch (error) {
            console.error('Error retrieving data')
            return []
        }
    }

    async deleteId(id) {
        const range = await this.findSpreeadSheetElement(id)
        if (range) {
            //delete entire row, without leaving a blank row
            //like the option 'delete row' on google sheets
            await this.sheets.spreadsheets.batchUpdate({
                spreadsheetId: this.spreadsheetId,
                requestBody: {
                    requests: [
                        {
                            deleteDimension: {
                                range: {
                                    sheetId: 0,
                                    dimension: 'ROWS',
                                    startIndex: parseInt(range.substring(1)) - 1,
                                    endIndex: parseInt(range.substring(1))
                                }
                            }
                        }
                    ]
                }
            });
        }
    }

    async get(key) {
        this.initialize()
        const elements = await this.getSpreadSheetElements()
        return JSON.stringify(elements.find(element => element[this.idField] == key));
    }

    async isSheetEmpty() {
        const range = `${this.sheetName}!A1:Z1`;

        try {
            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: this.spreadsheetId,
                range
            });

            const rows = response.data.values;
            if (!rows || rows.length === 0 || (rows.length === 1 && rows[0].length === 0)) {
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error retrieving data from the sheet:', error);
            return null;
        }
    };

    async put(key, value) {
        this.initialize()
        const range = await this.findSpreeadSheetElement(key)
        if (range) {
            const values = JSON.parse(value)
            const cols = [this.objFields.map(field => values[field])]

            await this.sheets.spreadsheets.values.update({
                spreadsheetId: this.spreadsheetId,
                range: this.sheetName + "!" + range,
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values: cols
                }
            });
        } else {
            //append
            const values = JSON.parse(value)
            const cols = [this.objFields.map(field => values[field])]

            if (await this.isSheetEmpty()) {
                //add header
                await this.sheets.spreadsheets.values.append({
                    spreadsheetId: this.spreadsheetId,
                    range: this.sheetName + "!A:Z",
                    valueInputOption: 'USER_ENTERED',
                    requestBody: {
                        values: [this.objFields]
                    }
                });
            }
            await this.sheets.spreadsheets.values.append({
                spreadsheetId: this.spreadsheetId,
                range: this.sheetName + "!A:Z",
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values: cols
                }
            });
        }
    }
}