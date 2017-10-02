
window.addEventListener('message', function (e: MessageEvent) {
    var e_name = e.data.m;
    var e_data = e.data;
    delete e.data.m;
    console.log("iframe receive:", e_name, e.data);

    var respond = function(name: string, data: any){
        data.m = name;
        e.source.postMessage(data, e.origin);
    };


    if (e_name === 'init') {

        $.ajax({
            url: `assets/ng2-js/${e_data.code_path}.js`,
            type: 'get',
            dataType: 'html', //if we don't put anything, it will execute the code

            success: function (code: string) {
                code = '(function(params){\n' + code + '\n})';
                respond('code', {code:code});
            }

        });

    }

    if (e_name === 'server_call'){

        //id
        //path, data
        $.ajax(e_data.path, {
                contentType: 'application/json',
                data: e_data.data,
                success: (res:any) => {
                    console.log("respond : ", res);
                    respond('server_call_res', {id: e_data.id, data: res});
                },
                error: (res1: any, res2: any, res3: any) => {
                    console.log('erorr', res1, res2, res3);
                },
            }
        );

    }


    if(e_name === 'html_content'){
        var data = {name:e_data.name, content:e_data.content, url:e_data.url, style:e_data.style};

        $.ajax('/page', {
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: (code: any) => {
                var pageUrl = 'ng2#/showPage/' + code.$oid;
                var fullUrl = window.location.protocol + "//" + window.location.host + '/' + pageUrl
                respond('changeUrl', {url:fullUrl} );
            }
        });
    }


    if (e_name === "check_url"){
        console.log('getting check_url asking');

        $.ajax('/page/exists', {
            type: 'GET',
            data: {url: e_data.url},
            success: (res: any) => {
                respond('check_url_res', res);
            },
            error: (res1: any, res2: any, res3: any) => {
                console.log('erorr', res1, res2, res3);
            },
        });

    }

    if(e_name === "get_comments"){
        console.log("getting comments");

        $.ajax('/page/' + e_data.pageId + '/comment', {
            type: 'GET',
            success: (res: any) => {
                respond('get_comments_res', res);
            },
            error: (res1: any, res2: any, res3: any) => {
                console.log('erorr', res1, res2, res3);
            },
        });


    }


    if(e_name === "call_server") {
        console.log("call server");

        var ret_name = e_data.ret_name;

        $.ajax(e_data.path, {
            type: e_data.verb,
            contentType: 'application/json',
            data: e_data.query,
            success: (res:any) => {
                respond(e_data.ret_name, res);
            },
            error: (res1:any, res2:any, res3:any) => {
                console.log('erorr', res1, res2, res3);
            },
        });

    }

});



