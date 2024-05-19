const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // Parse the requested URL
    let pathname = url.parse(req.url).pathname;

    // Default to homepage if no specific page is requested
    if (pathname === '/') {
        pathname = '/homepage.html';
    }

    // Determine the file path based on the requested URL
    let filePath = '.' + pathname;

    // Check if the file exists with the given path
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // If the file doesn't exist, try with the .html extension
            const filePathWithHtmlExt = filePath + '.html';
            fs.access(filePathWithHtmlExt, fs.constants.F_OK, (err) => {
                if (err) {
                    // If the file still doesn't exist, send a 404 Not Found response
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end('404 Not Found');
                } else {
                    // If the file exists with the .html extension, serve it
                    serveFile(filePathWithHtmlExt, res);
                }
            });
        } else {
            // If the file exists, serve it
            serveFile(filePath, res);
        }
    });
});

function serveFile(filePath, res) {
    // Determine the content type based on the file extension
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        // Add other content types as needed
    }[extname] || 'application/octet-stream';

    // Read the file and send it as the response
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end('500 Internal Server Error');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
