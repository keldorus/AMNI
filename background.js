'use strict';

const conf = {
    ports: [{
        id    : '0',
        value : 9229
    }],
    auto      : false,
    refresh   : 500
}

let interval;

function createInterval() {
    interval = window.setInterval(() => {
        refresh();
    }, parseInt(conf.refresh, 10));
}

function refresh() {
    openDebugger();
}

function changeRefresh() {
    conf.auto = !conf.auto;

    handleInterval();
}

function changeRefreshTime(e) {
    conf.refresh = e.target.value;

    handleInterval();
}

function handleInterval() {
    window.clearInterval(interval);

    if (conf.auto) {
        createInterval();
    }
}


function getConf() {
    return conf;
}

function openDebugger() {
   conf.ports.forEach((port) => {
        if (port.value === 0) {
            return;
        }

        request(`http://localhost:${port.value}/json`)
        .then((resp) => {
            if (resp[0].devtoolsFrontendUrl) {
                var url = resp[0].devtoolsFrontendUrl.replace('chrome-devtools://', 'devtools://');

                if (port.url) {
                    chrome.tabs.query({
                        url : port.url
                    }, (tabs) => {
                        if (tabs.length === 0) {
                            chrome.tabs.create({
                                url    : url,
                                active : false
                            });
                        } else if (port.url !== url) {
                            chrome.tabs.update(tabs[0].id, {
                                url    : url,
                                active : false
                            });

                            port.url = url;
                        }
                    });
                } else {
                    chrome.tabs.create({
                        url    : url,
                        active : false
                    });

                    port.url = url;
                }
            }
        })
        .catch((err) => {
            console.log(err);
        });
    });
}

function request(url) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(JSON.parse(xhr.response));
            } else {
                reject(xhr.statusText);
            }
        };
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send();
    });
}
