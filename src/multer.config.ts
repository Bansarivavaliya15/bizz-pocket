import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config();

export const multerOptions =
{
    limits: {
        fileSize: 100 * 1024 * 1024,
    },

    storage: diskStorage({
        destination: (req: any, file: any, cb: any) => {
            const dir = './uploads';
            if (!existsSync(dir)) {
                mkdirSync(dir);
            }
            cb(null, './uploads/');
        },
        filename: (req: any, file: any, cb: any) => {
            const parsedFile = path.parse(file.originalname)
            cb(null, `${parsedFile.name}_${Date.now()}${parsedFile.ext}`);
        },
    }),
}
