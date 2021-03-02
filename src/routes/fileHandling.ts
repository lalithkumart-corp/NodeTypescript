import express from 'express';
let router = express.Router();
import fs from 'fs';
import { Readable, Writable, Transform } from 'stream';

router.get('/', (req, res) => {
    let rr = fs.readFileSync('myinfo.txt');
    res.send(rr);
});

router.get('/read-with-stream', (req, res) => {

    var readStream = fs.createReadStream('myinfo.txt'); // This line opens the file as a readable stream

    readStream.on('open', function () {
        readStream.pipe(res);  // This just pipes the read stream to the response object (which goes to the client)
    });
        
    readStream.on('error', function(err) {  // This catches any errors that happen while creating the readable stream (usually invalid names)
        res.end(err);
    });

});

router.post('/write', (req, res) => {
    let rr = fs.writeFileSync('myinfo.txt', req.body.text);
    res.send(rr);
});

//NOT: req.body: <should be plain string>
router.post('/write-stream', (req, res) => {

    var writeStream = fs.createWriteStream('myinfo.txt'); // This opens up the writeable stream to `output`

    req.pipe(writeStream); // This pipes the POST data to the file

    req.on('end', function () { // After all the data is saved, respond with a simple html form so they can post more data
        res.writeHead(200, {"content-type":"text/html"});
        res.end('<form method="POST"><input name="test" /><input type="submit"></form>');
    });

    writeStream.on('error', function (err) { // This is here incase any errors occur
        console.log(err);
    });
});

router.post('/write-stream2', (req, res) => {

    var writeStream = fs.createWriteStream('myinfo.txt'); // This opens up the writeable stream to `output`
    
    writeStream.write(req.body.text);
    writeStream.end();
    writeStream.on('error', function (err) { // This is here incase any errors occur
        console.log(err);
    });
    writeStream.on('finish', () => {
        res.writeHead(200, {"content-type":"text/html"});
        res.end('Done');
    });
});

router.post('/write-stream3', (req, res) => {

    var writeStream = fs.createWriteStream('myinfo.txt'); // This opens up the writeable stream to `output`
    
    writeStream.write(req.body.text);
    writeStream.end('final sentance');
    writeStream.on('error', function (err) { // This is here incase any errors occur
        console.log(err);
    });
    writeStream.on('finish', () => {
        res.writeHead(200, {"content-type":"text/html"});
        res.end('Done');
    });
});

router.post('/copy', (req, res) => {
    var readStream = fs.createReadStream('myinfo.txt');
    var writeStream = fs.createWriteStream('mycopy.txt');
    readStream.pipe(writeStream);

    // readStream.on('end', function () { // After all the data is saved, respond with a simple html form so they can post more data
    //     res.writeHead(200, {"content-type":"text/html"});
    //     res.end('Copied ');
    // });
    writeStream.on('finish', () => {
        res.writeHead(200, {"content-type":"text/html"});
        res.end('Copied from file 1 to file 2');
    });
    writeStream.on('error', function (err) { // This is here incase any errors occur
        console.log(err);
    });
});

router.post('/copy2', (req, res) => {
    var readStream = fs.createReadStream('myinfo.txt');
    var writeStream = fs.createWriteStream('mycopy.txt');
    readStream.pipe(writeStream);

    readStream.on('end', function () { // After all the data is saved, respond with a simple html form so they can post more data
        res.writeHead(200, {"content-type":"text/html"});
        res.end('Copied ');
    });
    // writeStream.on('finish', () => {
    //     res.writeHead(200, {"content-type":"text/html"});
    //     res.end('Copied from file 1 to file 2');
    // });
    writeStream.on('error', function (err) { // This is here incase any errors occur
        console.log(err);
    });
});

router.post('/someex1', (req, res) => {

    // const myReadStream = new Readable({
    //     read(size) {
    //         for(let i=0; i<5; i++) {
    //             console.log(i);
    //             this.push('some smsg');
    //         }
    //     }
    // });

    const myReadStream = fs.createReadStream('myinfo.txt', {encoding: 'utf8'});

    const myWritableStream = new Writable({
        write: (chunk, encoding, callback) => {
            console.log(chunk);
            callback();
        },
        decodeStrings: true,
        defaultEncoding: 'utf8'
    });

    myReadStream.pipe(myWritableStream)
        .on('finish', () => {
            console.log('FINISHED');
        })
});

export default router;