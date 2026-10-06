import http from 'k6/http';
import { check, sleep } from 'k6';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';

const getOnlyMetrics = [
    'http_reqs',
    'http_req_failed',
    'http_req_duration',
    'http_req_blocked',
    'http_req_connecting',
    'http_req_tls_handshaking',
    'http_req_sending',
    'http_req_waiting',
    'http_req_receiving',
];
const metricFilters = Object.fromEntries(
    getOnlyMetrics.map((name) => [name, `${name}{method:GET}`]),
);
// Network byte metrics have scenario tags, but no HTTP method tag.
metricFilters.data_received = 'data_received{scenario:default}';
metricFilters.data_sent = 'data_sent{scenario:default}';

export const options = {
    vus: 40,
    duration: '30m',
    // Iterations: 1,
    // Empty thresholds make k6 aggregate these filtered metrics without a limit.
    thresholds: Object.fromEntries(
        Object.values(metricFilters).map((name) => [name, []]),
    ),
};

export function handleSummary(data) {
    // Only the console summary is filtered; raw metric outputs retain setup traffic.
    const metrics = { ...data.metrics };
    for (const name of Object.keys(metrics)) {
        if (name.startsWith('http_') || name.startsWith('data_received') || name.startsWith('data_sent')) {
            delete metrics[name];
        }
    }
    for (const [name, filteredName] of Object.entries(metricFilters)) {
        if (data.metrics[filteredName]) {
            metrics[name] = data.metrics[filteredName];
        }
    }
    return {
        stdout: textSummary({ ...data, metrics }, { indent: ' ', enableColors: false }),
    };
}

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

    const monitoringTypes = ['minutely', 'hourly', 'daily'];
    const params2 = {
        headers: {
            "Content-Type": "application/json",
        },
        responseCallback: http.expectedStatuses(201),
    };

    const urlIds = [];
    for (const monitoring of monitoringTypes) {
        const createURLPayload = JSON.stringify({
            url: "https://www.bbc.com/",
            monitoring,
        });
        const createRes = http.post(`${host}/create`, createURLPayload, params2);
        if (createRes.status !== 201) {
            console.log(createRes.body);
            return;
        }
        urlIds.push(JSON.parse(createRes.body).id);
    }
    return urlIds;
}

export default function (data) {
    // setup() returns one URL ID for each monitoring interval.
    const urlId = data[Math.floor(Math.random() * data.length)];
    const res = http.get(`${host}/${urlId}`, {
        redirects: 0,
        responseCallback: http.expectedStatuses(302),
    });

    check(res, {
        'returns a redirect': (r) => r.status === 302,
        'redirects to the correct URL': (r) =>
            r.headers['Location'] === 'https://www.bbc.com/',
    });

    sleep(Math.random() * 3);
}
