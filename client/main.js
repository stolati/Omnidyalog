// main.js
var React = require('react');
var ReactDOM = require('react-dom');

var Page = require('./components/page').Page;

ReactDOM.render(
    <Page name="Sebastien"/>,
    document.getElementById('app')
);

