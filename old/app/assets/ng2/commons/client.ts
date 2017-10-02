/*** <objects> ***/

///<reference path="../../typings/tsd.d.ts"/>
export declare module Serv {

    export type DateTime = string;

    export interface Id {
        $oid: string;
    }

    export interface CommentPush {
        selector: string;
        content: string;
    }

    export interface CommentGet {
        selector: string;
        content: string;
        userId: Id;
        created: DateTime;
    }

    export interface ResPage {
        url: string;
        name: string;
        id: Id;
        content?: string;
        style?: string;
    }

    export interface PushPage {
        url: string;
        name: string;
        content: string;
        style: string;
    }

    export interface PageExists {
        page?: ResPage;
    }

    export interface MyUser {
        id: Id;
        status: string;
        email?: string;
    }

    export interface SigningInfo {
        email: string;
        password: string;
    }

    export interface Loging {
        email: string;
        password: string;
    }

}

/*** </objects> ***/

export class ClientCaller {
    verb:string = "GET";
    myQuery:string = "";
    myPath:string = "";
    bodyJs:JSON = undefined;

    constructor(verb:string) {
        this.verb = verb;
    }

    call<T>():Promise<T> {
        throw "Not implemented"; //To implement
    }

    static _getNew(verb:string) {
        throw "Not implemented";
    }

    path(path:string) {
        this.myPath = path.indexOf('/') !== 0 ? ('/' + path) : path;
        return this
    }

    query(queryDict:{[index: string]: string }) {
        this.myQuery = ClientCaller.toQueryString(queryDict);
        return this;
    }

    body(body:JSON) {
        this.bodyJs = body;
        return this;
    }

    static get(path:string) {
        return new ClientCaller("GET").path(path);
    }

    static post(path:string) {
        return new ClientCaller("POST").path(path);
    }

    static delete(path:string) {
        return new ClientCaller("DELETE").path(path);
    }

    static put(path:string) {
        return new ClientCaller("PUT").path(path);
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

/*** </objects> ***/

export interface CallerFct {
    <T>(verb:string, path:string, query?: any) : Promise<T>;
}

export class Client {

    caller_fct:CallerFct;

    constructor(caller_fct:CallerFct) {
        this.caller_fct = caller_fct;
    }

    post_page(fullPage:Serv.PushPage) { return this.caller_fct<Serv.Id>("POST", "page", fullPage); }
    get_page(id:Serv.Id, full:Boolean = false) { return this.caller_fct<Serv.ResPage>("GET", `page/${id.$oid}`, {'full': full.toString()}); }
    del_page(id:Serv.Id) { return this.caller_fct<any>("DELETE", `page/${id.$oid}`)}
    get_all_page(){ return this.caller_fct<Serv.ResPage[]>("GET", `page`); }

    post_comment(pageId: Serv.Id, comment: Serv.CommentPush){ return this.caller_fct("POST", `page/${pageId.$oid}/comment`,  comment); }
    del_comment(pageId: Serv.Id, commentId: Serv.Id){ return this.caller_fct("DELETE", `page/${pageId.$oid}/comment/${commentId.$oid}`); }
    get_comments(pageId: Serv.Id){ return this.caller_fct<Serv.CommentGet[]>("GET", `page/${pageId.$oid}/comment`) ; }
    get_comment(pageId: Serv.Id, commentId: Serv.Id){ return this.caller_fct<Serv.CommentGet>("GET", `page/${pageId.$oid}/comment/${commentId.$oid}`); }

    get_user_current(){ return this.caller_fct<Serv.MyUser>("GET", "user/current"); }
    post_user_signin(signingInfo: Serv.SigningInfo){return this.caller_fct<Serv.MyUser>("POST", "user/signin", signingInfo); }
    post_user_logout(){return this.caller_fct<any>("POST", "user/logout"); }
    post_user_login(loging: Serv.Loging){ return this.caller_fct<Serv.MyUser>("POST", "user/login", loging); }

    get_page_exists(pageUrl: String){  return this.caller_fct<Serv.PageExists>("GET", "page/exists", {"url":pageUrl}); }

}

