const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const port = process.env.PORT || 3000;
const archiveDir = path.join(__dirname, 'neal_fun_archive');
const outputFile = path.join(archiveDir, 'neal-fun-stitched.wacz');

// 1. Force a clean, fresh stitch on every boot
if (fs.existsSync(outputFile)) {
    try { fs.unlinkSync(outputFile); } catch (e) {}
}

console.log("Stitching binary chunks synchronously...");
for (let i = 0; i < 18; i++) {
    const partName = `neal.part${i.toString().padStart(2, '0')}.bin`;
    const partPath = path.join(archiveDir, partName);
    if (fs.existsSync(partPath)) {
        const data = fs.readFileSync(partPath);
        fs.appendFileSync(outputFile, data);
    }
}
console.log("Stitching complete!");

// 2. Global Anti-Compression Headers
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Accept-Ranges", "bytes");
    res.header("Cache-Control", "no-transform"); 
    next();
});

// 3. THE MAGIC FIX: Serve the giant binary file explicitly, bypassing express.static!
app.get('/archive.wacz', (req, res) => {
    res.setHeader('Content-Type', 'application/octet-stream');
    res.sendFile(outputFile);
});

// 4. Intercept the cursed underscore URL
app.use((req, res, next) => {
    if (req.originalUrl.startsWith('/neal_fun_archive')) {
        return res.redirect(req.originalUrl.replace('/neal_fun_archive', '/play'));
    }
    next();
});

// 5. Serve the HTML and UI files on the clean "/play" URL
app.use('/play', express.static(archiveDir));

// 6. Serve your main website homepage
app.use('/', express.static(__dirname));

app.listen(port, () => console.log(`Server running smoothly on port ${port}`));