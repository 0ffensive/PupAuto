const puppeteer = require('puppeteer');
const { transport, message } = require('./email.config');

exports.browse = async (callback) => {
    console.log('Starting The Browser');
    callback('starting');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({
        width: 1280,
        height: 720
    })
    // Israel 150, Brazil 145 ->
    console.log('Go to site 150');
    callback('goToSite');
    await page.goto('https://secure.e-konsulat.gov.pl/Wizyty/Paszportowe/RejestracjaTerminuWizytyPaszportowej.aspx?IDPlacowki=150');
    
    console.log('Typing...');
    callback('typing');
    await page.type('#ddlWersjeJezykowe', "Polska");

    try {
        await page.waitForSelector('#cp_ctrlDzieci');
        await page.type('#cp_ctrlDzieci', "1");
        
    } catch (error) {
        console.log('Not found!');
        callback('error');
    }

    try {
        await page.waitForSelector('#cp_btnZarejestruj', { timeout: 10000 });
        console.log('Now Im going to send you a msg!!!');
        transport.sendMail(message, function(err, info) {
          if (err) {
            console.log(err)
          } else {
            console.log(info);
          }
      });

    } catch (error) {
        console.log('Not exists');
        callback('notExists');
    }
    
    // await page.screenshot({ path: 'page.png' });
    
    await browser.close();
    console.log('Finished task');
    callback('finishTask');
};