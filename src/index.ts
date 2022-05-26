import 'dotenv/config'
import { activateDevice, doLogin } from './utils/pontotel';

(async () => {
    var email = process.env.email || "";
    var password = process.env.password || "";
    var common_pwd = process.env.common_pwd || "";
    var name = process.env.name || "";
    var userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36"

    let login_data = await doLogin(email, password);

    console.log(JSON.stringify(login_data))

    let device = await activateDevice({
        appVersion: "v2.9.6",
        compMan: login_data.company.id,
        email: email,
        isMobile: false,
        name: name,
        pwd: common_pwd,
        reason: "Trabalhar",
        userAgent
    });

    console.log(JSON.stringify(device))

})();