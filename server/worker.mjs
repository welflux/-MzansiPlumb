import {openDatabase} from './db.mjs';
import {automationTick,startAutomation} from './automation.mjs';
const db=openDatabase(process.env.DATABASE_PATH||'var/mzansiplumb.sqlite');
if(process.argv.includes('--once')){try{await automationTick(db);console.log('Automation pass completed; inspect persisted status for notification outcomes.');}finally{db.close();}}
else{const stop=startAutomation(db);console.log('MzansiPlumb durable automation worker started (30 second interval)');let stopping=false;for(const signal of ['SIGINT','SIGTERM'])process.on(signal,async()=>{if(stopping)return;stopping=true;await stop();db.close();process.exit(0);});setInterval(()=>{},3600000);}
