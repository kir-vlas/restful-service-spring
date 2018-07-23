'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');

class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {articles: []};
    }

    componentDidMount(){
        client({method: 'GET', path:'/api/articles'}).then(response => {
            this.setState({articles: response.entity._embedded.articles});
        });
    }

    render(){
        return (
            <ArticleList articles = {this.state.articles}/>
        )
    }
}

class ArticleList extends React.Component{
    render(){
        var articles = this.props.articles.map(blogarticle =>
        <Article key={blogarticle._links.self.href} blogarticle={blogarticle}/>);
        return (
            <div>
                {articles}
            </div>
        )
    }
}

class Article extends React.Component{
    render(){
        return (
            <div>
                <h3>{this.props.blogarticle.title}</h3>
                <hr/>
                <div>{this.props.blogarticle.textBody}</div>
            </div>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('react')
)