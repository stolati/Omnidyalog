import {Observable, Component, View, NgFor, NgIf, EventEmitter}  from 'angular2/angular2';
import {servObj, servCall} from './serverConnect';
import {UID} from './domHelper';

@Component({
    selector: 'wc-page-show-content',
    properties: ['pageId: page-id'],
    events: ['changecompleted'],
})
@View({
    //templateUrl: './assets/ng2/app/commentPage.html',
    directive: [NgIf],
    template: `
        <div id="wc-content-show"></div>
    `
})
export class PageShowContentComponent {
    _pageId: string = undefined;
    changecompleted = new EventEmitter();

    constructor() {
    }

    set pageId(pageId: string){
        if(this._pageId ===  pageId) return;
        this._pageId = pageId;
        this.clean();
        if(!this._pageId) return; //allows only valid pageId


        servCall.getPage(pageId, true).then((res:servObj.Page) => {
            this.clean();

            var myDiv = document.getElementById("wc-content-show");
            if(!myDiv) return; //not yet loaded ?

            //create the style
            var styleElem = document.createElement('div');
            styleElem.innerHTML = res.style;
            myDiv.appendChild(styleElem);

            //Create the content
            var contentElem = document.createElement('div');
            contentElem.setAttribute('id', 'root_body'); //special class name for setting the content limit
            contentElem.innerHTML = res.content;
            myDiv.appendChild(contentElem);

            this.changecompleted.next(null);
        });

}

    clean(){
        var myDiv = document.getElementById("wc-content-show");
        if(!myDiv) return; //not yet loaded ?

        //Emptying the div content
        var elements = myDiv.childNodes;
        for(var i=0; i < elements.length; i++)
            myDiv.removeChild(elements[i]);
    }

}

