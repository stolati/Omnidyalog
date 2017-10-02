
///<reference path="../../typings/tsd.d.ts"/>
import {Component, View, bootstrap, NgFor}  from 'angular2/angular2';
import {fullPath} from './domHelper';
import {Req} from './http';
import {servObj, servCall} from './serverConnect';
import {CommentPageComponent} from './commentPage';
import {RouterComponent, RoutersComponent} from './router';
import {ButtonActionComponent} from './actionButton';
import {PageListComponent} from './pageList';
import {SelectButtonComponent} from './selectButton';
import {ButtonActionLinkComponent} from './actionButtonLink';

//For behaviour
//import {ShadowDomStrategy, NativeShadowDomStrategy} from 'angular2/render';
//import {bind} from 'angular2/di';

//Global variables needed
declare var wc_HTTP_URL:string;
declare var wc_HTTPS_URL:string;
declare var wc_ACTION_BUTTON_URL:string;


@Component({
    selector: 'wc-app',

})
@View({
    directives: [
        RouterComponent, RoutersComponent,
        ButtonActionComponent, PageListComponent, ButtonActionLinkComponent,
        CommentPageComponent, SelectButtonComponent
        ],
    template:`
        <wc-routers (change)="dataChange($event)">
            <wc-router url-pattern="/showPage/:pageId">
                <wc-select-button [page-id]="hashData.pageId"></wc-select-button>
            </wc-router>
            <wc-router url-pattern="**">
                <br/>
                <h3>Action button : </h3>
                <wc-action-button code_path="standalone/code">comment by upload</wc-action-button><br/>
                <wc-action-button-link>comment by link</wc-action-button-link><br/>
                <wc-action-button code_path="standalone/check_page">check page</wc-action-button><br/>
                <br/>

                <!-- The app component created in app.ts -->
                <wc-page-list></wc-page-list>

            </wc-router>
        </wc-routers>
    `
})
class AppComponent {
    hashData: {} = {};

    dataChange(event: {}){
        this.hashData = event;
    }

}


bootstrap(AppComponent);

//bootstrap(AppComponent [
//    bind(ShadowDomStrategy).toClass(NativeShadowDomStrategy)
//]);


