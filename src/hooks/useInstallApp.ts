import { useEffect, useState } from 'react';
import { canPromptNatively, detectPlatform, isStandalone, promptInstall, subscribe, type Platform } from '../lib/installPrompt';

/** One install flow for every button: native dialog when the browser offers it, otherwise step-by-step guide. */
export function useInstallApp() {
  const [platform] = useState<Platform>(detectPlatform);
  const [installed, setInstalled] = useState(isStandalone);
  const [nativeReady, setNativeReady] = useState(canPromptNatively);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(
    () =>
      subscribe(() => {
        setInstalled(isStandalone());
        setNativeReady(canPromptNatively());
      }),
    []
  );

  const install = async () => {
    const result = await promptInstall();
    if (result === 'unavailable') setShowGuide(true);
  };

  return { platform, installed, nativeReady, install, showGuide, closeGuide: () => setShowGuide(false) };
}
