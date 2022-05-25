import fetch from 'node-fetch';
import { CheckPasswordResponse, CompanyRepsonse, DeviceResponse } from '../types/pontotel';

const API_BASE_URL = "back.pontotel.com.br"
const API_URL = `https://${API_BASE_URL}`;

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

    let response = await request.json() as CompanyRepsonse;
    // get session cookie from set-cookie header
    let sessionCookie = await request.headers['Set-Cookie'][0];

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
            'Cookie': params.compMan
        },
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
    let sessionCookie = await request.headers['Set-Cookie'][0];

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
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            pwd: password,
            fingerprint: fingerprint
        })
    })

    let response = await request.json() as CheckPasswordResponse;
}

export {
    doLogin,
    activateDevice,
    getCurrentTime,
    checkPassword
}