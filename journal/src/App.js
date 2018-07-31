import React, { Component } from 'react';
import Markdown from 'markdown-to-jsx';
import AceEditor from 'react-ace';
import styled from 'styled-components';
import brace from 'brace';
import 'brace/mode/markdown';
import 'brace/theme/dracula';
import './App.css';

const settings = window.require('electron-settings')
const { ipcRenderer } = window.require('electron');

class App extends Component {
state = {
  loadedFile: '',
  directory: settings.get('directory') || null
};

  constructor() {
    super();
    ipcRenderer.on('new-file', (event, fileContent) => {
      this.setState({ loadedFile: fileContent });
    });
    ipcRenderer.on('new-dir', (event, filePaths, dir) => {
      this.setState({
        directory: dir
      });
      settings.set('directory', dir);
    });
  }

  render() {
    return (
      <div className="App">
        <Header>Journal</Header>
        {this.state.directory ? (

        <Split>
          <CodeWindow>
            <AceEditor
              mode="markdown"
              theme="dracula"
              onChange={newContent => {
                this.setState({
                  loadedFile: newContent
                })
              }}
              name="markdown_editor"
              value={this.state.loadedFile}
            />
          </CodeWindow>
          <RenderedWindow>
            <Markdown>
              {this.state.loadedFile}
            </Markdown>
          </RenderedWindow>
        </Split>
        ) : (
          <LoadingMessage>
            <h1> Please open a directory to get started...</h1>
          </LoadingMessage>
        )}
      </div>
    );
  }
}

export default App;

const Header = styled.header`
  background-color: #191324;
  color: #75717c;
  font-size: 0.8rem;
  height: 23px;
  text-align: center;
  position: fixed;
  box-shadow: 0 0 3px 3px rgba(0,0,0, 0.2);
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  -webkit-app-region: drag;
`;

const LoadingMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background: #333;
  height: 100vh;
`;

const Split = styled.div`
  display: flex;
  height: 100vh;
`;

const CodeWindow = styled.div`
  flex: 1;
  padding-top: 2rem;
  background-color: #191324;
`;


const RenderedWindow = styled.div`
  background-color: #191324;
  width: 35%;
  padding: 20px;
  color: #ffffff;
  border-left: 1px solid #302b3a;

  h1, h2, h3, h4, h5, h6 {
    color: #82d8d8;
  }

  h1 {
    border-bottom: solid 3px #e54b4b;
  }

  a {
    color: #e54b4b;
  }
`;







