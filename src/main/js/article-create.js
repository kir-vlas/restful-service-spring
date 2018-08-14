'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');

class CreateDialog extends React.Component{
    constructor(props) {
        super(props);
        this.state = { isDialogOpened: false };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        var newArticle = {};
        this.props.attributes.forEach(attribute => {
            newArticle[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
        });
        this.props.onCreate(newArticle);

        this.props.attributes.forEach(attribute => {
            ReactDOM.findDOMNode(this.refs[attribute]).value = '';
        });

        this.toggleModal(e);
    }

    toggleModal(e){
        e.preventDefault();
        this.setState({isDialogOpened: !this.state.isDialogOpened});
    }

    render() {
        var inputs = this.props.attributes.map(attribute =>
            <p key={attribute}>
                <textarea type="text" placeholder={attribute} ref={attribute} className="field" />
            </p>
        );

        return (
            <div class="modalContainer">
                <a onClick={this.toggleModal}>Create Article</a>

                <div id="createArticle" className="modalDialog" style={{display: this.state.isDialogOpened? 'flex':'none'}}>
                    <div>
                        <a title="Close" onClick={this.toggleModal} className="close">X</a>

                        <h2>Create new article</h2>

                        <form>
                            {inputs}
                            <button onClick={this.handleSubmit}>Create</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}
export default CreateDialog;