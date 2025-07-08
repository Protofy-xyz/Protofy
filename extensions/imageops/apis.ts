import { addAction } from "@extensions/actions/coreContext/addAction";
import { addCard } from "@extensions/cards/coreContext/addCard";
import { getLogger, getServiceToken } from 'protobase';
import { handler } from 'protonode'
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const BASE_DIR = path.resolve(__dirname, '../../');


// Convierte una ruta virtual tipo /lol/x.jpg en una ruta absoluta segura
function resolveSafePath(virtualPath: string): string | null {
    if (!virtualPath.startsWith('/')) return null; // solo aceptamos rutas tipo "/algo"

    const normalized = path.normalize('.' + virtualPath); // evita duplicados, ../, etc
    const resolved = path.resolve(BASE_DIR, normalized);

    // Verifica que resolved está dentro de BASE_DIR
    if (!resolved.startsWith(BASE_DIR)) return null;

    return resolved;
}

export default (app, context) => {
    const registerActions = async (context) => {
        addAction({
            group: 'imageops',
            name: 'crop',
            url: `/api/v1/imageops/crop`,
            tag: "transform",
            description: "crop an image",
            params: { image: "path to the image", x: "x coordinate", y: "y coordinate", width: "width", height: "height", saveTo: "path to save the cropped image" },
            emitEvent: true,
            token: await getServiceToken()
        })
    }

    const registerCards = async (context) => {
        addCard({
            group: 'imageops',
            tag: "transform",
            id: 'imageops_crop',
            templateName: "crop image",
            name: "crop",
            defaults: {
                name: "crop_image",
                icon: "crop",
                color: "#FFC300",
                description: "crop an image",
                rulesCode: `return execute_action("/api/v1/imageops/crop", userParams);`,
                params: {
                    image: "path to the image",
                    x: "x coordinate",
                    y: "y coordinate",
                    width: "width",
                    height: "height",
                    saveTo: "path to save the cropped image"
                },
                type: 'action'
            },
            emitEvent: true,
            token: await getServiceToken()
        })
    }

    app.get("/api/v1/imageops/crop", handler(async (req, res, session) => {
        if (!session || !session.user?.admin) {
            res.status(401).send({ error: "Unauthorized" });
            return;
        }

        let { image, x, y, width, height, saveTo } = req.query as any;
        x = parseFloat(x); y = parseFloat(y);
        width = parseFloat(width); height = parseFloat(height);

        if (!image || !saveTo || [x, y, width, height].some(v => isNaN(v) || v < 0 || v > 1)) {
            res.status(400).send({ error: "Missing or invalid parameters" });
            return;
        }

        const inputPath = resolveSafePath(image);
        const outputPath = resolveSafePath(saveTo);
        if (!inputPath || !outputPath) {
            res.status(400).send({ error: "Invalid paths" });
            return;
        }

        try {
            const metadata = await sharp(inputPath).metadata();
            const cropX = Math.round(x * (metadata.width || 1));
            const cropY = Math.round(y * (metadata.height || 1));
            const cropW = Math.round(width * (metadata.width || 1));
            const cropH = Math.round(height * (metadata.height || 1));

            await fs.mkdir(path.dirname(outputPath), { recursive: true });
            await sharp(inputPath)
                .extract({ left: cropX, top: cropY, width: cropW, height: cropH })
                .toFile(outputPath);

            res.send(saveTo);
        } catch (err) {
            console.error("Sharp crop error:", err);
            res.status(500).send({ error: "Image processing failed" });
        }
    }));

    registerActions(context);
    registerCards(context);

}

