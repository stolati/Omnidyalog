///<reference path="../../typings/es6-promise/es6-promise.d.ts"/>


declare var params:any; //Because we are in a nameless function (see innerFrame for that)

var frame = params.frame;
var base_url = params.base_url;

var send = function (name:string, data:any) {
    data.m = name;
    frame.contentWindow.postMessage(data, '*');
};

var receive = function (name:string, fct:(name:string, data:any)=>any) {

    var handler = function (e:MessageEvent) {
        if (e.origin !== base_url) return;
        if (e.data.m !== name) return;

        var e_name = e.data.m;
        var e_data = e.data;
        delete e.data.m;

        fct(e_name, e_data);
    };

    window.addEventListener('message', handler);

};



/************
 *  I don't know/want to deal with common client functions yet (with ng2 and standalone code)
 *  So I put them here, and we'll se what's happen
 *  //TODO correct that fact in an intelligent way (when I have time)
 */

declare module Serv {

    type DateTime = string;

    interface Id {
        $oid: string;
    }

    interface CommentPush {
        selector: string;
        content: string;
    }

    interface CommentGet {
        selector: string;
        content: string;
        userId: Id;
        created: DateTime;
    }

    interface ResPage {
        url: string;
        name: string;
        id: Id;
        content?: string;
        style?: string;
    }

    interface PushPage {
        url: string;
        name: string;
        content: string;
        style: string;
    }

    interface PageExists {
        page?: ResPage;
    }

    interface MyUser {
        id: Id;
        status: string;
        email?: string;
    }

    interface SigningInfo {
        email: string;
        password: string;
    }

    interface Loging {
        email: string;
        password: string;
    }

}

interface CallerFct {
    <T>(verb:string, path:string, query?: any) : Promise<T>;
}

class Client {
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


/******
* End of duplicate code
*/

var _cli_call_id = 0;
var cli = new Client( <T>(verb: string, path: string, query: any = null): Promise<T> => {

    var cur_call_id = _cli_call_id++;
    var ret_name = "call_server_res_" + cur_call_id;

    send("call_server", {
        ret_name:ret_name,
        verb:verb,
        path:path,
        query:query,
    });

    return new Promise<T>((resolve, reject) => {
        receive(ret_name, (name:string, data:T) => {
            resolve(data);
        });
    })

});



/**
 * Because sometimes elements are added to the dom (like the StayFocusd plugin does for example)
 * We want to be more ... organic in our way to find the right element
 * Also in the page, as root we have an element with #root_body id, we want that to change
 * @param path query
 */
function getElementFromPath(path:String): HTMLElement {

    var path_arr = path.replace("#root_body", "BODY").split(">");

    for(var i =0; i < path_arr.length; i++){
        var cur_test = path_arr.slice(i);
        var elements = document.querySelectorAll(cur_test.join(">"))

        switch(elements.length){
            case 0:
                continue; // no elements, try harder
            case 1:
                return <HTMLElement>(elements[0]); //found it ! I Hope
            default:
                //TODO Found too much
                console.log("TODO found too much, should log it to server so we can improve algo");
                return <HTMLElement>(elements[0]); //guess
        }
    }

    //We havn't found anything ? really ?
    console.log("TODO log this one to server so we can improve algo");
    return <HTMLElement>(document.querySelectorAll("div")[0]);

}



function commentGet2commentWithElements(comments: Serv.CommentGet[]){

    var comments_by_selector: {[i: string]: Serv.CommentGet[]} = {};

    for(var cur_comment of comments){
        let selector = cur_comment.selector;
        if(selector in comments_by_selector){
            let cur_list = <any[]>(comments_by_selector[selector]);
            cur_list.unshift(cur_comment);
        } else {
            comments_by_selector[selector] = [cur_comment];
        }
    }

    var res: [HTMLElement, Serv.CommentGet[]][] = [];
    for(var selector in comments_by_selector){
        res.unshift([getElementFromPath(selector), comments_by_selector[selector]])
    }

    return res;

}





//TODO do a generic call/set for this part (use the servObj ?)
//TODO going with an iframe is really security hole, made it to work only for localhost

var loc = window.location.href;

cli.get_page_exists(window.location.href).then( (res: Serv.PageExists) => {
    console.log('############# page exists res : ', res);

    var havePage = !!res.page;

    if (!havePage) {
        console.log("We don't have comments on this page");
        return;
    }

    cli.get_comments(res.page.id).then( (comments: Serv.CommentGet[]) => {
        var commentsWithElem = commentGet2commentWithElements(comments);


        /*
            <div [style.width]="'300px'" style="background-color: white ; border: 5px solid black">
                <p *ng-for="#com of comments">
                  {{com.content}}
                </p>
                <div class="input-group">
                <input type="text" class="form-control" placeholder="Your comment here" [id]="inputUid.uid"
                    (keypress)="inputKey($event)"></input>
                    <span class="input-group-btn">
                        <button class="btn btn-default" type="button" (click)="sendComment()">OK</button>
                        <button class="btn btn-default" type="button">Cancel</button>
                    </span>
                    </div>
                </div>
        */





        console.log(commentsWithElem);

    });

});



