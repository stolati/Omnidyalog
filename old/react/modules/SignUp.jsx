let React = require('react');
let Link = require('react-router').Link;

export default class SignUp extends React.Component {

    render(){
        return <div style={{textAlign: 'center'}}>
            <Link to="/">
                <img src="http://i62.tinypic.com/avl8gw.jpg" style={{margin: 'auto', marginTop: '20px'}}/>
            </Link>

            <div style={{margin: 'auto', width: '400px', verticalAlign: 'middle', marginTop:'20px'}}>
                <div className="panel panel-primary">
                    <div className="panel-heading" style={{fontSize: 'large'}}>Sign Up</div>
                    <div className="panel-body">
                        {/*Email input*/}
                        <div className="input-group input-group-lg" style={{margin: '15px 15px'}}>
                            <span className="input-group-addon">
                                <span className="glyphicon glyphicon-envelope" aria-hidden="true"></span>
                            </span>
                            <input type="email" className="form-control" placeholder="Email"/>
                        </div>

                        {/*Username input*/}
                        <div className="input-group input-group-lg" style={{margin: '15px 15px'}}>
                            <span className="input-group-addon">
                                <span className="glyphicon glyphicon-user" aria-hidden="true"></span>
                            </span>
                            <input type="text" className="form-control" placeholder="Username"/>
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
                                Or <span><Link to="sign_in">Sign In</Link></span>
                            </span>
                        </p>

                    </div> {/*panel-body*/}
                </div> {/*panel panel-primary*/}
            </div>

        </div>;
    }

}

/*
<div style="margin: auto; width: 400px; vertical-align: middle; margin-top:20px">
    <div class="panel panel-primary">
        <div class="panel-heading" style="font-size: large">Sign Up</div>
        <div class="panel-body">

            <p style="margin:15px 15px; font-size: large; align:right ">
                <button type="submit" class="btn btn-primary btn-lg" style="margin-right: 15px">Submit</button>
                <span style="center-align:right"> Or <a href="#"> Sign In</a></span>
            </p>


        </div>
    </div>
</div>


 */
