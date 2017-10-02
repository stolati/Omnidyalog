let React = require('react');
let {Link} = require('react-router');


export default function findElement(base_dom, css_selector){

    let mySplitSel = css_selector.split('>');

    for(let i =0; i< mySplitSel.length; i++){
        let try_css = mySplitSel.slice(i).join(' > ');
        let cur_res = document.querySelectorAll(try_css);

        if(cur_res.length != 0)
            return cur_res[0];
    }

    return base_dom;
}


/*
The goal of this box is to follow an element and have the same size at it
 */
export default class LinkPopoverBox extends React.Component {

    static propTypes = {};
    static defaultProps = {
        path : null,
        content : null,
    };

    state = {
        top: 100,
        left: 100,
        height: 100,
        width: 100
    };

    constructor(props) {
        super(props);
        console.log('started props', props);
        this.state = this.update_position();
    }

    componentWillReceiveProps(nextProps) {
        console.log('receiving new prop : ', nextProps);
        this.setState(this.update_position());
    }


    update_position() {
        if (!this.props.content || !this.props.path)
            return {};

        var domNode = React.findDOMNode(this.props.content);
        if (!domNode)
            return {};

        let elem = findElement(this.props.domNode, this.props.path);
        let rect = elem.getBoundingClientRect();

        //Update that every 2 seconds
        let fct = ()=> this.setState(this.update_position());
        setTimeout(fct, 200);

        return {
            height: rect.bottom - rect.top,
            top: rect.top,
            left: rect.left,
            width: rect.right - rect.left
        };

    }

    /*
     let basicStyle = ()=>{return {background: 'blue', height:'3px', width:'3px', position: 'fixed', 'zIndex': '999999'};};
     */

    render(){
        let style = {
            zIndex: '9999999', //For now, give a small index next time, like -1
            backgroundColor: 'blue',
            position: 'absolute',
            top: this.state.top + 'px',
            left: this.state.left + 'px',
            height: this.state.height + 'px',
            width: this.state.width + 'px'
        };
       return <div style={style}>This is a linkPopoverBox</div>
    }

}

