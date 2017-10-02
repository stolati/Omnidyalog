let React = require('react');
let {Button, Navbar, Nav, NavItem} = require('react-bootstrap');
let {Link} = require('react-router');


class TargetSize {

    constructor(element) {
        this.element = element;

        this.offset = element.getBoundingClientRect();
        this.height = this.offset.height;
        this.width = this.offset.width;
        this.top = this.offset.top;
        this.left = this.offset.left;
    }

}


//TODO set the click on the currently selected object
//So it won't handle the action
//event.stopPropagation(); event.stopImmediatePropagation(); event.preventDefault();
//Maybe register the element under the mouse each time, So we have more power when stopping propagation ?
//and use informations from : https://stackoverflow.com/questions/446892/how-to-find-event-listeners-on-a-dom-node

//We can also change link and button actions

export default class ZoneSelection extends React.Component {
    //From page : https://jsfiddle.net/rFc8E/9/

    static propTypes = {};
    static defaultProps = {
        showing: false,
        content: null,
        onElementSelected: ()=>{},
    };

    state = {
        data: [],
        target: null,
        htmlContent: null,
        targetSize: null,
    };

    constructor(props){
        super(props);
        this.eventM = (e) => this.onMouseMove(e);
        this.eventC = (e) => this.onMouseClick(e);
    }

    componentWillReceiveProps(nextProps){
        console.log('change props : ', nextProps);

        //remove everything from old values
        if(this.state.htmlContent){
            this.state.htmlContent.removeEventListener("mousemove", this.eventM);
            this.state.htmlContent.removeEventListener("click", this.eventC);
            this.setState({target:null, targetSize: null});
        }

        if(nextProps.content) {
            var domNode = React.findDOMNode(nextProps.content);
            this.setState({htmlContent: domNode});

            if(nextProps.showing){
                domNode.addEventListener("mousemove", this.eventM);
                domNode.addEventListener("click", this.eventC);
            }

        } else {
            this.setState({htmlContent: null});
        }


    }

    onMouseMove(event) {
        let elem = event.target;
        if(!this._selectable(elem)) return;
        this.setState({
            target: elem,
            targetSize: new TargetSize(elem)
        });
    }

    onMouseClick(event){
        let elem = event.target;
        if(!this._selectable(elem)) return;
        this.props.onElementSelected(elem);
    }


    _selectable(e) {
        if (e.tagName === 'body') return false;
        if (e.tagName === 'html') return false;
        return true;
    }


    render(){
        if(!this.props.showing || !this.state.target || !this.state.targetSize)
            return null;

        let t = this.state.targetSize;

        let basicStyle = ()=>{return {background: 'blue', height:'3px', width:'3px', position: 'fixed', 'zIndex': '999999'};};
        let upStyle = {left:(t.left-4)+'px', top:(t.top-4)+'px', width:(t.width+5)+'px'};
        let downStyle = {top:(t.top+t.height+1)+'px', left:(t.left-3)+'px', width:(t.width+4)+'px'};
        let leftStyle = {top:(t.top-4)+'px', left:(t.left-5)+'px', height:(t.height+8)+'px'};
        let rightStyle = {top:(t.top-4)+'px', left:(t.left+t.width+1)+'px', height:(t.height+8)+'px'};
        upStyle = Object.assign(basicStyle(), upStyle);
        downStyle = Object.assign(basicStyle(), downStyle);
        leftStyle = Object.assign(basicStyle(), leftStyle);
        rightStyle = Object.assign(basicStyle(), rightStyle);

        return <div style={{display:'inline'}}>
            <div style={upStyle}/>
            <div style={downStyle}/>
            <div style={leftStyle}/>
            <div style={rightStyle}/>
        </div>;

    }

}


