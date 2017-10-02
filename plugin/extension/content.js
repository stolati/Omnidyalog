console.log('here am i');

// let base_url = 'http://localhost:8080';
let base_url = 'http://www.omnidyalog.com';



function nodeList2array(input){
    let arr = [];
    for(let i = 0; i < input.length; i++){
        arr.push(input.item(i));
    }
    return arr;
}

function text2node(txt) {
    var div = document.createElement('div');
    div.innerHTML = txt;
    return nodeList2array(div.childNodes);
}

var iframe_style = '' +
    'width:100%; ' +
    'height:100%;';

var iframe = '<iframe id="WebCommentIframe" style="' + iframe_style + '"></iframe>';

var div_style = '' +
    'width:250px; ' +
    'height:100%; ' +
    'background:#F0F8FF; ' +
    'color:#FFF; ' +
    'padding:5px 2px; ' +
    'text-align:center; ' +
    'top:0; ' +
    'position:fixed; ' +
    'right:0; ' +
    'z-index: 9999999999;';

var div_node = '<div style="' + div_style + '">' + iframe + '</div>';
var c1 = window.location.host === 'localhost:8080';
var c2 = window.location.host === 'mail.google.com';
var c3 = window.location.host === 'www.google.com' && window.location.pathname === '/_/chrome/newtab';
if (!(c1 || c2 || c3)) {
    var nodes = text2node(div_node);
    for(let node of nodes){
        document.body.appendChild(node);
    }
    var url = `${base_url}/pages/show?url=` + encodeURIComponent(window.location.toString());
    var iframeNode = document.getElementById("WebCommentIframe");
    iframeNode.src = url;
}

