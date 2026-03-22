const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const port = process.env.PORT || 3000;
const archiveDir = path.join(__dirname, 'neal_fun_archive');
const outputFile = path.join(archiveDir, 'neal-fun-stitched.wacz');

// 1. Force a clean, fresh stitch on every boot
if (fs.existsSync(outputFile)) {
    console.log("Cleaning old cache...");
    fs.unlinkSync(outputFile); 
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

// 3. THE FIX: Serve the game on a clean "/play" URL, prioritizing it ABOVE the root!
app.get('/play', (req, res) => res.redirect('/play/')); // Auto-adds the trailing slash
app.use('/play', express.static(archiveDir, {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.wacz')) {
            res.setHeader('Content-Type', 'application/octet-stream');
        }
    }
}));

// 4. Serve your main website homepage
app.use('/', express.static(__dirname));

app.listen(port, () => console.log(`Server running smoothly on port ${port}`));