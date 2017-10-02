import {Component, View, NgFor}  from 'angular2/angular2';
import {servObj, servCall} from './serverConnect';


// Annotation section
@Component({
    selector: 'wc-page-list',
})
@View({
    //templateUrl: './assets/ng2/app/pageList.html',
    directives: [NgFor],
    template: `
<h1>List pages</h1>
<ul>
    <li *ng-for="#curUrlShow of data">
        <a [href]="'#/showPage/' + curUrlShow._id.$oid">{{curUrlShow.name}}</a>

        <button (click)="onDelete(curUrlShow._id.$oid)" type="button" class="btn btn-default btn-xs" aria-label="Left Align">
            <span (click)="onDelete(curUrlShow._id.$oid)" class="glyphicon glyphicon-remove" aria-hidden="true"></span>
        </button>
    </li>
</ul>
`,
})
// Component controller
export class PageListComponent {
    name:string;
    urls:Array<string>;
    data:servObj.Page[];

    constructor() {
        this.name = 'Alice';
        this.data = [];

        this.loadinfo();
    }

    loadinfo() {
        servCall.getPages().then((res) => {
            this.data = res;
        })
    }

    onDelete(id:string) {
        servCall.delPage(id).then(() => {
            this.loadinfo();
        });
    }

}

