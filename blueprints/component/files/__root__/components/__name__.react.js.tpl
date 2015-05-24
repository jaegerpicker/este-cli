import Component from './component.react';
import React from 'react';

export default function {{camelName}}(WrappedComponent) {

  class {{className}} extends Component {
    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  {{className}}.displayName = `${WrappedComponent.name}{{className}}`;

  return {{className}};

}
