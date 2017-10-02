var React = require('react');

// from http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


function getAppState() {
    let page_url = getParameterByName('url');
    let state = {
        page_url,
        page_oid: null,
        comments: [],
        text: ''
    };
    return state;
}


export class Page extends React.Component {

    static propTypes = {};
    static defaultProps = {};
    state = getAppState();

    constructor(props) {
        super(props);
        console.debug('Start state : ', this.state);

        $.get('/pages?url=' + encodeURIComponent(this.state.page_url), (r)=> {
            console.debug('Getting page infos : ', r);
            this.setState({page_oid: r.oid});
            this.update();
            setInterval(()=> {
                this.update()
            }, 1000);
        });
    }

    update() {
        $.get(`/pages/${this.state.page_oid}/comments`, (response)=> {
            console.log('getting comments :', response);
            this.setState({comments: response.comments});
        });
    };


    onAddComment() {
        let data = {text: this.state.text};
        $.ajax({
                type: "POST",
                url: `/pages/${this.state.page_oid}/comments`,
                processData: false,
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: (r) => {
                    this.update();
                    this.setState({text: ''});
                }
            }
        );
    };


    onTextChange(event) {
        this.setState({text: event.target.value});
    };

    onKeyPress(event) {
        if (event.key === 'Enter') {
            this.onAddComment();
        }
    };


    render() {
        return <div>
            <table>
                <tbody>
                {this.state.comments.map((comment)=>
                    <tr key={comment.oid}>
                        <td>{comment.text}</td>
                    </tr>
                )}
                <tr>
                    <td>
                        <input
                            type="text"
                            value={this.state.text}
                            onChange={(event)=>this.onTextChange(event)}
                            onKeyPress={(e)=>this.onKeyPress(e)}
                        />
                        <input
                            type="button"
                            value="Submit Comment"
                            onClick={()=>this.onAddComment()}
                        />
                    </td>
                </tr>
                </tbody>
            </table>
        </div>;
    }
}

