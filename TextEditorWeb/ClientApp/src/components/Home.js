import React, {Component} from 'react';
import {TwitterPicker} from 'react-color';

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
        this.state = {name: null, selectedColor: '#000', displayColorPicker: false}
    }

    componentDidMount() {
        let id = this.props.match.params.documentId;
        if (id !== undefined)
        fetch('/api/Text/'+id)
            .then(response => response.json())
            .then(json => this.setState({name: json.name}));
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
            <h1> {this.state.name} </h1>
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
                <div class="editArea" id="text" contentEditable="true" onKeyDown={(ev) => this.processClick(ev)}>hello <b>bold</b></div>
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
      {}
      else if (e.ctrlKey && e.keyCode === 83) //S
      {}
          
      return true;
    }
    
    save() {
          alert(document.getElementById("text").textContent);
    }
    
    createXml(){
      alert(123);
        var parser = new DOMParser();
        this.xml = parser.parseFromString("<p>hello <b>bold</b></p>>", "text/xml");
        document.getElementById("text").innerHTML = "<p>hello <b>bold</b></p>";
        
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

class Snapshot{
    #editor;
    //#parentId;
    //#offset;
    #element;
    
    constructor(editor,
                //parentId, offset,
                element) {
        this.#editor = editor;
        //this.#parentId = parentId;
        //this.#offset = offset;
        this.#element = element;
    }

}

