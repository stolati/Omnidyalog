import {NgIf, Component, View}  from 'angular2/angular2';
import {UID} from '../domHelper';


/****
 * TODO the tooltip on boostrap use the css placement 'relative' which
 * place the element relatively from the container. But here we want to be able
 * to place it anywhere and keep the ng2 capabilities on both the goal and tooltip.
 * Which seems pretty hard.
 * So for now, we will hack it. And come back later for more.
****/

//TODO get more of https://github.com/twbs/bootstrap/blob/master/js/tooltip.js
//TODO get more of https://github.com/twbs/bootstrap/blob/master/js/popover.js
//TODO maybe we can use that ? https://stackoverflow.com/questions/104953/position-an-html-element-relative-to-its-container-using-css


//We can insert a invisible 0 by 0 div just after the element and ask its position
//Or have a event when the position change ?


//TODO Use the events resize and scroll ??

export enum Placement{ bottom, top, left, right, auto }


@Component({
    selector: 'wc-tooltip',
    properties: ['target', 'title', 'show']
})
@View({
    //templateUrl: './assets/ng2/app/actionButton.html',
    directives: [NgIf],
    template: `
        <div style="{position: relative; width: 0; height: 0}" *ng-if="_target">
            <div [id]="mainDivId.uid">
                <div class="arrow" [id]="arrowDivId.uid"></div>
                <h3 *ng-if="title" class="popover-title">{{title}}</h3>
                <div class="popover-content" [id]="contentDivId.uid">
                    <content></content>
                </div>
            </div>
        </div>
    `,
})
export class TooltipComponent {
    _target:HTMLElement;
    _show: boolean = false;
    title:string;
    observer = new MutationObserver((m, o) => this.contentChange(m, o));
    mainDivId = new UID<HTMLDivElement>();
    contentDivId = new UID<HTMLDivElement>();
    arrowDivId = new UID<HTMLDivElement>();
    placement = Placement.bottom;


    constructor() {
        (<any>window).tootipComponent = this;
    }

    set target(target:HTMLElement) {
        if (this._target === target) return;
        this._target = target;
        this.observer.disconnect();
        if(!this._target) return;

        //Leave the time to set everything at the starting
        setTimeout(()=>{

            this.observer.observe(this.contentDivId.elem, {
                childList: true,
                attributes: true,
                characterData: true,
                subtree: true,
            });

            this.contentChange(null, null);

        }, 0);

    }

    contentChange(mutations:MutationRecord[], observer:MutationObserver) {
        //Find the size of our element

        this.mainDivId.$elem.css({
            top: 0,
            left: 0,
            display: 'block',
            'z-index': 999998,
            position: 'absolute', //In bootstrap, it's relative
        }).addClass("bottom");


        //simplify because I don't want to loose more time on this
        //Will definitly come back for more pain

        var targetRect = this._target.getBoundingClientRect();

        //Put on bottom the element
        this.mainDivId.$elem.css({
            left: targetRect.left + window.pageXOffset,
            top: targetRect.bottom + window.pageYOffset,
        });

        return;

        var pos = this._getPosition(this.contentDivId.elem);
        var actualWidth = this.mainDivId.elem.offsetWidth;
        var actualHeight = this.mainDivId.elem.offsetHeight;


        var calculatedOffset = this._getCalculatedOffset(this.placement, pos, actualWidth, actualHeight);

        this._applyPlacement(calculatedOffset, this.placement);

    }

    _getPosition(el:HTMLElement) {
        var $el = $(el);

        var elRect = el.getBoundingClientRect();
        if (elRect.width == null) {
            // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
            elRect = $.extend({}, elRect, {width: elRect.right - elRect.left, height: elRect.bottom - elRect.top});
        }
        var elOffset = $el.offset();
        var scroll = {scroll: $el.scrollTop()};

        return $.extend({}, elRect, scroll, null, elOffset);
    }

    _getCalculatedOffset(placement:Placement, pos:any, actualWidth:number, actualHeight:number):any {
        if (placement === Placement.bottom)
            return {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2};
        if (placement === Placement.top)
            return {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2};
        if (placement === Placement.left)
            return {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth};
        if (placement === Placement.right)
            return {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width};
        throw new Error('unknown placemen [' + placement + ']');
    }

    _applyPlacement(offset:any, placement:Placement):void {

        var $el = this.mainDivId.$elem;
        var el = this.mainDivId.elem;

        var width = el.offsetWidth;
        var height = el.offsetHeight;

        // manually read margins because getBoundingClientRect includes difference
        var marginTop = parseInt($el.css('margin-top'), 10);
        var marginLeft = parseInt($el.css('margin-left'), 10);

        // we must check for NaN for ie 8/9
        if (isNaN(marginTop))  marginTop = 0;
        if (isNaN(marginLeft)) marginLeft = 0;

        offset.top += marginTop;
        offset.left += marginLeft;

        // $.fn.offset doesn't round pixel values
        // so we use setOffset directly with our own function B-0
        (<any>$).offset.setOffset(el, $.extend({
            using: function (props:any) {
                $el.css({
                    top: Math.round(props.top),
                    left: Math.round(props.left)
                })
            }
        }, offset), 0);

        $el.addClass('in');

        // check to see if placing tip in new offset caused the tip to resize itself
        var actualWidth = el.offsetWidth;
        var actualHeight = el.offsetHeight;

        if (placement === Placement.top && actualHeight != height) {
            offset.top = offset.top + height - actualHeight;
        }

        var delta = this._getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight);

        if (delta.left) {
            offset.left += delta.left;
        } else {
            offset.top += delta.top;
        }

        var isVertical = placement === Placement.top || placement === Placement.bottom;
        var arrowDelta = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight;

        var offsetDim = isVertical ? el.offsetWidth : el.offsetHeight;


        // Now apply for absolute purpose (change from boostrap)
        var targetDim = this._target.getBoundingClientRect();
        switch(placement){
            case Placement.bottom:
                offset.left += targetDim.right + window.pageXOffset;
                offset.top += targetDim.bottom + window.pageYOffset;
                break;

            default:
                throw new Error("placement ["+placement+"] unhandled");
        }

        $el.offset(offset);
        this._replaceArrow(arrowDelta, offsetDim, isVertical);
    }

    _replaceArrow(delta:number, dimension:number, isVertical:boolean) {
        this.arrowDivId.$elem
            .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
            .css(isVertical ? 'top' : 'left', '');
    }

    _getViewportAdjustedDelta(placement:Placement, pos:any, actualWidth:number, actualHeight:number):any {
        var delta = {top: 0, left: 0};

        var viewportPadding = 0; //old : this.options.viewport && this.options.viewport.padding || 0
        var viewportDimensions = this._getPosition(this.mainDivId.elem);

        if (placement === Placement.right || placement === Placement.left) {
            var topEdgeOffset = pos.top - viewportPadding - viewportDimensions.scroll;
            var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight;
            if (topEdgeOffset < viewportDimensions.top) { // top overflow
                delta.top = viewportDimensions.top - topEdgeOffset;
            } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
                delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset;
            }
        } else {
            var leftEdgeOffset = pos.left - viewportPadding;
            var rightEdgeOffset = pos.left + viewportPadding + actualWidth;
            if (leftEdgeOffset < viewportDimensions.left) { // left overflow
                delta.left = viewportDimensions.left - leftEdgeOffset;
            } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
                delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset;
            }
        }

        return delta;
    }

}

