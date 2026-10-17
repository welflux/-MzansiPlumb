import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,isAbsolute} from 'node:path';
import {bad} from './operations-domain.mjs';
const exec=promisify(execFile);
export async function scanPdf(bytes){const scanner=process.env.CLAMSCAN_PATH;if(!scanner||!isAbsolute(scanner))bad(415,'PDF attachments require a configured malware scanner. Upload a supported photo instead.');const dir=await mkdtemp(join(tmpdir(),'mzansiplumb-scan-'));try{const file=join(dir,'attachment.pdf');await writeFile(file,bytes,{mode:0o600,flag:'wx'});try{await exec(scanner,['--no-summary','--stdout','--',file],{timeout:15000,maxBuffer:65536,windowsHide:true});}catch(e){if(e.code===1)bad(422,'The attachment was rejected by the malware scanner');bad(503,'The malware scanner is unavailable; no attachment was stored');}}finally{await rm(dir,{recursive:true,force:true});}}
