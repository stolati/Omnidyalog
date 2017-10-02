import {Component, View, EventEmitter, NgIf, NgFor}  from 'angular2/angular2';
import {TooltipComponent} from './genericComponents/Tooltip';
import {fullPath} from './domHelper';
import {servCall, servObj} from './serverConnect';
import {UID} from './domHelper';

@Component({
    selector: 'wc-comments',
    properties: ['target', 'targetpath', 'pageid', 'comments'],
    events: ['added'],
})
@View({
    //templateUrl: './assets/ng2/app/actionButton.html',
    directives: [NgIf, NgFor, TooltipComponent],
    template: `
<wc-tooltip [target]="_target">
    <div [style.width]="'300px'" [style.background-color]="'white'" [style.border]="'5px solid black'">
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
</wc-tooltip>
    `,
})
export class CommentsComponent {
    _target: Element;
    _targetpath: string;
    targetPath: string;
    pageId: string;
    comments: any;
    inputUid = new UID<HTMLInputElement>();
    added = new EventEmitter();

    constructor() {
    }

    set target(target: HTMLElement){
        //Used when creating a brand new one
        this._target = target;
        this._targetpath = target ? fullPath(this._target) : undefined;
    }

    set targetpath(targetpath: string){
        this._targetpath = targetpath;
        this._target = targetpath ? document.querySelector(targetpath) : undefined;
    }

    set pageid(pageid: string){
        this.pageId = pageid;
    }

    sendComment(){
        var content = this.inputUid.elem.value;
        console.log('sending comment', content);
        if(!content) return;
        servCall.createComment(this.pageId, this._targetpath, content).then(() => {
            console.log('added element, call the event', this.added);
            this.added.next(null);
        });
        this.inputUid.elem.value = "";
    }

    inputKey(event: KeyboardEvent){
        if (event.which == 13 || event.keyCode == 13){
            //Enter
            this.sendComment();
        }
    }

}


