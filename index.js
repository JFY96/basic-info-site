const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const error404Page = fs.readFileSync('./404.html', (err, data) => {
	if (err) throw err;
	return data;
});

const getFileNameDetails = (pathname) => {
	let ext = path.extname(pathname);
	let fileName = pathname;
	let contentType = '';

	if (ext === '') {
		// default as html
		ext = '.html';
		fileName = `${fileName}.html`;
	}

	switch (ext) {
		case '.html':
			contentType = 'text/html';
			break;
		case '.css':
			contentType = 'text/css';
			break;
	}

	return { fileName, contentType };
};

const server = http.createServer((req, res) => {
	const urlObj = new URL(req.url, `${req.protocol}://${req.headers.host}/`);
	const pathname = urlObj.pathname === '/' ? './index.html' : `.${urlObj.pathname}`;
	const fileNameDetails = getFileNameDetails(pathname);

	res.setHeader('Content-Type', fileNameDetails.contentType);

	fs.readFile(fileNameDetails.fileName, (err, data) => {
		if (err) {
			res.writeHead(404, { 'Content-Type': 'text/html' });
			return res.end(error404Page);
		} else {
			return res.end(data);
		}
	});
});

server.listen(8080, () => {
	console.log('Server is running');
});