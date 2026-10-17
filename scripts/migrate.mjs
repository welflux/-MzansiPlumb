import {openDatabase} from '../server/db.mjs';
const db=openDatabase(process.env.DATABASE_PATH||'var/mzansiplumb.sqlite');try{console.log('Migrations applied:',db.prepare('SELECT COUNT(*) count FROM schema_migrations').get().count);if(db.prepare('PRAGMA foreign_key_check').all().length)throw new Error('Foreign key validation failed');}finally{db.close();}
