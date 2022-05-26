import fetch from 'node-fetch';
import { CheckPasswordResponse, CompanyRepsonse, DeviceResponse } from '../types/pontotel';

const API_BASE_URL = "back.pontotel.com.br"
const API_URL = `https://${API_BASE_URL}`;
var SESSION = ""

const doLogin = async (email: string, password: string) => {
    // make a post with axios, in json format
    let request = await fetch(`${API_URL}/web/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    })
    
    SESSION = request.headers.get('Set-Cookie') || '';

    let response = await request.json() as CompanyRepsonse;
    let sessionCookie = formatCookiesString(request.headers.get('Set-Cookie') || '').filter(cookie => cookie.key === 'session')[0].value;
    return {
        company: response.success.comp_man,
        session: sessionCookie
    };
}

const activateDevice = async (params : {
    compMan: string,
    reason: string,
    name: string,
    email: string,
    pwd: string,
    userAgent: string,
    isMobile: true | boolean,
    appVersion: "v2.9.6"
}) => {
    let request = await fetch(`${API_URL}/web/device`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Sec-Ch-Ua": "(Not(A\":B\"rand\";v=\"8\", \"Chromium\";v=\"101\"",
            "Accept": "application/json, text/plain, */*",
            "Sec-Ch-Ua-Mobile": "?0",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36",
            "Sec-Ch-Ua-Platform": "macOS",
            "Origin": "https://registro.pontotel.com.br",
            "Sec-Fetch-Site": "same-site",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Dest": "empty",
            "Cookie": SESSION,
        },
        redirect: 'follow',
        body: JSON.stringify({
            reason: params.reason,
            name: params.name,
            email: params.email,
            pwd: params.pwd,
            userAgent: params.userAgent,
            isMobile: params.isMobile,
            appVersion: params.appVersion
        })
    })

    let response = await request.json() as DeviceResponse;
    let sessionCookie = formatCookiesString(request.headers.get('Set-Cookie') || '').filter(cookie => cookie.key === 'session')[0].value;

    return {
        device: response.success,
        session: sessionCookie
    }
}

const getCurrentTime = async (fingerprint: string) => {
    let request = await fetch(`${API_URL}/web/current-time/${fingerprint}`);
    let response = await request.json() as {time: string};

    return response.time;
}

const checkPassword = async (fingerprint: string, password: string) => {
    let request = await fetch(`${API_URL}/web/checkpwd`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': SESSION
        },
        body: JSON.stringify({
            pwd: password,
            fingerprint: fingerprint
        })
    })

    let response = await request.json() as CheckPasswordResponse;

    return {
        history: response.success
    }
}

const registerJourney = async (params : {
    kind: "Saída" | "Entrada",
    fingerprint: string,
    employee: string,
    sessionToken: string
}) => {
    let request = await fetch(`${API_URL}/web/savetimelog`, {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data',
            'Cookies': SESSION
        },
        body: formatFormData({
            kind: params.kind,
            fingerprint: params.fingerprint,
            employee: params.employee,
            sessionToken: params.sessionToken
        })
    });

    return request.ok;
}

const formatFormData = (params : any) => {
    let form_data = new FormData();

    for (let key in params) {
        form_data.append(key, params[key]);
    }

    return form_data;
}

const formatCookiesString = (cookies: string) => {
    let cookies_array = cookies.split(';');
    let cookies_string = [] as {key: string, value: string}[];

    cookies_array.forEach(cookie => {
        let key = cookie.split('=')[0];
        let value = cookie.split('=')[1];

        cookies_string.push({
            key,
            value
        });
    });

    return cookies_string;
}

export {
    doLogin,
    activateDevice,
    getCurrentTime,
    checkPassword,
    registerJourney
}