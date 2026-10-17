import {createApplication} from './app.mjs';
import {startAutomation} from './automation.mjs';
const {app,db}=createApplication({serveStatic:process.env.NODE_ENV==='production'});
const port=Number(process.env.PORT||3001);
const server=app.listen(port,process.env.HOST||'127.0.0.1',()=>console.log(`MzansiPlumb API listening on port ${port}`));
const stopWorker=process.env.AUTOMATION_ENABLED==='false'?async()=>{}:startAutomation(db);
let stopping=false;async function stop(){if(stopping)return;stopping=true;await stopWorker();server.close(()=>{db.close();process.exit(0);});}
process.on('SIGTERM',stop);process.on('SIGINT',stop);
