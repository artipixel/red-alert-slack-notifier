const https = require('https');
const { env } = require('process');
const DEBUG = env.DEBUG;
const SECONDS = env.SECONDS || 10
const CITIES = env.CITIES?.length ? env.CITIES.split(',') : null;
const DEMO = env.DEMO === "true" || false;

const log = (args) => {
    if (DEBUG) console.log(args);
}

const slackNotificationOptions = {
    hostname: 'hooks.slack.com',
    path: '/services/' + env.TOKENS,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
};

const sendSlackNotification = (text) => {
    const postData = JSON.stringify({
        text: text
    });

    const req = https.request(slackNotificationOptions, res => {
        log(`Slack status code: ${res.statusCode}`);

        let data = '';
        res.on('data', chunk => {
            data += chunk;
        });

        res.on('end', () => {
            log(data);
        });
    });

    req.on('error', error => {
        console.error(error);
    });

    log("Sending slack message");
    req.write(postData);
    req.end();
}

const orefOptions = {
    hostname: 'www.oref.org.il',
    path: '/WarningMessages/alert/alerts.json',
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'https://www.oref.org.il/'
    }
};

const checkNotification = () => {

    if (DEMO) {
        const jsonData = {
            "id": "133281935730000000",
            "cat": "1",
            "title": "בדיקה - ירי רקטות וטילים",
            "data": [
                "בת-ים",
                "פלמחים",
                "ראשון לציון - מערב",
                "תירוש"
            ],
            "desc": "זוהי אינה התראה אמיתית"
        };
        sendSlackNotification(`*${jsonData.title}*\n\n>${jsonData.data.join('\n>')}\n\n${jsonData.desc}`);
        return;
    }

    const req = https.request(orefOptions, res => {
        log(`Pikud ha oref status code: ${res.statusCode}`);
        if (res.statusCode !== 200) {
            return;
        }
        let data = '';
        res.on('data', chunk => {
            data += chunk;
        });

        res.on('end', () => {
            log("Data:");
            log(data);
            if (data && data?.trim().length) {
                const jsonData = JSON.parse(data);
                if (jsonData.title && jsonData.data) {
                    let sendAlert = false;
                    if (CITIES) {
                        CITIES.forEach(city => {
                            if (jsonData.data.includes(city)) {
                                sendAlert = true;
                            }
                        })
                    } else {
                        sendAlert = true;
                    }
                    if (sendAlert) {
                        sendSlackNotification(`*${jsonData.title}*\n\n${jsonData.data.join('\n')}\n\n\`${jsonData.desc}\``);
                        return;
                    }
                }
            } else {
                log("No notifications")
            }
        });
    });
    req.on('error', error => {
        error(error);
    });

    req.end();

};

console.log(`=== Start pulling Red Alert events every ${SECONDS} seconds ===`)
if(DEMO)console.log(`=!!! Demo mode is on !!!=`)
setInterval(checkNotification, SECONDS * 1000);