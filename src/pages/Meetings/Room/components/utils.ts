export const importYxkApi = (): Promise<void> =>
  new Promise(async (resolve) => {
    if (window.YxkMeetExternalAPI) {
      resolve(window.YxkMeetExternalAPI);
    } else {
      const head = document.getElementsByTagName('head')[0];
      const script = document.createElement('script');

      script.setAttribute('type', 'text/javascript');
      script.setAttribute('src', 'https://hy.bjyixiu.com/external_api.js');

      head.addEventListener(
        'load',
        function (event: any) {
          if (event.target.nodeName === 'SCRIPT') {
            resolve(window.YxkMeetExternalAPI);
          }
        },
        true,
      );

      head.appendChild(script);
    }
  });
