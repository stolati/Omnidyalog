///<reference path="../../typings/tsd.d.ts"/>
import {EventEmitter, Parent, Component, View, bootstrap, NgIf, Inject, forwardRef}  from 'angular2/angular2';

//From : https://github.com/erikringsmuth/app-router/blob/master/src/app-router.js

declare var $:any;


@Component({
    selector: 'wc-routers',
    events: ['change'],
})
@View({
    template:`
        <div>
            <content></content>
        </div>
    `
})
export class RoutersComponent {
    routers: RouterComponent[] = [];
    data: {} = {};
    change: EventEmitter = new EventEmitter();

    constructor(){
        $(window).on('hashchange', () => { this.onHashChange() });
    }

    _addRouter(router: RouterComponent){
        this.routers.push(router);
        this.onHashChange(); //TODO optimize that
    }

    onHashChange() {
        var found = false;
        var newData = {};

        for(var i=0; i < this.routers.length; i++){
            var curRouter = this.routers[i];
            if(found){
                curRouter.isGood = false;
                continue;
            }

            var r = Utilities.testRoute(curRouter._urlPatt);
            curRouter.isGood = found = (r !== undefined);
            if(!found)
                continue;

            curRouter.setData(r);
            newData = r;
        }

        if(JSON.stringify(newData) !== JSON.stringify(this.data)){
            this.data = newData;
            this.change.next(newData);
        }

    }

}




// Annotation section
@Component({
    selector: 'wc-router',
    properties: ['urlPatt: url-pattern',
        'datas',
        'trailingSlash: trailing-slash',
        'regex']
})
@View({
    directives: [NgIf],
    template: `
    <div *ng-if="isGood">
        <content></content>
    </div>
    `
})
// Component controller
export class RouterComponent {
    _urlPatt: string = '**';
    isGood: boolean = false;
    data:{[i: string]: any} = {};
    _trailingSlash: string = 'ignore';
    _regex: boolean = false;
    parent: RoutersComponent;

    //From : https://github.com/angular/angular/issues/2660
    constructor(@Parent() @Inject(forwardRef(() => RoutersComponent)) routers: RoutersComponent) {
        this.parent = routers;
        routers._addRouter(this); //Put it back once @Parent work
    }

    setData(data:{[i:string]: any}){
        this.data = data;
    }

    set regex(r: boolean){
        this._regex = r;
        this.parent.onHashChange();
    }

    set urlPatt(u: string){
        this._urlPatt = u;
        this.parent.onHashChange();
    }

    set trailingSlash(t: string){
        this._trailingSlash = t;
        this.parent.onHashChange();
    }

}




module Utilities {

    //Return undefined or a data array
    export function testRoute(route: string): {[i:string]: any} {
        var out: {[i:string]: any} = {};
        var routePatt = route.split('/');
        var routeLoc = window.location.hash.slice(1).split('/');

        if(route === '**') return {};

        if (routeLoc.length != routePatt.length) {
            return undefined;
        }

        for(var i =0 ; i < routeLoc.length; i++){
            var pattElem = routePatt[i];
            var locElem = routeLoc[i];

            if(pattElem.indexOf(':') === 0){
                out[pattElem.slice(1)] = locElem;
            } else if(pattElem === '*' || pattElem === locElem){
                continue
            } else {
                return undefined;
            }
        }

        return out;
    }

}

