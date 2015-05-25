import messages from '../client/messages';

const initialLocale = 'en';

export default {

  app: {},
  i18n: {
    formats: {},
    locales: initialLocale,
    messages: messages[initialLocale]
  },
  pendingActions: {}

};