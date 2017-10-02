import {Observable, Component, View, NgFor, NgIf, EventEmitter}  from 'angular2/angular2';

//TODO have style on this element

class TargetSize {
    element:HTMLElement;
    offset:ClientRect;
    height:number = 0;
    width:number = 0;
    top:number = 0;
    left:number = 0;

    constructor(element:HTMLElement = window.document.body) {
        this.element = element;

        this.offset = element.getBoundingClientRect();
        this.height = this.offset.height;
        this.width = this.offset.width;
        this.top = this.offset.top;
        this.left = this.offset.left;
    }

}


@Component({
    selector: 'wc-comment-page',
    properties: ['target', 'selectMode: select-mode'],
    events: ['selected'],
})
@View({
    templateUrl: './assets/ng2/app/commentPage.html',
    directive: [NgIf],
})
export class CommentPageComponent {
    //From page : https://jsfiddle.net/rFc8E/9/
    inSelection:boolean = false;
    t:TargetSize = new TargetSize();
    eventF:(e:MouseEvent) => any = undefined;
    eventC:(e:MouseEvent) => any = undefined;
    selectedElement:HTMLElement = undefined;

    selected:EventEmitter = new EventEmitter();

    target:HTMLElement = document.documentElement;


    constructor() {
        this.eventF = (e:MouseEvent) => {
            this.onMouseMove(e)
        };
        this.eventC = (e:MouseEvent) => {
            this.onClick(e)
        };

    }

    set selectMode(active: boolean){
        this.inSelection = active;

        //In case the button who launch the selection is part of selection
        //It grab the eventlistener
        window.setTimeout(() => {
            this.setEventListener()
        }, 0);
    }

    setEventListener() {
        //set them in a timeout so the add event listener won't be used
        if(!this.target) return;

        if (this.inSelection) {
            this.target.addEventListener("mousemove", this.eventF);
            this.target.addEventListener("click", this.eventC);
        } else {
            this.target.removeEventListener("mousemove", this.eventF);
            this.target.removeEventListener("click", this.eventC);
        }

    }

    _selectable(e:HTMLElement) {
        if (e.tagName === 'body') return false;
        if (e.tagName === 'html') return false;
        return true;
    }

    onMouseMove(event:MouseEvent) {
        var eventtarget:HTMLElement = <HTMLElement> event.target;
        if (!this._selectable(eventtarget)) return;

        this.t = new TargetSize(eventtarget);
    }

    onClick(event:MouseEvent) {
        var eventTarget:HTMLElement = <HTMLElement> event.target;

        //try to not propagate, but with dificulty
        if (this._selectable(eventTarget)) {
            this.selectMode = false;

            this.onSelectElement(eventTarget);

            event.stopPropagation();
            event.stopImmediatePropagation();
            event.preventDefault();

            //Maybe register the element under the mouse each time, So we have more power when stopping propagation ?
            //todo use informations from : https://stackoverflow.com/questions/446892/how-to-find-event-listeners-on-a-dom-node
        }
    }

    onSelectElement(elem:HTMLElement) {
        this.selectMode = false;
        this.selected.next(elem);
    }

}

