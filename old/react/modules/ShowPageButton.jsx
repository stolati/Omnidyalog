let React = require('react');
let {Button, Navbar, Nav, NavItem} = require('react-bootstrap');
let {Link} = require('react-router');


import ZoneSelection from './ZoneSelection';
import LinkPopoverBox from './LinkPopoverBox';

//From https://stackoverflow.com/questions/4588119/get-elements-css-selector-without-element-id
//For a full list of css selector : http://www.w3schools.com/cssref/css_selectors.asp
//TODO get a better one, less likely to break for small page change
//TODO get a one using the webcomponents (because there are some special css for going into components)
function fullPath(el) { //TODO use real object types
    let names = [];
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


export default class ShowPageButton extends React.Component {

    static propTypes = {};
    static defaultProps = {};

    state = {
        data: [],
        select_mode: false,
        content: null
    };

    constructor(props){
        super(props);
    }

    refreshData(pageId){
        console.log(this.props);
        $.get(`/page/${pageId}/comment`, data => {

            //Group the comment by selector
            let data_by_selector = {};
            for(let d of data){
                let sel = d.selector;
                console.log(sel);
                if(!(sel in data_by_selector))
                    data_by_selector[sel]  = [];

                data_by_selector[sel].unshift(d);
            }

            this.setState({data: data_by_selector});
        });
    }

    componentDidMount(){
        this.refreshData(this.props.pageId);
    }

    componentWillReceiveProps(nextProps){
        this.refreshData(nextProps.pageId);
    }

    onButtonClick(event){
        this.setState({select_mode: ! this.state.select_mode});
        console.log('Button on click');
        //TODO
    }

    setContent(showPage){ //TODO change that, we should not get stuff from parent directly
        this.setState({content:showPage});
    }

    elemSel(e){
        console.log('element selected : ', e, fullPath(e));
        this.setState({select_mode: false});
    }

    onPageRender(pageRender){
        console.log('onPageRender', pageRender);
        return pageRender;
    }

    render(){
        return <div>
            <span style={{position: 'fixed', top: '5px', left: '5px', display: 'block', zIndex: '99999'}}>
                <button type="button" className="btn btn-default btn-lg" arial-label="Left Align" onClick={(event) => this.onButtonClick()}>
                    {this.state.select_mode ? "Cancel" : "Add comment"}
                </button>
            </span>
            <ZoneSelection content={this.state.content} showing={this.state.select_mode} onElementSelected={(e) => this.elemSel(e)}/>
            {Object.keys(this.state.data).map((dataKey) => {
                return <LinkPopoverBox path={dataKey} key={dataKey} content={this.state.content} />
            })}
        </div>;

/*
<wc-comment-page [target]="content" (selected)="selected($event)" [select-mode]="inSelection"></wc-comment-page>
    <wc-comments [target]="addingComment" [pageid]="_pageId" (added)="commentAdded()"></wc-comments>
        <div *ng-for="#com of comment_keys">
            <wc-comments [targetpath]="com" [pageid]="_pageId" [comments]="comments[com]" (added)="commentAdded()"></wc-comments>
*/
    }
}

