const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const port = process.env.PORT || 3000;
const archiveDir = path.join(__dirname, 'neal_fun_archive');
const outputFile = path.join(archiveDir, 'neal-fun-stitched.wacz');

// 1. Stitch the files on the server instantly on boot!
if (!fs.existsSync(outputFile)) {
    console.log("Stitching chunks together on the server...");
    const writeStream = fs.createWriteStream(outputFile);
    
    // Grabs all 18 parts (00 to 17)
    for (let i = 0; i < 18; i++) {
        const partName = `neal.part${i.toString().padStart(2, '0')}.bin`;
        const partPath = path.join(archiveDir, partName);
        if (fs.existsSync(partPath)) {
            const data = fs.readFileSync(partPath);
            writeStream.write(data);
            console.log(`Added ${partName}`);
        }
    }
    writeStream.end();
    console.log("Stitching complete! Ready to serve.");
}

// 2. Serve the website cleanly
app.use((req, res, next) => {
    // This strips away all strict CSP rules and allows Range requests!
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Accept-Ranges", "bytes");
    next();
});

app.use('/neal_fun_archive', express.static(archiveDir));
app.get('/', (req, res) => res.redirect('/neal_fun_archive/'));

app.listen(port, () => console.log(`Server running on port ${port}`));