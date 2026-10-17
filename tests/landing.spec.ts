import {test,expect} from '@playwright/test';
test.beforeEach(async({page})=>{await page.goto('/');});
test('preserves approved section order without horizontal overflow',async({page})=>{
 await expect(page.locator('main h1, main h2')).toHaveCount(5);
 const headings=await page.locator('main h1, main h2').allTextContents();
 expect(headings).toEqual(['Run a Smarter,More ProfitablePlumbing Businesswith MzansiPlumb','Running a Plumbing Businessis Tough Enough...','A Complete PlumbingOperations Platform','Built for South AfricanPlumbing Businesses','Got Questions?We’ve Got Answers.']);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
 await expect(page.locator('main')).toHaveCount(1);
});
test('FAQ items and expand-all are usable',async({page})=>{
 const first=page.locator('.faq-list details').first();
 await first.locator('summary').click(); await expect(first).toHaveAttribute('open','');
 await expect(first.locator('p')).toBeVisible();
 await page.getByRole('button',{name:'View All FAQs'}).click();
 expect(await page.locator('.faq-list details[open]').count()).toBe(5);
 await page.getByRole('button',{name:'View All FAQs'}).click();
 expect(await page.locator('.faq-list details[open]').count()).toBe(0);
});
test('signup connects to the real workspace registration',async({page})=>{
 await page.locator('.hero-cta').click();
 await expect(page).toHaveURL(/app\?mode=signup/);
 await expect(page.getByRole('heading',{name:'Create your workspace'})).toBeVisible();
 await expect(page.getByLabel('Company name',{exact:true})).toBeVisible();
});
test('features connect to the workspace and pricing keeps billing disabled',async({page})=>{
 await page.getByRole('button',{name:'Digital Job Cards with Photos'}).click();
 await expect(page).toHaveURL(/app#jobs/);
 await expect(page.getByRole('heading',{name:'Welcome back'})).toBeVisible();
 await page.goto('/');
 await page.getByRole('navigation',{name:'Footer navigation'}).getByRole('button',{name:'Pricing'}).click();
 await expect(page.getByRole('dialog')).toContainText('payment processing remain disabled');
});
test('navigation and resources work at the current viewport',async({page},testInfo)=>{
 if(testInfo.project.name!=='desktop'){
  await page.getByRole('button',{name:'Open navigation'}).click();
  await expect(page.locator('#navigation')).toBeVisible();
 }
 await page.getByRole('button',{name:'Resources'}).click();
 await expect(page.locator('#resources-menu')).toBeVisible();
 await page.getByRole('link',{name:'Frequently asked questions',exact:true}).click();
 await expect(page).toHaveURL(/#faq$/);
 if(testInfo.project.name!=='desktop')await expect(page.locator('#navigation')).not.toBeVisible();
});
test('internal anchor destinations exist and no empty links exist',async({page})=>{
 const missing=await page.locator('a').evaluateAll(links=>links.filter(a=>{const href=a.getAttribute('href');return !href||href==='#'||(href.startsWith('#')&&!document.getElementById(href.slice(1)));}).map(a=>a.textContent));
 expect(missing).toEqual([]);
});
