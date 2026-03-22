const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const port = process.env.PORT || 3000;
const archiveDir = path.join(__dirname, 'neal_fun_archive');
const outputFile = path.join(archiveDir, 'neal-fun-stitched.wacz');

// 1. THE NUKE: Forcefully delete any old/broken stitched files from previous runs
if (fs.existsSync(outputFile)) {
    console.log("Deleting old cached archive...");
    fs.unlinkSync(outputFile); 
}

// 2. Fresh, synchronous stitch
console.log("Stitching chunks together synchronously. Please wait...");
for (let i = 0; i < 18; i++) {
    const partName = `neal.part${i.toString().padStart(2, '0')}.bin`;
    const partPath = path.join(archiveDir, partName);
    if (fs.existsSync(partPath)) {
        const data = fs.readFileSync(partPath);
        fs.appendFileSync(outputFile, data);
    }
}
console.log("Stitching complete! File is locked and ready.");

// 3. Global Headers
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Accept-Ranges", "bytes");
    res.header("Cache-Control", "no-transform"); 
    next();
});

// 4. THE PATH FIX: Create an absolute, unbreakable URL just for the giant file
app.get('/archive.wacz', (req, res) => {
    res.setHeader('Content-Type', 'application/octet-stream');
    res.sendFile(outputFile); // Natively handles byte-ranges perfectly
});

// 5. Serve the main website and the subfolder
app.use('/', express.static(__dirname));

app.listen(port, () => console.log(`Server running smoothly on port ${port}`));