let React = require('react');

let Router = require('react-router');
let { Route, DefaultRoute, RouteHandler, Link } = Router;

import TopBar from './TopBar';
import MostUsed from './MostUsed';
import SignIn from './SignIn';
import SignUp from './SignUp';
import YourLastComment from './YourLastComment';
import SearchResult from './SearchResult';
import ShowPageButton from './ShowPageButton';
import ShowPage from './ShowPage';


class DefaultPage extends React.Component {
    //render(){ return <div><TopBar/><MostUsed/><YourLastComment/></div>; }
    render(){ return <div><TopBar/><MostUsed/></div>; }
}

class Toto extends React.Component {
    render(){ return <div>toto</div>; }
}

class DefaultShowPage extends React.Component {

    state = { myShowPage: null, myButton: null  };

    constructor(props){
        super(props);
        this.showPage = null;
        this.showButton = null;
    }

    updateValues(){
        console.log('updateValue', self.state);
        if(this.showPage && this.showButton){
            this.showButton.setContent(this.showPage);
        }
    }

    getting_showPage(showPage){
        this.showPage = showPage;
        this.updateValues();
    }

    getting_pageButton(pageButton){
        this.showButton = pageButton;
        this.updateValues();
    }

    onPageRender(e){
        console.log('on page render app');
        if(this.showButton){
            return this.showButton.onPageRender(e);
        }
        return e;
    }


    render(){
        let pageId = this.props.params.pageId;
        console.log('default show page', this.refs.content);
        return <div>
            <ShowPage pageId={pageId} ref={(sp)=>this.getting_showPage(sp)} onPageRender={(e)=>this.onPageRender(e)} />
            <ShowPageButton pageId={pageId} pageContent={this.refs.content} ref={(pb) => this.getting_pageButton(pb)}/>
            </div>;
    }
}

class MainSignIn extends React.Component {
    render(){ return <div><SignIn/></div>; }
}

class MainSignUp extends React.Component {
    render(){ return <div><SignUp/></div>; }
}

class SearchPageWrapper extends React.Component {
    render() {
        let searchText = this.props.query.searchText;
        return <div>
            <TopBar searchText={searchText}/>
            <SearchResult searchText={searchText} />
        </div>;
    }
}


var routes = (
    <Route>
        <DefaultRoute handler={DefaultPage} />
        <Route name="sign_in" handler={MainSignIn} />
        <Route name="sign_up" handler={MainSignUp} />
        <Route name="search" handler={SearchPageWrapper} params="searchText"/>
        <Route name="page">
            <Route path=":pageId" handler={DefaultShowPage}/>
        </Route>
        {/*<Route name="page" path="/page/:pageId" handler={DefaultShowPage}/>*/}
   </Route>
);

Router.run(routes, Router.HashLocation, function (Handler) {
    React.render(<Handler/>, document.body);
});

