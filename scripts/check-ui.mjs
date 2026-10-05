import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
const base = process.env.INVITATION_URL || 'http://127.0.0.1:5173';
const output = process.env.QA_OUTPUT || '../../work/qa';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'msedge', headless: true });
const report = [];
try {
  for (const viewport of [{width:320,height:640},{width:390,height:844},{width:535,height:752},{width:613,height:737},{width:768,height:1024},{width:1440,height:1000}]) {
    const context = await browser.newContext({viewport,deviceScaleFactor:1});
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(`${base}/?name=Syed+Abdullah+Family`);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('.invitee').textContent(), 'Syed Abdullah Family');
    assert.equal(await page.locator('.reverse-face').isVisible(),false,'Envelope must not cover the invitation front');
    assert.equal(await page.locator('.outer-face').isVisible(),true);
    const front = await page.locator('.outer-canvas').evaluate(el => {
      const rect = selector => el.querySelector(selector).getBoundingClientRect();
      const title = el.querySelector('.front-title');
      return {
        titleFits: title.getComputedTextLength() <= 491,
        headerBottom: rect('[data-region="header"]').bottom,
        coupleTop: rect('[data-region="couple"]').top,
        coupleBottom: rect('[data-region="couple"]').bottom,
        recipientTop: rect('[data-region="recipient"]').top,
        recipientBottom: rect('[data-region="recipient"]').bottom,
        senderTop: rect('[data-region="sender"]').top,
        senderBottom: rect('[data-region="sender"]').bottom,
        faceBottom: el.getBoundingClientRect().bottom,
      };
    });
    assert.ok(front.titleFits, `heading clipped at ${viewport.width}`);
    assert.ok(front.headerBottom <= front.coupleTop, `heading/couple overlap at ${viewport.width}`);
    assert.ok(front.coupleBottom < front.recipientTop, `couple/name overlap at ${viewport.width}`);
    assert.ok(front.recipientBottom < front.senderTop, `name/sender overlap at ${viewport.width}`);
    assert.ok(front.senderBottom < front.faceBottom - 6, `sender clipped at ${viewport.width}`);
    await page.screenshot({path:`${output}/closed-${viewport.width}.png`});
    await page.locator('.scene-trigger').evaluate(el => { el.click(); el.click(); });
    await page.waitForSelector('main[data-state="INNER_REVEALED"]');
    assert.equal(await page.locator('.outer-face').isVisible(),false);
    assert.equal(await page.locator('.reverse-face').isVisible(),true);
    assert.equal(await page.locator('.sleeve-pocket').isVisible(),false);
    assert.equal(await page.locator('.reading').count(),0,'Details must wait for the second tap');
    await page.screenshot({path:`${output}/revealed-card-${viewport.width}.png`});
    await page.locator('.scene-trigger').click();
    await page.waitForSelector('main[data-state="BOOK_OPEN"]');
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({path:`${output}/open-${viewport.width}.png`,fullPage:true});
    assert.equal(await page.locator('a').count(),1);
    assert.equal(await page.locator('a').getAttribute('href'),'https://maps.app.goo.gl/9ZZcz9tto8mhHvDbA');
    assert.equal(await page.locator('audio').count(),1);
    assert.equal(await page.locator('audio').evaluate(el => el.loop),true);
    assert.equal(await page.locator('.reading .english').innerText().then(t=>t.includes('Mohammed Sarvatunnisa')),true);
    assert.equal(await page.locator('body').innerText().then(t=>t.includes('Sarvathunnisa')),false);
    const dimensions = await page.evaluate(() => ({width:innerWidth,scroll:document.documentElement.scrollWidth}));
    assert.ok(dimensions.scroll <= dimensions.width, `overflow at ${viewport.width}`);
    for (const element of await page.locator('.reading .page-copy').all()) {
      const size = await element.evaluate(el => ({width:el.clientWidth,scroll:el.scrollWidth}));
      assert.ok(size.scroll <= size.width + 1, `printed copy overflow at ${viewport.width}`);
    }
    assert.deepEqual(errors,[]);
    await page.getByRole('button',{name:'Close invitation and return to the outer card'}).click();
    await page.waitForSelector('main[data-state="CLOSED"]');
    assert.equal(await page.locator('.reverse-face').isVisible(),false,'Envelope must be hidden after closing');
    assert.equal(await page.locator('.outer-face').isVisible(),true);
    assert.equal(await page.locator('.scene-trigger').evaluate(el=>el===document.activeElement),true);
    report.push(`${viewport.width}px: opening, reading, links, overflow, close and focus PASS`);
    await context.close();
  }
  const context = await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
  const page = await context.newPage();
  await page.goto(`${base}/?name=${encodeURIComponent('<script>alert(1)</script>')}`);
  assert.equal(await page.locator('.invitee').textContent(),'<script>alert(1)</script>');
  await page.locator('.scene-trigger').focus();
  await page.keyboard.press('Enter');
  await page.waitForSelector('main[data-state="INNER_REVEALED"]',{timeout:1500});
  await page.keyboard.press('Enter');
  await page.waitForSelector('main[data-state="BOOK_OPEN"]',{timeout:1500});
  report.push('Reduced motion, keyboard opening and escaped query text PASS');
  await page.goto(`${base}/?name=${encodeURIComponent('Syed Abdullah and Family — محمد عبد الله — ఆత్మీయ కుటుంబం')}`);
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
  assert.equal((await page.locator('.invitee').textContent()).replace(/\s/g,''),'Syed Abdullah And Family — محمد عبد الله — ఆత్మీయ కుటుంబం'.replace(/\s/g,''));
  const longNameBounds = await page.locator('.address-face').evaluate(el=> {
    const face = el.getBoundingClientRect();
    const canvas = el.querySelector('.outer-canvas').getBoundingClientRect();
    const name = el.querySelector('.invitee');
    const bounds = name.getBoundingClientRect();
    return {canvasFits:canvas.right <= face.right + 1 && canvas.bottom <= face.bottom + 1,nameFits:bounds.left >= face.left && bounds.right <= face.right,face:face.toJSON(),name:bounds.toJSON()};
  });
  assert.ok(longNameBounds.canvasFits && longNameBounds.nameFits, JSON.stringify(longNameBounds));
  await page.screenshot({path:`${output}/long-name-mobile.png`});
  await page.goto(base);
  assert.equal(await page.locator('.invitee').textContent(),'');
  report.push('Long multilingual names and blank-name fallback PASS');
  await context.close();
  console.log(report.join('\n'));
} finally { await browser.close(); }
