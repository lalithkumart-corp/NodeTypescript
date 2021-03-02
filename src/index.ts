import express from 'express';
const app = express();
import bodyParser from 'body-parser';

import CatRouter from './routes/cat';
import fileRouter from './routes/fileHandling';

const PORT = 1123;

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});

app.use(bodyParser.json());


app.get('/', (req, res) => res.send('Express + TypeScript Server example'));

app.use('/cat', CatRouter);

app.route('user/:username')
    .get((req,res)=>{
      res.send('Welcome to home ' + req.params.username)
    })
    .post((req,res)=>{
      res.send('data is sent and processed')
    })

app.use('/files', fileRouter);