import Component from '{{{rootPath}}}/components/component.react';
import DocumentTitle from 'react-document-title';
import React from 'react';

export default class {{className}} extends Component {

  render() {
    return (
      <DocumentTitle title="{{className}}">
        <div className="{{cssName}}-page">
          {{className}} page
        </div>
      </DocumentTitle>
    );
  }

}