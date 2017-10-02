
declare var params: any;

var frame = params.frame;
var base_url = params.base_url;

var send = function(name: string, data: any){
    data.m = name;
    frame.contentWindow.postMessage(data, '*');
};

var receive = function(name: string, fct: (name: string, data: any)=>any){

    var handler = function(e: MessageEvent){
        if(e.origin !== base_url) return;
        if(e.data.m !== name) return;

        var e_name = e.data.m;
        var e_data = e.data;
        delete e.data.m;

        fct(e_name, e_data);
    };

    window.addEventListener('message', handler);

};


function getCssStyles(){
    var res: string = "";

    var sheets = document.styleSheets;
    for(var s = 0; s < sheets.length; s++){
        var curSheet: any = sheets[s];
        var rules = curSheet.rules || curSheet.cssRules;
        if(rules === null) continue;
        for(var r = 0; r < rules.length; r++){

            res += rules[r].cssText;
        }
    }

    return '<style>' + res + '</style>';
}


function setElemFullScreen(elem: HTMLElement){
    //Be sure the body margin is 0
    document.body.style.margin = "";

    elem.style.position = "fixed";
    elem.style.top = "0px";
    elem.style.bottom = "0px";
    elem.style.right = "0px";
    elem.style.width = "100%";
    elem.style.height = "100%";
    elem.style.border = "none";
    elem.style.margin = "0";
    elem.style.padding = "0";
    elem.style.overflow = "hidden";
    elem.style.zIndex = "999999";
}

//var whole_html = document.documentElement.outerHTML;
var html: string = document.getElementsByTagName("body")[0].innerHTML;

var current_url: string = window.location.href;

var style: string = getCssStyles();

var name: string = document.title;


send('html_content', {content:html, url:current_url, style:style, name:name});

receive('changeUrl', function(name: string, data: any){
    window.location.href = data.url;

    //Don't work as it is
    //frame.src = data.url;
    //setElemFullScreen(frame);

} );
