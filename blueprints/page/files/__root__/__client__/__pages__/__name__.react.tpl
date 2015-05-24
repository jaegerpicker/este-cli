import Component from '../components/component.react';
import DocumentTitle from 'react-document-title';
import React from 'react';
import {msg} from '../intl/store';

class {{className}} extends Component {

  render() {
    return (
      <DocumentTitle title={msg('{{name}}.title')}>
        <div className="{{name}}-page">
          Hello world
        </div>
      </DocumentTitle>
    );
  }

}

export default {{className}};