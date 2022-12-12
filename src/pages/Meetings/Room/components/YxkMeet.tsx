import React, { useState, useEffect, useRef } from 'react';
import { Props, YxkMeetAPIOptions } from './types';
import * as Default from './defaults';
import { importYxkApi } from './utils';

const YxkMeet: React.FC<Props> = (props: Props) => {
  const {
    containerStyle,
    frameStyle,
    loadingComponent,
    onAPILoad,
    onIframeLoad,
    domain,
    roomName,
    password,
    displayName,
    config,
    interfaceConfig,
    noSSL,
    jwt,
    devices,
    userInfo,
  } = { ...Default.Props, ...props };

  const [loading, setLoading] = useState(true);
  const ref = useRef<HTMLDivElement | null>(null);

  const Loader = loadingComponent || Default.Loader;

  const startConference = (YxkMeetExternalAPI: any): void => {
    try {
      console.log('interfaceConfig', interfaceConfig);

      const options: YxkMeetAPIOptions = {
        roomName,
        parentNode: ref.current,
        configOverwrite: config,
        interfaceConfigOverwrite: interfaceConfig,
        noSSL,
        jwt,
        onLoad: onIframeLoad,
        devices,
        userInfo,
      };

      const api = new YxkMeetExternalAPI(domain, options);

      if (!api) throw new Error('Failed to create YxkMeetExternalAPI istance');

      if (onAPILoad) onAPILoad(api);

      api.addEventListener('videoConferenceJoined', () => {
        setLoading(false);

        api.executeCommand('displayName', displayName);

        if (domain === Default.Props.domain && password)
          api.executeCommand('password', password);
      });

      /**
       * If we are on a self hosted Yxk domain, we need to become moderators before setting a password
       * Issue: https://community.yxk.org/t/lock-failed-on-yxkmeetexternalapi/32060
       */
      api.addEventListener(
        'participantRoleChanged',
        (e: { id: string; role: string }) => {
          if (
            domain !== Default.Props.domain &&
            password &&
            e.role === 'moderator'
          )
            api.executeCommand('password', password);
        },
      );
    } catch (error) {
      console.error('Failed to start the conference', error);
    }
  };

  useEffect(() => {
    importYxkApi()
      .then((yxkApi) => {
        startConference(yxkApi);
      })
      .catch((err) => {
        console.error('Yxk Meet API library not loaded.', err);
      });
  }, []);

  return (
    <div
      id="react-yxk-container"
      style={{ ...Default.ContainerStyle, ...containerStyle }}
    >
      {loading && <Loader />}
      <div
        id="react-yxk-frame"
        style={{ ...Default.FrameStyle(loading), ...frameStyle }}
        ref={ref}
      />
    </div>
  );
};

export default YxkMeet;
