

import {Component, View, EventEmitter, NgIf}  from 'angular2/angular2';
import {CommentPageComponent} from './commentPage';
import {PageShowContentComponent} from './pageShowing';
import {fullPath} from './domHelper';

@Component({
    selector: 'wc-adding-comment-popin',
    properties: ['pageId: page-id', 'target'],
})
@View({
    //templateUrl: './assets/ng2/app/actionButton.html',
    directives: [NgIf],
    template: `
    <div class="input-group">
      <input type="text" class="form-control" placeholder="Your comment here">
      <span class="input-group-btn">
        <button class="btn btn-default" type="button">OK</button>
        <button class="btn btn-default" type="button">Cancel</button>
      </span>
    </div>
    <wc-get-element></wc-get-element>
    `,
})
export class AddingCommentPopinComponent {
    pageId: string = undefined;
    _target: HTMLElement = undefined;

    constructor() {



    }

    set target(t: HTMLElement){
        if(!t) return;
    }


}

