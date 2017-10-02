
import {NgIf, Component, View}  from 'angular2/angular2';

//Global variables needed
declare var wc_HTTP_URL:string;
declare var wc_HTTPS_URL:string;
declare var wc_ACTION_BUTTON_URL:string;
declare var wc_ACTION_BUTTON_LINK_URL:string;
declare var $: any;


@Component({
    selector: 'wc-action-button-link',
})
@View({
    //templateUrl: './assets/ng2/app/actionButton.html',
    directives: [NgIf],
    template: `
        <a [href]="'javascript:' + code" *ng-if="visible"><content></content></a>
    `,
})
export class ButtonActionLinkComponent {
    code:string = "alert('not loaded yet')";
    visible:boolean = false;

    constructor() {
        var myThis = this; //There should be a better way

        $(document).ready(function () {

            $.ajax({
                url: wc_ACTION_BUTTON_LINK_URL,
                type: 'get',
                dataType: 'html', //if we don't put anything, it will execute the code
                success: (html:string) => {
                    myThis.setCode(html);
                }
            });
        });


        /*var button_js = '@routes.Assets.versioned("javascripts/button.js")';

         $('.action_button').hide();
         */
    }

    setCode(code:string) {
        code = code.replace('$base_url_http', wc_HTTP_URL);
        code = code.replace('$base_url_https', wc_HTTPS_URL);
        this.code = code;
        this.visible = true;

        //$('.action_button').attr('href', 'javascript:' + html).show();
    }

}

