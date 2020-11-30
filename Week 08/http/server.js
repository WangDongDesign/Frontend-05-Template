
const http = require('http');

http.createServer((request, response) => {
    let body = [];
    request.on('error', err => {
        console.error('request error: ', err);
    }).on('data', chunk => {
        // 这里push不能将chunk toString ，会报错
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        console.log('body: ', body);
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end('Hello World!!!');
    })
}).listen(3001);

console.log('server started');