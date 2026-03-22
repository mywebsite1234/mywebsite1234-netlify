const express = require('express');
const path = require('path');
const app = express();

const port = process.env.PORT || 3000;

// 1. THE FIREWALL OVERRIDE: Explicitly allow RAM files (blob: and data:)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Content-Security-Policy", "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; connect-src * 'unsafe-inline' 'unsafe-eval' data: blob:; worker-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; child-src * 'unsafe-inline' 'unsafe-eval' data: blob:; frame-src * 'unsafe-inline' 'unsafe-eval' data: blob:;");
    res.header("Cache-Control", "no-transform"); 
    next();
});

// 2. Intercept the cursed underscore URL just in case
app.use((req, res, next) => {
    if (req.originalUrl.startsWith('/neal_fun_archive')) {
        return res.redirect(req.originalUrl.replace('/neal_fun_archive', '/play'));
    }
    next();
});

// 3. Serve the 18 parts and web assets on the clean "/play" URL
app.use('/play', express.static(path.join(__dirname, 'neal_fun_archive')));

// 4. Serve your main website homepage
app.use('/', express.static(__dirname));

app.listen(port, () => console.log(`Server running smoothly on port ${port}`));