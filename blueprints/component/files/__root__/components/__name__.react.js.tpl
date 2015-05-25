import Component from '{{{rootPath}}}/component.react';
import React from 'react';

export default function {{camelName}}Component(BaseComponent) {

  class {{className}} extends Component {
    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  {{className}}.displayName = `${BaseComponent.name}{{className}}`;

  return {{className}};

}
