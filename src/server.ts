require('dotenv').config()
import { app } from './app';
import { preventStop } from './services/tick';
import { initWorker } from './services/worker';

app.listen(process.env.PORT || 8000, () => {  
    console.info(`[HTTP] => Server is running on port ${process.env.PORT || 8000}`);
    //initWorker();
    //preventStop();
});
