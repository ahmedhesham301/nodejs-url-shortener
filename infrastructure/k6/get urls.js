import http from 'k6/http';
import { check, group, sleep } from 'k6';
import exec from "k6/execution";


export const options = {
    vus: 5,
    duration: '30s',
    // Iterations: 1,
};

const host = __ENV.HOSTNAME;
// register
export function setup() {
    const payload = JSON.stringify({
        email: "ahmed@gmail.com",
        password: "123456789"
    });
    const params = {
        headers: {
            "Content-Type": "application/json",
        },
        responseCallback: http.expectedStatuses(200, 201, 400),
    };

    const registerRes = http.post(`${host}/auth/register`, payload, params,)
    if (registerRes.status !== 201 && registerRes.status !== 400) {
        console.log("error registering");
        console.log(registerRes.body);

        return
    }

    // login

    const loginRes = http.post(`${host}/auth/login`, payload, params)
    if (loginRes.status !== 200) {
        console.log("error logging in");
        console.log(loginRes.body);
        return;
    }

    const createURLPayload = JSON.stringify({
        url: "https://www.bbc.com/",
        monitoring: "none"
    });
    const params2 = {
        headers: {
            "Content-Type": "application/json",
        },
        responseCallback: http.expectedStatuses(201),
    };

    const createRes = http.post(`${host}/create`, createURLPayload, params2)
    if (createRes.status !== 201) {
        console.log(createRes.body)
        return
    }
    return JSON.parse(createRes.body).id
}

export default function (data) {
    const createRes = http.post(`${host}/create`, createURLPayload, params)
    check(createRes, { 'response code for create url was 201': (res) => res.status == 201 })
    if (createRes.status !== 201) {
        console.log(createRes)
    }
}
