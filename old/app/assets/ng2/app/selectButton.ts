import {Component, View, EventEmitter, NgIf, NgFor}  from 'angular2/angular2';
import {CommentPageComponent} from './commentPage';
import {PageShowContentComponent} from './pageShowing';
import {AddingCommentPopinComponent} from './addingCommentPopin';
import {fullPath} from './domHelper';
import {TooltipComponent} from './genericComponents/Tooltip'
import {CommentsComponent} from './comments';
import {servCall, servObj} from './serverConnect';

@Component({
    selector: 'wc-select-button',
    properties: ['pageId: page-id'],
})
@View({
    //templateUrl: './assets/ng2/app/actionButton.html',
    directives: [NgIf, NgFor, CommentPageComponent, PageShowContentComponent, CommentsComponent],
    template: `
<span style="position: fixed; top: 5px; left: 5px; display: block; z-index: 99999;" class="ws_comment_bypass">
    <button *ng-if="!inSelection"
            (click)="setSelectMode(true)" type="button" class="btn btn-default btn-lg" aria-label="Left Align" class="ws_comment_bypass">
        <span (click)="setSelectMode(true)" class="glyphicon glyphicon-plus" aria-hidden="true"class="ws_comment_bypass"></span>
        Add comment
    </button>
    <button *ng-if="inSelection"
            (click)="setSelectMode(false)" type="button" class="btn btn-default btn-lg" aria-label="Left Align" class="ws_comment_bypass">
        <span (click)="setSelectMode(false)" class="glyphicon glyphicon-remove" aria-hidden="true" class="ws_comment_bypass"></span>
        Cancel
    </button>
</span>
<wc-comment-page [target]="content" (selected)="selected($event)" [select-mode]="inSelection"></wc-comment-page>
<wc-comments [target]="addingComment" [pageid]="_pageId" (added)="commentAdded()"></wc-comments>
<div *ng-for="#com of comment_keys">
    <wc-comments [targetpath]="com" [pageid]="_pageId" [comments]="comments[com]" (added)="commentAdded()"></wc-comments>
</div>
<div #content>
    <wc-page-show-content [page-id]="_pageId" (changecompleted)="contentLoaded()" ></wc-page-show-content>
</div>
    `,
})
export class SelectButtonComponent {
    inSelection:boolean = false;
    addingComment:HTMLElement = undefined;
    _pageId:string = undefined;
    comments: {[i: string]: servObj.PageComment[]} = {};
    comment_keys: string[] = [];

    constructor() {
    }

    setSelectMode(active:boolean = true) {
        this.inSelection = active;
    }

    selected(elem:HTMLElement) {
        this.setSelectMode(false);

        this.addingComment = elem;
    }

    set pageId(pageId: string){
        this._pageId = pageId;
    }

    contentLoaded(){
        this.loadComments();
    }

    loadComments(){
        if(!this._pageId) return;
        servCall.getComments(this._pageId).then((res)=>{
            this.comments = {};

            for(var i=0; i < res.length; i++){
                var curVal = res[i];
                var l = this.comments[curVal.selector];
                if(!l) l = [];
                l.unshift(curVal);
                this.comments[curVal.selector] = l;
            }

            this.comment_keys = [];
            for(var key in this.comments){
                this.comment_keys.unshift(key);
            }

        });
    }

    commentAdded(){
        this.inSelection = false;
        this.addingComment = undefined;

        this.loadComments();
    }

}

