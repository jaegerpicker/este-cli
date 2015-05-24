import Component from '../components/component.react';
import DocumentTitle from 'react-document-title';
import React from 'react';
import {msg} from '../intl/store';

export default class {{className}} extends Component {

  render() {
    return (
      <DocumentTitle title={msg('home.title')}>
        <div className="home-page">
          <p>Hello world</p>
        </div>
      </DocumentTitle>
    );
  }

}