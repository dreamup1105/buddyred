import React, { useState, useRef, useEffect } from 'react';

function _extends() {
  _extends =
    Object.assign ||
    function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

  return _extends.apply(this, arguments);
}

var Loader = function Loader() {
  return React.createElement('div', null, 'Loading meeting...');
};
var Props = {
  domain: 'hy.bjyixiu.com',
  roomName: /*#__PURE__*/ (Math.random() + 0.48151642)
    .toString(36)
    .substring(2),
};
var ContainerStyle = {
  width: '800px',
  height: '400px',
};
var FrameStyle = function FrameStyle(loading) {
  return {
    // display: loading ? 'none' : 'block',
    display: 'block',
    width: '100%',
    height: '100%',
  };
};

var importJitsiApi = function importJitsiApi() {
  return new Promise(function (resolve) {
    try {
      if (window.JitsiMeetExternalAPI) {
        resolve(window.JitsiMeetExternalAPI);
      } else {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', 'https://hy.bjyixiu.com/external_api.js');
        head.addEventListener(
          'load',
          function (event) {
            if (event.target.nodeName === 'SCRIPT') {
              resolve(window.JitsiMeetExternalAPI);
            }
          },
          true,
        );
        head.appendChild(script);
      }

      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  });
};

var YxkMeet = function YxkMeet(props) {
  var _Default$Props$props = _extends({}, Props, {}, props),
    containerStyle = _Default$Props$props.containerStyle,
    frameStyle = _Default$Props$props.frameStyle,
    loadingComponent = _Default$Props$props.loadingComponent,
    onAPILoad = _Default$Props$props.onAPILoad,
    onIframeLoad = _Default$Props$props.onIframeLoad,
    domain = _Default$Props$props.domain,
    roomName = _Default$Props$props.roomName,
    password = _Default$Props$props.password,
    displayName = _Default$Props$props.displayName,
    config = _Default$Props$props.config,
    interfaceConfig = _Default$Props$props.interfaceConfig,
    noSSL = _Default$Props$props.noSSL,
    jwt = _Default$Props$props.jwt,
    devices = _Default$Props$props.devices,
    userInfo = _Default$Props$props.userInfo;

  var _useState = useState(true),
    loading = _useState[0],
    setLoading = _useState[1];

  var ref = useRef(null);
  var Loader$1 = loadingComponent || Loader;

  var startConference = function startConference(JitsiMeetExternalAPI) {
    try {
      console.log('interfaceConfig', interfaceConfig);
      var options = {
        roomName: roomName,
        parentNode: ref.current,
        configOverwrite: config,
        interfaceConfigOverwrite: interfaceConfig,
        noSSL: noSSL,
        jwt: jwt,
        onLoad: onIframeLoad,
        devices: devices,
        userInfo: userInfo,
      };
      var api = new JitsiMeetExternalAPI(domain, options);
      if (!api) throw new Error('Failed to create YxkMeetExternalAPI istance');
      if (onAPILoad) onAPILoad(api);
      api.addEventListener('videoConferenceJoined', function () {
        setLoading(false);
        api.executeCommand('displayName', displayName);
        if (domain === Props.domain && password)
          api.executeCommand('password', password);
      });
      /**
       * If we are on a self hosted yxk domain, we need to become moderators before setting a password
       * Issue: https://community.yxk.org/t/lock-failed-on-yxkmeetexternalapi/32060
       */

      api.addEventListener('participantRoleChanged', function (e) {
        if (domain !== Props.domain && password && e.role === 'moderator')
          api.executeCommand('password', password);
      });
    } catch (error) {
      console.error('Failed to start the conference', error);
      setLoading(false);
    }
  };

  useEffect(function () {
    importJitsiApi()
      .then(function (jitsiApi) {
        startConference(jitsiApi);
      })
      ['catch'](function (err) {
        console.error('Yxk Meet API library not loaded.', err);
      });
  }, []);
  return React.createElement(
    'div',
    {
      id: 'react-yxk-container',
      style: _extends({}, ContainerStyle, {}, containerStyle),
    },
    loading && React.createElement(Loader$1, null),
    React.createElement('div', {
      id: 'react-yxk-frame',
      style: _extends({}, FrameStyle(loading), {}, frameStyle),
      ref: ref,
    }),
  );
};

export default YxkMeet;
//# sourceMappingURL=react-yxk.esm.js.map
