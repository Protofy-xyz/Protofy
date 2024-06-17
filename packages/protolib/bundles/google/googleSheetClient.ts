import { google } from 'googleapis'

export class GoogleSheetClient {
    auth
    spreadsheetId
    idField
    objFields
    sheetName
    constructor(credentials, spreadsheetId, idField, objFields) {
        this.auth = new google.auth.GoogleAuth({
            credentials,
            scopes: [
                'https://www.googleapis.com/auth/spreadsheets'
            ]
        })
        this.spreadsheetId = spreadsheetId
        this.idField = idField
        this.objFields = objFields
        this.sheetName = 'Sheet1'
    }

    async getAllSheet() {
        const sheets = google.sheets({ version: 'v4', auth: this.auth });

        const range = this.sheetName + '!A:Z';
        return await sheets.spreadsheets.values.get({
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
            const sheets = google.sheets({ version: 'v4', auth: this.auth });
            //delete entire row, without leaving a blank row
            //like the option 'delete row' on google sheets
            await sheets.spreadsheets.batchUpdate({
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
        const elements = await this.getSpreadSheetElements()
        return JSON.stringify(elements.find(element => element[this.idField] == key));
    }

    async isSheetEmpty() {
        const sheets = google.sheets({ version: 'v4', auth: this.auth });
        const range = `${this.sheetName}!A1:Z1`;

        try {
            const response = await sheets.spreadsheets.values.get({
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
        const range = await this.findSpreeadSheetElement(key)
        if (range) {
            const values = JSON.parse(value)
            const cols = [this.objFields.map(field => values[field])]

            const sheets = google.sheets({ version: 'v4', auth: this.auth });
            await sheets.spreadsheets.values.update({
                spreadsheetId: this.spreadsheetId,
                range,
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values: cols
                }
            });
        } else {
            //append
            const sheets = google.sheets({ version: 'v4', auth: this.auth });
            const values = JSON.parse(value)
            const cols = [this.objFields.map(field => values[field])]

            if (await this.isSheetEmpty()) {
                //add header
                await sheets.spreadsheets.values.append({
                    spreadsheetId: this.spreadsheetId,
                    range: 'Sheet1!A:Z',
                    valueInputOption: 'USER_ENTERED',
                    requestBody: {
                        values: [this.objFields]
                    }
                });
            }
            await sheets.spreadsheets.values.append({
                spreadsheetId: this.spreadsheetId,
                range: 'Sheet1!A:Z',
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values: cols
                }
            });
        }
    }
}