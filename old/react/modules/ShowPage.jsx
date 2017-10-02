let React = require('react');
let {Link} = require('react-router');

export default class ShowPage extends React.Component {

    static propTypes = {};
    static defaultProps = {
        onPageRender: (e)=> {
            return e
        },
        pageId: ''
    };

    state = {
        page_content: "loading...",
        page_style: ""
   };

    constructor(props) {
        super(props);
    }

    refreshData(pageId) {
        $.get(`/page/${pageId}`, {full: 'true'}, (data) => {
            this.setState({page_content: data.content, page_style: data.style});
        });
    }

    generateHtml() {
        //We are putting a scope to the style
        //So it won't affect the whole page
        let style_txt = this.state.page_style.replace(/<\w*style/ig, '<style scoped="scoped" '); //TODO check completness (or do something server side)
        let html_txt = this.state.page_content;

        return {__html: style_txt + html_txt};
    }

    componentDidMount() {
        this.refreshData(this.props.pageId);
    }

    componentWillReceiveProps(nextProps) {
        this.refreshData(nextProps.pageId);
    }

    render() {
        return <div dangerouslySetInnerHTML={this.generateHtml()}/>;
    }

}

