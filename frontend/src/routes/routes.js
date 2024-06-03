const apiPath = '/api/v1';

export default {
  loginPath: () => [apiPath, 'login'].join('/'),
  ChannelsPath: () => [apiPath, 'channels'].join('/'),
  MessagesPath: () => [apiPath, 'messages'].join('/'),
};