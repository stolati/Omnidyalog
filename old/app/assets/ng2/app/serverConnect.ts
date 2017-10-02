
import {Req} from './http';


//TODO I want to duplicate that part
//So create a class that can take a request parameter
//One will be the angularJs one
//The other one will go through iframe

/*
Server objects


 */


export declare module servObj {

    export interface Page {
        _id: ObjectId;
        url: string;
        name: string;
        content?: string;
        style?: string;
    }

    export interface ObjectId {
        $oid: string;
    }

    export interface PageComment {
        _id: ObjectId;
        pageId: ObjectId;
        selector: string;
        content: string;
    }

}


export module servCall {

    //pages
    export function delPage(pageId: string){ return Req.delete(`page/${pageId}`).call(); }
    export function getPages(){ return Req.get('page').call<servObj.Page[]>(); }
    export function getPage(pageId: string, full: boolean = false){
        return Req.get(`page/${pageId}`).query({full: full.toString()}).call<servObj.Page>();
    }

    export function createComment(pageId: string, selector: string, content:string ){
        var body = <JSON><any>{
            'selector': selector,
            'content': content,
        };
        return Req.post(`page/${pageId}/comment`).body(body).call();
    }

    export function getComments(pageId: string){
        return Req.get(`page/${pageId}/comment`).call<servObj.PageComment[]>()
    }

}





















