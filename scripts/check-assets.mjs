import {existsSync} from 'node:fs';
const required=['public/brand/mzansiplumb.png','public/images/hero-plumber.webp','public/images/challenge-plumber.webp','public/images/mobile-app.webp','public/images/property-van.webp','public/images/faq-water-tap.webp'];
const missing=required.filter(path=>!existsSync(path));
if(missing.length){console.error('Approved artwork is not yet available to the build:\n'+missing.join('\n'));process.exitCode=1;}else{console.log('All expected artwork paths exist. Compare the rendered page against the approved reference before release.');}
