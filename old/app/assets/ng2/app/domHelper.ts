import {EventEmitter}  from 'angular2/angular2';


//From https://stackoverflow.com/questions/4588119/get-elements-css-selector-without-element-id
//For a full list of css selector : http://www.w3schools.com/cssref/css_selectors.asp
//TODO get a better one, less likely to break for small page change
//TODO get a one using the webcomponents (because there are some special css for going into components)
export function fullPath(el:any) { //TODO use real object types
    var names:string[] = [];
    while (el.parentNode) {
        if (el.id) {
            names.unshift('#' + el.id);
            break;
        } else {
            if (el == el.ownerDocument.documentElement) names.unshift(el.tagName);
            else {
                for (var c = 1, e = el; e.previousElementSibling; e = e.previousElementSibling, c++);
                names.unshift(`${el.tagName}:nth-child(${c})`);
            }
            el = el.parentNode;
        }
    }
    return names.join(" > ");
}


export function observeDomChange(document:Node, callback:MutationCallback) {
    var obs = new MutationObserver(callback);
    obs.observe(document, {
        childList: true,
        attributes: true,
        characterData: true,
        subtree: true,
    });

    return obs;
}


/**
 * Not really a guid
 * From : https://jsfiddle.net/briguy37/2mvfd/
 */
export function genUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

export class UID<T extends HTMLElement> {
    uid = genUUID();

    constructor() {
    }

    toString() {
        return this.uid;
    }

    get elem():T {
        return <T>document.getElementById(this.uid);
    }

    get $elem():JQuery {
        return $(this.elem);
    }

}


//From http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection/
(function () {
    var attachEvent = (<any>document).attachEvent;
    var isIE = navigator.userAgent.match(/Trident/);
    var requestFrame = (function () {
        var raf = window.requestAnimationFrame || (<any>window).mozRequestAnimationFrame || (<any>window).webkitRequestAnimationFrame ||
            function (fn:any) {
                return window.setTimeout(fn, 20);
            };
        return function (fn:any) {
            return raf(fn);
        };
    })();

    var cancelFrame = (function () {
        var cancel = window.cancelAnimationFrame || (<any>window).mozCancelAnimationFrame || (<any>window).webkitCancelAnimationFrame ||
            window.clearTimeout;
        return function (id:any) {
            return cancel(id);
        };
    })();

    function resizeListener(e:any) {
        var win = e.target || e.srcElement;
        if (win.__resizeRAF__) cancelFrame(win.__resizeRAF__);
        win.__resizeRAF__ = requestFrame(function () {
            var trigger = win.__resizeTrigger__;
            trigger.__resizeListeners__.forEach(function (fn:any) {
                fn.call(trigger, e);
            });
        });
    }

    function objectLoad(e:any) {
        this.contentDocument.defaultView.__resizeTrigger__ = (<any>this).__resizeElement__;
        this.contentDocument.defaultView.addEventListener('resize', resizeListener);
    }

    (<any>window).addResizeListener = function (element:any, fn:any) {
        if (!element.__resizeListeners__) {
            element.__resizeListeners__ = [];
            if (attachEvent) {
                element.__resizeTrigger__ = element;
                element.attachEvent('onresize', resizeListener);
            }
            else {
                if (getComputedStyle(element).position == 'static') element.style.position = 'relative';
                var obj = element.__resizeTrigger__ = document.createElement('object');
                obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;');
                (<any>obj).__resizeElement__ = element;
                obj.onload = objectLoad;
                obj.type = 'text/html';
                if (isIE) element.appendChild(obj);
                obj.data = 'about:blank';
                if (!isIE) element.appendChild(obj);
            }
        }
        element.__resizeListeners__.push(fn);
    };

    (<any>window).removeResizeListener = function (element:any, fn:any) {
        element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
        if (!element.__resizeListeners__.length) {
            if (attachEvent) element.detachEvent('onresize', resizeListener);
            else {
                element.__resizeTrigger__.contentDocument.defaultView.removeEventListener('resize', resizeListener);
                element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__);
            }
        }
    }
})();


export class ResizeObserver {

    callback:() => any;
    target:Node;

    observe(target:Node, callback:() => any):void {
        this.callback = callback;
        this.target = target;

        (<any>window).addResizeListener(target, callback);
        document.addEventListener('scroll', this.callback);
        document.addEventListener('', this.callback);


    }

    disconnect() {
        if (!this.callback) return;

        (<any>window).removeResizeListener(this.target, this.callback);
        document.removeEventListener('scroll', this.callback);


        this.callback = undefined;
        this.target = undefined;
    }

}

/*
 callback : () => any = undefined;

 attachEvent = document.attachEvent;
 isIE = navigator.userAgent.match(/Trident/);

 observe(target: Node): void {

 }

 requestFrame(){
 var raf = window.requestAnimationFrame;

 }

 }
 */


