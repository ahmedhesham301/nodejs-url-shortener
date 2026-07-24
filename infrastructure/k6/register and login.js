import http from 'k6/http';
import { check, group, sleep } from 'k6';
import exec from "k6/execution";


export const options = {
  vus: 1,
  duration: '30s'
};


export default function () {
  const payload = JSON.stringify({
    email: randomEmail(),
    password: "123456789"
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // register 
  group("register", function () {
    const registerRes = http.post('http://10.43.254.101:8080/auth/register', payload, params)
    check(registerRes, { 'response code for register was 201': (res) => res.status == 201 })
    if (registerRes.status !== 201) {
      console.log(registerRes.body);
      return;
    }

  })

  sleep(1)

  //login
  group("login", function () {
    const loginRes = http.post('http://10.43.254.101:8080/auth/login', payload, params)
    check(loginRes, { 'response code for login was 200': (res) => res.status == 200 })
    if (loginRes.status !== 200) {
      console.log(loginRes.body);
      return;
    }
  })


  const createURLPayload = JSON.stringify({
    url: "https://www.bbc.com/",
    monitoring: "none"
  });
  group("create url", function () {
    const createRes = http.post("http://10.43.254.101:8080/create", createURLPayload, params)
    check(createRes, { 'response code for create url was 201': (res) => res.status == 201 })
    if (createRes.status !== 201) {
      console.log(createRes.body)
    }
  })

  // get the url


  // group("get the url", function () {
  //   for (let i = 0; i < 10; i++) {
  //     group("get url", function () {
        
  //     })

  //   }
  // })


}


function randomEmail() {
  return `user_${exec.vu.idInTest}_${exec.vu.iterationInScenario}_${Date.now()}@example.com`;
}