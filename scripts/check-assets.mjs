import {existsSync} from 'node:fs';
import sharp from 'sharp';
const photos=['hero-plumber','challenge-plumber','mobile-app','property-van','faq-water-tap'];
const icons=['challenge-calendar','challenge-clock','challenge-quote','challenge-hand',...Array.from({length:8},(_,i)=>'feature-'+i),'benefit-pin','benefit-shield','benefit-chart','benefit-headset'];
const required=['public/brand/mzansiplumb.png',...photos.map(n=>'public/images/'+n+'.webp'),...icons.map(n=>'public/images/icons/'+n+'.webp')];
const missing=required.filter(path=>!existsSync(path));
if(missing.length){console.error('Approved reference artwork is missing:\n'+missing.join('\n'));process.exitCode=1;}else{for(const path of required){const meta=await sharp(path).metadata();if(!meta.width||!meta.height||meta.width<20||meta.height<20)throw new Error('Invalid image asset: '+path);}const logo=await sharp(required[0]).stats();if(logo.channels.length!==4||logo.channels[3].min!==0||logo.channels[3].max!==255)throw new Error('Logo must retain a transparent background and visible artwork');console.log(`${required.length} reference artwork assets decode correctly; logo transparency verified. Visual comparison remains required.`);}
