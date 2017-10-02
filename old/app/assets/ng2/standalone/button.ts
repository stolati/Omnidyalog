(function () {
    var ev = eval;
    var urls:{[i: string]: string} = {'http:': '$base_url_http', 'https:': '$base_url_https'};
    var base_url = urls[window.location.protocol];
    var first_message_content = {m: 'init', code_path: '$code_path'};


    var listener = function (e:MessageEvent) {
        if (e.origin !== base_url) return;
        if (e.data.m === 'code') {
            console.log(e.data.code);
            window.removeEventListener('message', listener);
            ev(e.data.code)({frame: i, base_url: base_url});
        }
    };
    window.addEventListener('message', listener);


    var firstMessage = (iframe:HTMLIFrameElement) => {
        console.log('firstMessage call : ', iframe);
        iframe.contentWindow.postMessage(first_message_content, '*');
    };


    var i = <HTMLIFrameElement>document.querySelector('#wc-connection-frame');
    if (i !== null) {
        firstMessage(i);
    } else {
        i = document.createElement('iframe');
        i.style.display = 'none';
        i.src = `${base_url}/innerFrame`;
        i.id = 'wc-connection-frame';
        i.onload = () => firstMessage(i);
        document.body.appendChild(i);
    }

}());

