let React = require('react');
let {Button, Navbar, Nav, NavItem} = require('react-bootstrap');
let {Link} = require('react-router');

export default class SearchResult extends React.Component {

    static propTypes = {};
    static defaultProps = {};

    state = { data: [] };

    constructor(props){
        super(props);
    }

    refreshData(searchText){
        $.get('/page/find', {text: searchText}, (data) => {
            this.setState({data});
        });
    }

    componentDidMount(){
        this.refreshData(this.props.searchText);
    }

    componentWillReceiveProps(nextProps){
        this.refreshData(nextProps.searchText);
    }

    render(){
        let linkStyle = {width: '100%', display:'block', textDecoration: 'none', color:'black'};
        let linkElem = (oid, text) => {return <Link to={`/page/${oid}`} style={linkStyle}>{text}</Link>; };

        return <div style={{margin: '20px'}}>
            <ul className="list-group">
                {!!this.props.searchText && <li className="list-group-item active">Search result for : {this.props.searchText}</li>}
                {!this.props.searchText && <li className="list-group-item active">Search result for everything{this.props.searchText}</li>}

                <table className="table table-hover">
                    <thead><tr>
                            <th>name</th>
                            <th>url</th>
                    </tr></thead>

                    <tbody>

                    {this.state.data.map((curElem) => {
                        let oid = curElem.id.$oid;
                        return <tr key={oid}>
                            <td style={{textAlign: 'left'}}>{linkElem(oid, curElem.name)}</td>
                            <td>{linkElem(oid, curElem.url)}</td>
                        </tr>;
                     })}

                    </tbody>
                </table>

            </ul>
        </div>
    }
}

/*
SearchResult.defaultProps = {
    searchText: '',
    pageNumber: 0
};
    */