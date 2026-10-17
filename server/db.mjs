import {DatabaseSync} from 'node:sqlite';
import {mkdirSync, readdirSync, readFileSync, chmodSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
export function openDatabase(path){
 if(path!==':memory:')mkdirSync(dirname(resolve(path)),{recursive:true,mode:0o700});
 const db=new DatabaseSync(path);if(path!==':memory:')chmodSync(path,0o600);
 db.exec('PRAGMA busy_timeout=5000; PRAGMA foreign_keys=ON;');
 // WAL mode negotiation can report BUSY immediately during simultaneous first startup.
 const deadline=Date.now()+5000;for(;;){try{db.exec('PRAGMA journal_mode=WAL;');break;}catch(e){if(![5,6].includes(e.errcode)||Date.now()>=deadline){db.close();throw e;}Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,50);}}
 db.exec('CREATE TABLE IF NOT EXISTS schema_migrations(name TEXT PRIMARY KEY, applied_at TEXT NOT NULL)');
 const folder=fileURLToPath(new URL('./migrations/',import.meta.url));
 for(const file of readdirSync(folder).filter(f=>f.endsWith('.sql')).sort()){
  if(!db.prepare('SELECT 1 FROM schema_migrations WHERE name=?').get(file)){
   db.exec('BEGIN IMMEDIATE');try{if(!db.prepare('SELECT 1 FROM schema_migrations WHERE name=?').get(file)){db.exec(readFileSync(resolve(folder,file),'utf8'));db.prepare('INSERT INTO schema_migrations VALUES (?,?)').run(file,new Date().toISOString());}db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');throw e;}
  }
 }
 return db;
}
export function transaction(db,fn){db.exec('BEGIN IMMEDIATE');try{const result=fn();db.exec('COMMIT');return result;}catch(e){db.exec('ROLLBACK');throw e;}}
