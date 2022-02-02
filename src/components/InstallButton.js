import React, { useState, useEffect } from 'react';

const InstallButton = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState(null);
  const onClick = async () => {
    if (!promptInstall) {
      promptInstall.prompt();
      const { outcome } = await promptInstall.userChoice;
      if (outcome === 'accepted') {
        setPromptInstall(null);
      }
    }
  };

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('transitionend', handler);
  }, [setPromptInstall, setSupportsPWA]);

  if (supportsPWA) {
    return (
      <button
        className={`waves-effect waves-light btn-large`}
        type="button"
        onClick={() => onClick()}
      >
        INSTALL APP
        <i className="material-icons right">cloud_download</i>
      </button>
    );
  }

  return <></>;
};

export default InstallButton;
