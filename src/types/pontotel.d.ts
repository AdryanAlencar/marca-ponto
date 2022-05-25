type APP_VERSION = 'v2.9.6';

type Company = { 
    id: string, 
    name: string,
    displayed_name: string,
    logo: string
}

type CompanyRepsonse = {
    success: {
        comp_man: Company,
        companies: Company[]
    }
}

type Employee = {
    id: string,
    pws: string,
    name: string,
    nickname: string,
    employer: string,
    allowVoice: boolean,
    forcarModalDeRequisicaoDeVoz: boolean,
    doubleCheck: boolean,
    allowActivity: any,
}

type Device = {
    id: string,
    fingerprint: string,
    comp_man: Company,
    reason: string,
    name: string,
    active: boolean,
    personal: boolean,
    appVersion: APP_VERSION,
    recaptcha: boolean,
    employee: Employee,
    companies: Company[],
    fallback: any[],
    kind: string,
}

type DeviceResponse = {
    success: Device
}


type LineInfo = {
    entrada: boolean;
    pausa: boolean;
    retorno: boolean;
    saida: boolean;
    total: number;
}

type DcInfo = {
}

type Pt = {
    day: string;
    time: Date;
    kind: string;
    fake: boolean;
}

type Entrada = {
    time: Date;
    fake: boolean;
}

type DayPts = {
    entrada: Entrada[];
    pausa: any[];
    retorno: any[];
    saida: any[];
}

type LastEmp = {
    employee: string;
    pwd: string;
}

type CheckPassword = {
    employee: Employee;
    lineInfo: LineInfo;
    dcInfo: DcInfo;
    pts: Pt[];
    dayPts: DayPts;
    lastEmps: LastEmp[];
    sessionToken: string;
}

type CheckPasswordResponse = {
    success: CheckPassword;
}


export type {
    Company,
    CompanyRepsonse,
    Employee,
    Device,
    DeviceResponse,
    CheckPassword,
    CheckPasswordResponse,
    APP_VERSION,
    LineInfo,
    DcInfo,
    Pt,
    Entrada,
    DayPts,
    LastEmp,
}