import Component from '../components/component.react';
import DocumentTitle from 'react-document-title';
import React from 'react';
import {msg} from '../intl/store';

export default class {{className}} extends Component {

  render() {
    return (
      <DocumentTitle title={msg('{{objectName}}.title')}>
        <div className="{{cssName}}-page">
          <p>Hello world</p>
        </div>
      </DocumentTitle>
    );
  }

}