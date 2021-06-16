import React, {Component} from 'react';
import {history} from "react"
import axios from "axios";

export class TextPicker extends Component {
    static displayName = TextPicker.texts;

    constructor(props) {
        super(props);
        this.state = {texts: []}
    }

    async componentDidMount() {
        let config = {
            headers: {
                Authorization: 'Bearer '+ localStorage.getItem('jwt'),
            }
        }
        const response =  await axios.get("/api/text", config)
            .catch(error => this.setState({texts : []}));
        this.setState({texts: response.data});
        // fetch('/api/Text')
        //     .then(response => response.json())
        //     .then(json => this.setState({texts: json}));
        console.log(this.texts);
    }

    render() {
        return <div>
            <h1> My texts </h1>
            <ul>
                {this.state.texts.map(item =>
                    <li key={item.id} onClick={() => this.props.history.push(`/document/${item.id}`)}>{item.name}</li>
                )}
            </ul>
        </div>
    }
}