import React, {Component} from 'react';
import {TwitterPicker} from 'react-color';
import axios from "axios";

export class Home extends Component {
  static displayName = Home.name;
  CareTaker = require('./CareTaker').setOriginator(this)

    page_content;
    state = {
        textJson: '',
        selectedColor: '#000',
        displayColorPicker: false
    };

    constructor(props) {
        super(props);
        this.state = {name: null, text: 'hello <b>bold</b>', selectedColor: '#000', displayColorPicker: false}
    }

    async componentDidMount() {
        let id = this.props.match.params.documentId;
        if (id !== undefined) {

            const response = await axios.get("/api/text/" + id, this.getHeaderConfig())
                .catch(error =>this.setState({name: "Unsaved Document"}));
            if (response !== undefined && response.status === 200)
            this.setState({
                name: response.data.name,
                text: response.data.text
            });
            else
                this.setState({name: "Unsaved Document"});
        }
        else
            this.setState({name: "Unsaved Document"});

    }

    render () {
        const popover = {
            position: 'absolute',
            zIndex: '2',
        }
        const cover = {
            position: 'fixed',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
        }

        console.log(this.props.location.pathname);

        return <div >
            <h1 contentEditable="true"  id="textName"> {this.state.name} </h1>
            <button onClick={()=>this.save()}>Save</button>
            <button onClick={()=>this.CareTaker.applyBinaryStyle(window.getSelection(),'U')}>Underline</button>
            <button onClick={()=>this.CareTaker.applyBinaryStyle(window.getSelection(),'B')}>Bold</button>
            <button onClick={()=>this.CareTaker.applyBinaryStyle(window.getSelection(),'I')}>Italic</button>
            <button onClick={ this.handleColorButtonClick }>Pick Color</button>
            { this.state.displayColorPicker ? <div style={ popover }>
                <div style={ cover } onClick={ this.handleColorButtonClose }/>
                <TwitterPicker color={ this.state.background }
                               onChangeComplete={ this.handleChangeComplete }/>
            </div> : null }
            <button onClick={ this.handleChangeColorButtonClick }>Change Color</button>

            <div class="backgroundArea">
                <div class="editArea" id="text" contentEditable="true" onKeyDown={(ev) => this.processClick(ev)} dangerouslySetInnerHTML={{__html: this.state.text}}></div>
            </div >
        </div>
    }

  processClick(e) {
      e = e || window.event;

      if (e.ctrlKey && e.keyCode === 73){ // I
          e.preventDefault();
          this.CareTaker.applyBinaryStyle(window.getSelection(), 'I');
      }
      else if (e.ctrlKey && e.keyCode === 66) //B
      {
          e.preventDefault();
          this.CareTaker.applyBinaryStyle(window.getSelection(), 'B');
      }
      else if (e.ctrlKey && e.keyCode === 85){ //U
          e.preventDefault();
          this.CareTaker.applyBinaryStyle(window.getSelection(), 'U');
      } 
      else if (e.ctrlKey && e.keyCode === 90) //Z
      {
          e.preventDefault();
          this.CareTaker.undo();
      }
      else if (e.ctrlKey && e.keyCode === 89) //Y
      {
          e.preventDefault();
          this.CareTaker.redo();
      }
      else if (e.ctrlKey && e.keyCode === 83) //S
      {
          e.preventDefault();
          this.save();
      }
          
      return true;
    }
    
    async save() {
        let id = this.props.match.params.documentId;
        const data = {
            text: document.getElementById('text').innerHTML,
            id: id,
            name: document.getElementById('textName').innerText
        };
        if (id !== undefined) {
            const response = await axios.put("/api/text/" + id, data, this.getHeaderConfig())
                .catch(error => this.setState({name: "Unsaved Document"}));
            if (response !== undefined && response.status === 204)
                alert('Saved');
        }
        else {
            const response = await axios.post("/api/text", data, this.getHeaderConfig())
                .catch(error => this.setState({name: "Unsaved Document"}));
            if (response !== undefined && response.status === 201) {
                alert('Saved');
                window.location.href ='/document/'+ response.data.id;
            }
        }

    }
    
    getHeaderConfig(){
        return   {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt'),
            }
        }
    }

    restore(snapshot){
      document.getElementById('text').innerHTML = snapshot;
    }

    makeSnapshot(){
      return document.getElementById('text').innerHTML;

    }

    handleChangeComplete = (color) => {
        this.setState({ selectedColor: color.hex });
    };

    handleColorButtonClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };

    handleColorButtonClose = () => {
        this.setState({ displayColorPicker: false })
    };

    handleChangeColorButtonClick = () =>{
        this.CareTaker.changeColor(this.state.selectedColor);
    }
}