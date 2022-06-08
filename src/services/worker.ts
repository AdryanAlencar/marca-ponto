import * as cron from 'node-cron';
import { Device } from '../types/pontotel';
import { checkFile, saveContent, getContent } from '../utils/firebase';
import { doLogin, activateDevice, checkPassword, registerJourney } from '../utils/pontotel';

const TaskJourneyIn = async (credentials : { device: Device; session: string;}) => {
    const data = await checkPassword(credentials.device.id, process.env.common_pwd || "")
    await registerJourney({
        kind: 'Entrada',
        fingerprint: credentials.device.id,
        employee: data.history.employee.id,
        sessionToken: data.history.sessionToken
    })
}

const TaskJourneyOut = async (credentials : { device: Device; session: string;}) => {
    const data = await checkPassword(credentials.device.id, process.env.common_pwd || "")
    await registerJourney({
        kind: 'Saída',
        fingerprint: credentials.device.id,
        employee: data.history.employee.id,
        sessionToken: data.history.sessionToken
    })
}


async function doLoginAndActivateDevice() {
    var email = process.env.email || "";
    var password = process.env.password || "";
    var common_pwd = process.env.common_pwd || "";
    var name = process.env.name || "";
    var userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36"

    let login_data = await doLogin(email, password);

    let response = await activateDevice({
        appVersion: "v2.9.6",
        compMan: login_data.company.id,
        email: email,
        isMobile: false,
        name: name,
        pwd: common_pwd,
        reason: "Trabalhar",
        userAgent
    });

    return response;
}

export const initWorker = () => {
    console.info("Worker started;");
    var credentials : {
        device: Device;
        session: string;
    } = {} as {
        device: Device;
        session: string;
    };

    (async () => {
        let saved = await checkFile("credentials.json")

        if(!saved) {
            credentials = await doLoginAndActivateDevice() as {
                device: Device;
                session: string;
            };
            await saveContent("credentials.json", JSON.stringify(credentials));
        }
        
        if(saved){
            let content = await getContent("credentials.json");
            credentials = JSON.parse( content || "{}") as {
                device: Device;
                session: string;
            };
        }
    })();

    cron.schedule('0 40 8 * * * *', async () => {
        console.info(`Journey in;`);
        TaskJourneyIn(credentials);
    },{
        scheduled: true,
        timezone: "America/Sao_Paulo"
    });

    cron.schedule('0 20 18 * * * *', async () => {
        console.info(`Journey out;`);
        TaskJourneyOut(credentials);
    },{
        scheduled: true,
        timezone: "America/Sao_Paulo"
    })
}