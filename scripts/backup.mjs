import {DatabaseSync,backup} from 'node:sqlite';
import {randomBytes,createCipheriv} from 'node:crypto';
import {mkdtempSync,readFileSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
const key=Buffer.from(process.env.BACKUP_ENCRYPTION_KEY||'','base64');
if(key.length!==32)throw new Error('BACKUP_ENCRYPTION_KEY must be a base64 encoded 32-byte key, supplied securely');
if(!process.argv[2])throw new Error('Usage: node scripts/backup.mjs /secure/path/backup.mpbackup');
const dir=mkdtempSync(join(tmpdir(),'mzansiplumb-backup-'));let db;
try{db=new DatabaseSync(process.env.DATABASE_PATH||'var/mzansiplumb.sqlite',{readOnly:true});const file=join(dir,'snapshot.sqlite');await backup(db,file);db.close();db=null;const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',key,iv),encrypted=Buffer.concat([cipher.update(readFileSync(file)),cipher.final()]);writeFileSync(resolve(process.argv[2]),Buffer.concat([Buffer.from('MPBACK01'),iv,cipher.getAuthTag(),encrypted]),{flag:'wx',mode:0o600});console.log('Encrypted database and evidence backup created. Retain the encryption key separately.');}finally{db?.close();rmSync(dir,{recursive:true,force:true});}
