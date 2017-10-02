let React = require('react');
let {OverlayTrigger, Tooltip, Button, Navbar, Nav, NavItem} = require('react-bootstrap');
var {Link, Navigation} = require('react-router');


export default class TopBar extends React.Component {

    static contextTypes = {
        router: React.PropTypes.func
    };

    state = {user: {status:'NOT_LOADED'}, searchText: ''};

    constructor(props, context){
        super(props, context);
        this.context = context;
        this.state['searchText'] = props.searchText;
        //console.log(props);
    }

    componentDidMount(){
        $.get('/user/current', (user)=>{ this.setState({user}); })
    }
    onSearchChange(event){
        let searchText = event.target.value;
        this.setState({searchText});
    }

    onSearchClick(event){
        this.context.router.transitionTo('search', undefined, {searchText: this.state.searchText});
    }

    calculatedLink(){
        let base_url = window.wc_URL; //See views/ng2
        let full_url = `${base_url}/load?url=`;
        return `javascript:(function(){open('${full_url}'+encodeURIComponent(window.location.href),'_self').focus();}());`;
    }

    render(){
        let s = this.state.user.status;
        let show_logout = s !== 'NOT_LOADED' && s !== 'NO_AUTHENTIFICATION';
        let show_sign = s === 'NO_AUTHENTIFICATION';
        let show_name = s === 'EMAIL';
        let name = this.state.user.name;

        //The tooltip id is here otherwise I got a warning
        let tooltip = <Tooltip placement="bottom" className="in" id="link_tooltip">Slide this link to your bookmark bar</Tooltip>;

        return <nav className="navbar navbar-default">
            <div className="container-fluid">
                <div className="navbar-header">
                    <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                            data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>

                    <Link to="/" className="navbar-brand" style={{padding:'0px'}}>
                        <img alt="Brand" width="100" height="50" src="http://i62.tinypic.com/2a97k1z.png"/>
                    </Link>

                </div>

                <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">

                    <ul className="nav navbar-nav">
                        <li>
                            <OverlayTrigger placement='bottom' overlay={tooltip}>
                            <a href={this.calculatedLink()} alt="Slide to your bookmark bar">
                                <span className="glyphicon glyphicon-link" aria-hidden="true" style={{marginLeft:'30px', marginRight:'5px'}}></span>
                                WWC Comment this page
                            </a>
                            </OverlayTrigger>
                        </li>
                    </ul>

                    <form className="navbar-form navbar-left" role="search" style={{marginLeft:'30px'}}>
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="Search" value={this.state.searchText} onChange={(event) => this.onSearchChange(event)}/>
                        </div>
                        <button type="submit" className="btn btn-default" style={{marginLeft:'5px'}} onClick={(event) => this.onSearchClick(event)}>Submit</button>
                    </form>

                    <ul className="nav navbar-nav navbar-right">

                            <li>
                                <p className="navbar-text navbar-right" style={{marginRight: '5px'}}>
                                    {show_name && <a href="#" className="navbar-link">Signed in as {name}</a>}
                                    {!show_name && "User as Unknown"}
                                </p>

                            </li>

                        <li className="dropdown">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true"
                               aria-expanded="false">

                                <span className="glyphicon glyphicon-user" aria-hidden="true"></span>


                                <span className="caret"></span></a>
                            <ul className="dropdown-menu">
                                <li><a href="#">
                                    <span className="glyphicon glyphicon-cog" aria-hidden="true" style={{paddingRight: '5px'}}></span>
                                    Settings

                                </a></li>
                                <li><a href="#">Another action</a></li>
                                <li><a href="#">Something else here</a></li>
                                <li role="separator" className="divider"></li>

                                {show_logout && <li>Logout</li>}
                                {show_sign && <li><Link to="sign_in">Sign Up</Link></li>}
                                {show_sign && <li><Link to="sign_up">Sign in</Link></li>}

                            </ul>
                        </li>
                    </ul>


                </div>
            </div>
        </nav>;


    }
}

