'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');
const follow = require('./follow');
import CreateDialog from './article-create';

const root = '/api';

class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {articles: [], attributes: [], pageSize: 2, links: {}};
        this.updatePageSize = this.updatePageSize.bind(this);
        this.onCreate = this.onCreate.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onNavigate = this.onNavigate.bind(this);
    }

    componentDidMount(){
        this.loadFromServer(this.state.pageSize);
    }

    onCreate(newArticle) {
        follow(client, root, ['articles']).then(articleCollection => {
            return client({
                method: 'POST',
                path: articleCollection.entity._links.self.href,
                entity: newArticle,
                headers: {'Content-Type': 'application/json'}
            })
        }).then(response => {
            return follow(client, root, [
                {rel: 'articles', params: {'size': this.state.pageSize}}]);
        }).then(response => {
            if (typeof response.entity._links.last != "undefined") {
                this.onNavigate(response.entity._links.last.href);
            } else {
                this.onNavigate(response.entity._links.self.href);
            }
        });
    }

    onNavigate(navUri) {
        client({method: 'GET', path: navUri}).then(articleCollection => {
            this.setState({
                articles: articleCollection.entity._embedded.articles,
                attributes: this.state.attributes,
                pageSize: this.state.pageSize,
                links: articleCollection.entity._links
            });
        });
    }

    onDelete(article) {
        client({method: 'DELETE', path: article._links.self.href}).then(response => {
            this.loadFromServer(this.state.pageSize);
        });
    }

    loadFromServer(pageSize) {
        follow(client, root, [
            {rel: 'articles', params: {size: pageSize}}]
        ).then(articleCollection => {
            return client({
                method: 'GET',
                path: articleCollection.entity._links.profile.href,
                headers: {'Accept': 'application/schema+json'}
            }).then(schema => {
                this.schema = schema.entity;
                return articleCollection;
            });
        }).then(articleCollection => {
            this.setState({
                articles: articleCollection.entity._embedded.articles,
                attributes: Object.keys(this.schema.properties),
                pageSize: pageSize,
                links: articleCollection.entity._links});
        });
    }

    updatePageSize(pageSize) {
        if (pageSize !== this.state.pageSize) {
            this.loadFromServer(pageSize);
        }
    }

    render(){
        return (
            <main>
                <CreateDialog attributes={this.state.attributes} onCreate={this.onCreate}/>
                <ArticleList articles = {this.state.articles}
                             links={this.state.links}
                             pageSize={this.state.pageSize}
                             onNavigate={this.onNavigate}
                             onDelete={this.onDelete}
                             updatePageSize={this.updatePageSize}/>
            </main>
        )
    }
}

class ArticleList extends React.Component{

    constructor(props) {
        super(props);
        this.handleNavFirst = this.handleNavFirst.bind(this);
        this.handleNavPrev = this.handleNavPrev.bind(this);
        this.handleNavNext = this.handleNavNext.bind(this);
        this.handleNavLast = this.handleNavLast.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    handleInput(e) {
        e.preventDefault();
        var pageSize = ReactDOM.findDOMNode(this.refs.pageSize).value;
        if (/^[0-9]+$/.test(pageSize)) {
            this.props.updatePageSize(pageSize);
        } else {
            ReactDOM.findDOMNode(this.refs.pageSize).value =
                pageSize.substring(0, pageSize.length - 1);
        }
    }

    handleNavFirst(e){
        e.preventDefault();
        this.props.onNavigate(this.props.links.first.href);
    }

    handleNavPrev(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.prev.href);
    }

    handleNavNext(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.next.href);
    }

    handleNavLast(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.last.href);
    }

    render(){
        var articles = this.props.articles.map(blogarticle =>
        <Article key={blogarticle._links.self.href} blogarticle={blogarticle} onDelete={this.props.onDelete} />);
        var navLinks = [];
        if ("first" in this.props.links) {
            navLinks.push(<button key="first" onClick={this.handleNavFirst}>&lt;&lt;</button>);
        }
        if ("prev" in this.props.links) {
            navLinks.push(<button key="prev" onClick={this.handleNavPrev}>&lt;</button>);
        }
        if ("next" in this.props.links) {
            navLinks.push(<button key="next" onClick={this.handleNavNext}>&gt;</button>);
        }
        if ("last" in this.props.links) {
            navLinks.push(<button key="last" onClick={this.handleNavLast}>&gt;&gt;</button>);
        }
        return (
            <div>
                <input ref="pageSize" defaultValue={this.props.pageSize} onInput={this.handleInput}/>
                {articles}
            </div>
        )
    }
}

class Article extends React.Component{
    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleDelete() {
        this.props.onDelete(this.props.blogarticle);
    }
    render(){
        return (
            <div>
                <h3>{this.props.blogarticle.title}</h3>
                <hr/>
                <div>{this.props.blogarticle.textBody}</div>
                <hr/>
                <button onClick={this.handleDelete}>Delete</button>
            </div>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('react')
)