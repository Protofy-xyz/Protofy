import { requireAdmin, getServiceToken, getRoot } from 'protonode'
const pdfParse = require('pdf-parse');
import { addAction } from "@extensions/actions/coreContext/addAction";
import { addCard } from "@extensions/cards/coreContext/addCard";
import fs from 'fs/promises';
import fspath from 'path';

const token = getServiceToken();

export default async (app, context) => {
    app.get('/api/v1/pdf/getTotalPages', requireAdmin(), async (req, res) => {
        const { path } = req.query;
        if (!path) {
            return res.status(400).json({ error: 'File path is required' });
        }

        try {
            const dataBuffer = await fs.readFile(fspath.join(getRoot(), path));
            if (!dataBuffer) {
                return res.status(404).json({ error: 'File not found' });
            }
            // Parse the PDF file to get the number of pages
            const data = await pdfParse(dataBuffer);
            return res.json(data.numpages);
        } catch (error) {
            console.error('Error reading PDF:', error);
            return res.status(500).json({ error: 'Failed to read PDF file' });
        }
    });

    addAction({
        group: 'pdf',
        name: 'getTotalPages',
        url: "/api/v1/pdf/getTotalPages",
        tag: 'operations',
        description: "Get total pages of a PDF file",
        params: {
            path: "pdf file path"
        },
        emitEvent: true,
        token: token
    })

    addCard({
        group: 'pdf',
        tag: 'operations',
        id: 'pdf_get_total_pages',
        templateName: 'Get total pages of a PDF file',
        name: 'pdf_get_total_pages',
        defaults: {
            width: 2,
            height: 8,
            type: "action",
            icon: 'file-stack',
            name: 'pdf pages',
            description: 'Get the total number of pages in a PDF file.',
            params: {
                path: "pdf file path"
            },
            rulesCode: `return await execute_action("/api/v1/pdf/getTotalPages", userParams)`,
            displayResponse: true
        },
        emitEvent: true,
        token: token
    })
}