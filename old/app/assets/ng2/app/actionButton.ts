
import {NgIf, Component, View}  from 'angular2/angular2';

//Global variables needed
declare let wc_HTTP_URL:string;
declare let wc_HTTPS_URL:string;
declare let wc_ACTION_BUTTON_URL:string;
declare let $: any;


@Component({
    selector: 'wc-action-button',
    properties: ['code_path'],
})
@View({
    //templateUrl: './assets/ng2/app/actionButton.html',
    directives: [NgIf],
    template: `
        <a [href]="'javascript:' + code" *ng-if="visible"><content></content></a>
    `,
})
export class ButtonActionComponent {
    code:string = "alert('not loaded yet')";
    visible:boolean = false;
    template_code: string = undefined;
    _code_path = 'standalone/code.js';

    constructor() {

        $(document).ready(() => {

            $.ajax({
                url: wc_ACTION_BUTTON_URL,
                type: 'get',
                dataType: 'html', //if we don't put anything, it will execute the code
                success: (html:string) => {
                    this.template_code = html;
                    this.state_changed();
                }
            });
        });

    }

    set code_path(new_code_path: string){
        this._code_path = new_code_path;
        this.state_changed();
    }

    state_changed(){
        if(!this._code_path) return;
        if(!this.template_code) return;


        var code = this.template_code
            .replace('$base_url_http', wc_HTTP_URL)
            .replace('$base_url_https', wc_HTTPS_URL)
            .replace('$code_path', this._code_path);
        this.code = code;
        this.visible = true;
    }


}

