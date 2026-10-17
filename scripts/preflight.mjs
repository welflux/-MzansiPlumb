import {existsSync,statSync,realpathSync,readdirSync,statfsSync} from 'node:fs';
import {resolve,dirname,isAbsolute,sep} from 'node:path';
import {DatabaseSync} from 'node:sqlite';
import {authMailReady,authMailRuntime} from '../server/auth-recovery.mjs';
import {billingRuntime,billingReady} from '../server/payments.mjs';
let failures=0;
function check(label,ok){console.log(`${ok?'PASS':'BLOCKED'} ${label}`);if(!ok)failures++;}
check('Node 24.x',process.versions.node.split('.')[0]==='24');
check('NODE_ENV=production',process.env.NODE_ENV==='production');
let origin;try{origin=new URL(process.env.APP_ORIGIN);}catch{/* Invalid/missing origins are reported below without printing environment values. */}
check('Exact HTTPS APP_ORIGIN without credentials/path/query/hash',!!origin&&origin.protocol==='https:'&&!origin.username&&!origin.password&&origin.pathname==='/'&&!origin.search&&!origin.hash&&process.env.APP_ORIGIN===origin.origin);
const database=process.env.DATABASE_PATH||'';check('Absolute private database path',isAbsolute(database)&&!database.startsWith('/tmp/')&&database!==':memory:');
const dbfile=resolve(database||'var/mzansiplumb.sqlite');
let db;
try{const actual=realpathSync(dbfile),privatePath=!['dist','public','public_html'].some(name=>actual.split(sep).includes(name));check('Database outside public web roots',privatePath);check('Database permission is owner-only',!(statSync(actual).mode&0o077));check('Data directory permission is owner-only',!(statSync(dirname(actual)).mode&0o077));const fs=statfsSync(dirname(actual));check('At least 1 GiB free storage headroom',fs.bavail*fs.bsize>=1024**3);db=new DatabaseSync(actual,{readOnly:true});check('SQLite integrity and foreign keys',db.prepare('PRAGMA integrity_check').get().integrity_check==='ok'&&db.prepare('PRAGMA foreign_key_check').all().length===0);const applied=new Set(db.prepare('SELECT name FROM schema_migrations').all().map(r=>r.name));check('All release migrations applied',readdirSync('server/migrations').filter(f=>f.endsWith('.sql')).every(f=>applied.has(f)));check('No imported browser test database',!actual.includes('browser-tests'));}catch{check('Private persistent database accessible and initialized',false);}finally{db?.close();}
check('Built frontend present',existsSync('dist/index.html'));
check('Approved original logo/artwork installed',['public/brand/mzansiplumb.png',...['hero-plumber','challenge-plumber','mobile-app','property-van','faq-water-tap'].map(f=>'public/images/'+f+'.webp')].every(existsSync));
check('Account email service enabled/configured',authMailReady(authMailRuntime())&&!!process.env.RESEND_WEBHOOK_SECRET);
check('Email verification required',process.env.REQUIRE_VERIFIED_EMAIL==='true');
check('Independent backup encryption key configured',Buffer.from(process.env.BACKUP_ENCRYPTION_KEY||'','base64').length===32);
if(existsSync('.env'))check('.env permission is owner-only',!(statSync('.env').mode&0o077));
const b=billingRuntime();check('Billing disabled or activation configuration complete',(!b.enabled&&!b.approved)||(b.enabled&&b.approved&&(billingReady(b,'paypal')||billingReady(b,'payfast'))));
console.log('Manual gates remain: confirmed Hostinger plan/domain, persistent-volume restart test, HTTPS/proxy validation, live email/merchant verification, backup recovery drill, legal/security/load review. This command cannot certify them.');
if(failures)console.error(`${failures} launch prerequisite(s) unresolved.`);process.exitCode=failures?1:0;
