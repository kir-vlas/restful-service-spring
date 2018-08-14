'use strict';

const React = require('react');
const ReactDOM = require('react-dom');

class UpdateDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isDialogOpened: false};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
    }

    handleSubmit(e){
        e.preventDefault();
        var updatedArticle = {};
        this.props.attributes.forEach(attribute => {
            updatedArticle[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
        });
        this.props.onUpdate(this.props.article, updatedArticle);
        this.toggleModal(e);
    }

    toggleModal(e){
        e.preventDefault();
        this.setState({isDialogOpened: !this.state.isDialogOpened});
    }

    render(){
        var inputs = this.props.attributes.map(attribute =>
            <p key={this.props.article.entity[attribute]}>
                <textarea type="text" placeholder={attribute}
                    defaultValue={this.props.article.entity[attribute]}
                    ref={attribute} className="field" />
            </p>
        );
        var dialogId = "updateArticle-"+this.props.article.entity._links.self.href;

        return (
            <div key={this.props.article.entity._links.self.href}>
                <a onClick={this.toggleModal}>Update</a>
                <div id={dialogId} className="modalDialog" style={{display: this.state.isDialogOpened? 'flex':'none'}}>
                    <a title="Close" onClick={this.toggleModal} className="close">X</a>
                    <h2>Update an article</h2>
                    <form>
                        {inputs}
                        <button onClick={this.handleSubmit}>Update</button>
                    </form>
                </div>
            </div>
        )
    }
}
export default UpdateDialog;