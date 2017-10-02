let React = require('react');
let {Button, Navbar, Nav, NavItem} = require('react-bootstrap');
let {Link} = require('react-router');

export default class MostUsed extends React.Component {

    static propTypes = {};
    static defaultProps = {};

    state = { data: [] };

    constructor(props){
        super(props);
        this.state = { data: [] };
    }

    componentWillReceiveProps(nextProps){
        console.log('change props : ', nextProps);
        this.setState({searchText: nextProps.searchText});
    }

    componentDidMount(){
        $.get('/page/most_commented', (data)=>{ this.setState({data}); })
    }

    limitUrl(url /* : string */){
        let limit = 60;
        url = url.replace(/^https?:\/\//, "");

        if(url.length < limit) return url;
        return url.slice(0, limit - 3) + '...';
    }

    render(){
        return <div style={{margin: '20px'}}>
            <ul className="list-group" style={{maxWidth: '600px'}}>
                <li className="list-group-item active">Most commented pages</li>

                { this.state.data.map((x) => {
                    let oid = x.page.id.$oid;
                    let url_small = this.limitUrl(x.page.url);

                    return <li className="list-group-item" key={oid}>
                        <Link to={`/page/${oid}`}>
                        <span><span className="badge">{x.nbComment}</span></span>
                        <span style={{fontSize: 'large', paddingLeft: '5px', paddingRight: '5px'}}>{x.page.name}</span>
                        <span style={{fontSize: 'small', color: 'grey', textAlign: 'right'}}
                              align="right">{url_small}</span>
                            </Link>
                    </li>;
                })}

            </ul>
        </div>
    }
}

