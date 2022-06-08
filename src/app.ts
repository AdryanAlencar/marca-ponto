import express, { Router } from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app = express();
const router = Router();

router.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use(cors());
app.use(morgan('common'));
app.use(router);


export { app };