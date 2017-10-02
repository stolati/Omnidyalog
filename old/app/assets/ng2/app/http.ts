
declare var $: any;

export class Req {
    verb:string = "GET";
    myQuery:string = "";
    myPath:string = "";
    bodyJs:JSON = undefined;

    constructor(verb:string) {
        this.verb = verb;
    }

    call<T>():Promise<T> {

        return new Promise<T>((resolve, reject) => {
            var settings = {
                url: this.myPath + this.myQuery,
                method: this.verb,
                data: JSON.stringify(this.bodyJs), //Only for POST/PUT
                contentType: 'application/json', //Only for POST/PUT
                success: (res:T, textStatus:string, jqXHR:XMLHttpRequest) => {
                    console.log("call ", this.verb, this.myPath + this.myQuery, " => ", res);
                    resolve(res);
                },
                error: (jqXHR:XMLHttpRequest, textStatus:string, errorThrow:string) => {
                    console.log(textStatus, errorThrow, jqXHR);
                    reject({message: errorThrow});
                },
            };

            $.ajax(settings);
        });
    }

    path(...paths:string[]) {
        this.myPath = paths.join('');
        if (this.myPath.indexOf('/') !== 0)
            this.myPath = '/' + this.myPath;
        return this
    }

    query(queryDict:{[index: string]: string }) {
        this.myQuery = Req.toQueryString(queryDict);
        return this;
    }

    body(body:JSON) {
        this.bodyJs = body;
        return this;
    }

    static get(...paths:string[]) {
        return new Req("GET").path(... paths);
    }

    static post(...paths:string[]) {
        return new Req("POST").path(... paths);
    }

    static delete(...paths:string[]) {
        return new Req("DELETE").path(... paths);
    }

    static put(...paths:string[]) {
        return new Req("PUT").path(... paths);
    }

    static toQueryString(queryDict:{[index: string]: string }):string {
        var res:string[] = [];
        for (var key in queryDict) {
            var valEscaped = encodeURIComponent(queryDict[key]);
            res.push(key + "=" + valEscaped);
        }
        if (res)
            return '?' + res.join('&');
        return "";
    }

}


