let React = require('react');
let Link = require('react-router').Link;

export default class SignIn extends React.Component {

    render(){
        return <div style={{textAlign: 'center'}}>
            <Link to="/">
                <img src="http://i62.tinypic.com/avl8gw.jpg" style={{margin: 'auto', marginTop: '20px'}}/>
            </Link>

            <div style={{margin: 'auto', width: '400px', verticalAlign: 'middle', marginTop:'20px'}}>
                <div className="panel panel-primary">
                    <div className="panel-heading" style={{fontSize: 'large'}}>Sign In</div>
                    <div className="panel-body">
                        {/*Email input*/}
                        <div className="input-group input-group-lg" style={{margin: '15px 15px'}}>
                            <span className="input-group-addon">
                                <span className="glyphicon glyphicon-envelope" aria-hidden="true"></span>
                            </span>
                            <input type="email" className="form-control" placeholder="Email"/>
                        </div>
                        {/*Password input*/}
                        <div className="input-group input-group-lg" style={{margin: '15px 15px'}}>
                            <span className="input-group-addon">
                                <span className="glyphicon glyphicon-asterisk" aria-hidden="true"></span>
                            </span>
                            <input type="password" className="form-control" placeholder="Password"/>
                        </div>

                        {/* Submit */}
                        <p style={{margin:'15px 15px', fontSize: 'large'}}>
                            <button type="submit" className="btn btn-primary btn-lg" style={{marginRight: '15px', float: 'left'}}>Submit</button>
                            <span style={{float: 'right', paddingTop:'10px'}}>
                                Or <span><Link to="sign_up">Sign Up</Link></span>
                            </span>
                        </p>

                    </div> {/*panel-body*/}
                </div> {/*panel panel-primary*/}
            </div>

        </div>;
    }

}

