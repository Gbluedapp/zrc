/**
 * WalletConnect Error Page Clone - Vanilla JavaScript
 * Strictly vanilla JS: No external libraries, no frameworks.
 */

(function () {
  'use strict';

  // DOM Elements
  const errorCard = document.getElementById('errorCard');
  const errorMessage = document.getElementById('errorMessage');
  const logoBox = document.getElementById('logoBox');
  const brokenLogoView = document.getElementById('brokenLogoView');
  const loadedLogoView = document.getElementById('loadedLogoView');
  const toastNotice = document.getElementById('toastNotice');
  const btnRetry = document.getElementById('btnRetry');
  const btnToggleLogo = document.getElementById('btnToggleLogo');
  const btnCopy = document.getElementById('btnCopy');

  let isRetrying = false;
  let showOfficialLogo = false;
  const originalErrorText = 'Error Connecting..Pls revert to your support.';

  /**
   * Display toast notification
   * @param {string} text
   */
  function showToast(text) {
    if (!toastNotice) return;
    toastNotice.textContent = text;
    toastNotice.classList.add('visible');
    clearTimeout(toastNotice._timer);
    toastNotice._timer = setTimeout(() => {
      toastNotice.classList.remove('visible');
    }, 2400);
  }

  /**
   * Simulate a wallet reconnection attempt
   */
  function triggerRetry() {
    if (isRetrying) return;
    isRetrying = true;

    if (errorCard) {
      errorCard.classList.remove('shake');
      errorCard.classList.add('retrying');
    }

    if (errorMessage) {
      errorMessage.textContent = 'Connecting to wallet provider...';
    }

    // Simulate network connection attempt delay
    setTimeout(() => {
      if (errorMessage) {
        errorMessage.textContent = originalErrorText;
      }
      if (errorCard) {
        errorCard.classList.remove('retrying');
        // trigger shake animation
        void errorCard.offsetWidth; // force reflow
        errorCard.classList.add('shake');
      }
      isRetrying = false;
      showToast('Connection failed. Please check support.');
    }, 1400);
  }

  /**
   * Toggle between screenshot broken image reproduction and official WalletConnect logo
   */
  function toggleLogoView() {
    showOfficialLogo = !showOfficialLogo;
    if (showOfficialLogo) {
      if (brokenLogoView) brokenLogoView.style.display = 'none';
      if (loadedLogoView) loadedLogoView.style.display = 'inline-flex';
      showToast('Showing official WalletConnect logo');
      if (btnToggleLogo) btnToggleLogo.textContent = 'View Screenshot Alt';
    } else {
      if (brokenLogoView) brokenLogoView.style.display = 'inline-flex';
      if (loadedLogoView) loadedLogoView.style.display = 'none';
      showToast('Showing screenshot broken-image replica');
      if (btnToggleLogo) btnToggleLogo.textContent = 'View Official Logo';
    }
  }

  /**
   * Copy error message to clipboard
   */
  function copyErrorMessage() {
    const textToCopy = originalErrorText;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast('Error message copied to clipboard');
      }).catch(() => {
        fallbackCopy(textToCopy);
      });
    } else {
      fallbackCopy(textToCopy);
    }
  }

  function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showToast('Error message copied');
    } catch (err) {
      showToast('Unable to copy message');
    }
    document.body.removeChild(textarea);
  }

  // Event Listeners
  if (errorCard) {
    errorCard.addEventListener('click', triggerRetry);
    errorCard.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerRetry();
      }
    });
  }

  if (logoBox) {
    logoBox.addEventListener('click', toggleLogoView);
    logoBox.setAttribute('tabindex', '0');
    logoBox.setAttribute('role', 'button');
    logoBox.setAttribute('aria-label', 'Toggle logo view');
    logoBox.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleLogoView();
      }
    });
  }

  if (btnRetry) {
    btnRetry.addEventListener('click', triggerRetry);
  }

  if (btnToggleLogo) {
    btnToggleLogo.addEventListener('click', toggleLogoView);
  }

  if (btnCopy) {
    btnCopy.addEventListener('click', copyErrorMessage);
  }

  console.log('WalletConnect Error Page initialized (Vanilla JS clone).');
})();
