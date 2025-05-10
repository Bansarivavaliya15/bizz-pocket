export function uploadDocument(req, files): string[] {
    const baseURL = process.env.BASE_URL || req.protocol + '://' + req.get('host');
    return files.map((file) => (baseURL + '/' + file.filename));
}