'use strict';

const minimist = require('minimist');
const puppeteer = require('puppeteer');
const ejs = require('ejs');
const fs = require('fs');

function base64_encode(file) {
    try {
        let bitmap = fs.readFileSync(file);
        return Buffer.from(bitmap).toString('base64');
    } catch (err) {
        console.log(`Missing file '${file}'.`);
    }
    return null;
}

const argv = minimist(process.argv.slice(2));

(async () => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setViewport({width: 768, height: 620, deviceScaleFactor: 2.0});

    for (const name of argv["_"]) {
        let boxBase64 =  base64_encode(`./box/${name}.jpg`);
        let showBase64 = base64_encode(`./show/${name}.jpg`);

        let data = require(`./json/${name}.json`);
        data["box"] = boxBase64;
        data["show"] = showBase64;

        let html = await ejs.renderFile('frame.ejs', {data: data});
        fs.writeFile(`./html/${name}.html`, html, () => false);

        await page.setContent(html, {waitUntil: ["load", "networkidle0"]});

        try {
            await page.screenshot({path: `png/${name}.png`});
        } catch (err) {
            console.log(`Error: ${err.message}`);
        } finally {
            console.log(`Screenshot '${name}' has been captured successfully.`);
        }
    }

    await browser.close();

})();
