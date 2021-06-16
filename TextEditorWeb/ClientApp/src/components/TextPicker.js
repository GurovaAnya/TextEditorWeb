import React, {Component} from 'react';
import {history} from "react"

export class TextPicker extends Component {
    static displayName = TextPicker.texts;

    constructor(props) {
        super(props);
        this.state = {texts: []}
    }

    componentDidMount() {
        fetch('/api/Text')
            .then(response => response.json())
            .then(json => this.setState({texts: json}));
        console.log(this.texts);
    }

    render() {
        return <div>
            <h1> My texts </h1>
            <ul>
                {this.state.texts.map(item =>
                    <li key={item.id} onClick={() => this.props.history.push(`/document/${item.id}`)}>{item.name + ' '  + item.lastUpdated}</li>
                )}
            </ul>
        </div>
    }
}