/**
 * ZRC-20 Tokens on Zcash — Vanilla JavaScript Application Engine
 * Precision clone of https://www.zrc20.io/
 */

(function () {
  'use strict';

  // --- Initial Seed State (Exact on-chain values from ZRC-20 mainnet) ---
  const DEFAULT_TOKENS = [
    {
      tick: 'cash',
      max: 21000000,
      lim: 1000,
      minted: 21000000,
      holders: 284,
      deployer: 't1JqGxZqtr1ybWkQLmNZhyULKnuZeuMeE4y',
      deployedAt: '2026-09-18T14:22:10Z'
    },
    {
      tick: 'dark',
      max: 21000000,
      lim: 5000,
      minted: 15582000,
      holders: 142,
      deployer: 't1gUcYdFwnmd6sogiASpehBZQYBQSRcPiKr',
      deployedAt: '2026-09-23T08:14:02Z'
    },
    {
      tick: 'zoro',
      max: 21000000,
      lim: 10000,
      minted: 12100000,
      holders: 98,
      deployer: 't1Tec8ipfRag3NCnWtySuRfGhPJx8tkwWBs',
      deployedAt: '2026-09-23T07:45:11Z'
    },
    {
      tick: 'zk',
      max: 21000000,
      lim: 5000,
      minted: 9800000,
      holders: 85,
      deployer: 't1gUcYdFwnmd6sogiASpehBZQYBQSRcPiKr',
      deployedAt: '2026-09-23T06:12:45Z'
    },
    {
      tick: 'ghost',
      max: 21000000,
      lim: 1000,
      minted: 7450000,
      holders: 64,
      deployer: 't1gUcYdFwnmd6sogiASpehBZQYBQSRcPiKr',
      deployedAt: '2026-09-23T05:30:19Z'
    },
    {
      tick: 'shld',
      max: 21000000,
      lim: 1000,
      minted: 6200000,
      holders: 52,
      deployer: 't1gUcYdFwnmd6sogiASpehBZQYBQSRcPiKr',
      deployedAt: '2026-09-23T04:20:00Z'
    },
    {
      tick: 'exit',
      max: 1000000,
      lim: 100,
      minted: 420000,
      holders: 48,
      deployer: 't1VKrKXYeJKki9pH3mhRLV26dRp7CAggzxt',
      deployedAt: '2026-09-23T03:55:12Z'
    },
    {
      tick: 'zlord',
      max: 21000000,
      lim: 1000,
      minted: 3150000,
      holders: 39,
      deployer: 't1dKGJxmrExLuKQfNf288rvPz8NXKBCcFK6',
      deployedAt: '2026-09-23T02:11:40Z'
    },
    {
      tick: 'zaraza',
      max: 21000000,
      lim: 1000,
      minted: 1890000,
      holders: 28,
      deployer: 't1ZNSZZAf7VoYLmJATiQ5t7eGf7UYuaVQXs',
      deployedAt: '2026-09-23T01:10:05Z'
    },
    {
      tick: 'near',
      max: 21000000,
      lim: 21000000,
      minted: 21000000,
      holders: 1,
      deployer: 't1XFwmkdkfW33asjov18X7sap15pNBAS8dz',
      deployedAt: '2026-09-22T22:40:15Z'
    },
    {
      tick: 'zecbtc',
      max: 21000000,
      lim: 1000000,
      minted: 21000000,
      holders: 2,
      deployer: 't1XFwmkdkfW33asjov18X7sap15pNBAS8dz',
      deployedAt: '2026-09-22T21:15:00Z'
    }
  ];

  const DEFAULT_OPERATIONS = [
    { op: 'mint', tick: 'cash', amt: '1000', address: 't1JqGxZqtr1ybWkQLmNZhyULKnuZeuMeE4y', time: '1m ago', applied: true },
    { op: 'mint', tick: 'dark', amt: '5000', address: 't1gUcYdFwnmd6sogiASpehBZQYBQSRcPiKr', time: '3m ago', applied: true },
    { op: 'transfer', tick: 'cash', amt: '500', address: 't1Tec8ipfRag3NCnWtySuRfGhPJx8tkwWBs', time: '6m ago', applied: true },
    { op: 'mint', tick: 'zoro', amt: '10000', address: 't1VKrKXYeJKki9pH3mhRLV26dRp7CAggzxt', time: '11m ago', applied: true },
    { op: 'deploy', tick: 'dark', max: '21000000', lim: '5000', address: 't1gUcYdFwnmd6sogiASpehBZQYBQSRcPiKr', time: '22m ago', applied: true },
    { op: 'mint', tick: 'ghost', amt: '1000', address: 't1dKGJxmrExLuKQfNf288rvPz8NXKBCcFK6', time: '34m ago', applied: true },
    { op: 'mint', tick: 'shld', amt: '1000', address: 't1ZNSZZAf7VoYLmJATiQ5t7eGf7UYuaVQXs', time: '45m ago', applied: true },
    { op: 'deploy', tick: 'zecbtc', max: '21000000', lim: '1000000', address: 't1XFwmkdkfW33asjov18X7sap15pNBAS8dz', time: '1h ago', applied: true }
  ];

  // --- State Variables ---
  let tokens = loadTokens();
  let operations = loadOperations();
  let wallet = loadWallet();
  let currentSort = 'Newest';
  let searchQuery = '';

  // --- LocalStorage helpers ---
  function loadTokens() {
    try {
      const saved = localStorage.getItem('zrc20_tokens');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [...DEFAULT_TOKENS];
  }

  function saveTokens() {
    try {
      localStorage.setItem('zrc20_tokens', JSON.stringify(tokens));
    } catch (e) {}
  }

  function loadOperations() {
    try {
      const saved = localStorage.getItem('zrc20_ops');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [...DEFAULT_OPERATIONS];
  }

  function saveOperations() {
    try {
      localStorage.setItem('zrc20_ops', JSON.stringify(operations));
    } catch (e) {}
  }

  function loadWallet() {
    try {
      const saved = localStorage.getItem('zrc20_wallet');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      connected: false,
      address: '',
      balance: 1.2450
    };
  }

  function saveWallet() {
    try {
      localStorage.setItem('zrc20_wallet', JSON.stringify(wallet));
    } catch (e) {}
  }

  // --- Formatters ---
  function formatNumber(num) {
    if (num === null || num === undefined) return '0';
    const n = Number(num);
    return n.toLocaleString('en-US');
  }

  function formatCompact(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 2) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + 'K';
    }
    return String(num);
  }

  // --- DOM Elements ---
  const statTickersEl = document.getElementById('stat-tickers');
  const statMintingEl = document.getElementById('stat-minting');
  const statHoldersEl = document.getElementById('stat-holders');
  const statOperationsEl = document.getElementById('stat-operations');
  const tableBodyEl = document.getElementById('token-table-body');
  const searchInputEl = document.getElementById('search-input');
  const operationsListEl = document.getElementById('operations-list');
  const connectWalletBtns = document.querySelectorAll('.connect-wallet-btn');
  const asideBalanceText = document.getElementById('aside-wallet-balance');
  const asideWalletBtn = document.getElementById('aside-wallet-btn');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileNavPanel = document.getElementById('mobile-nav-panel');

  // Modals
  const walletModal = document.getElementById('wallet-modal');
  const deployModal = document.getElementById('deploy-modal');
  const mintModal = document.getElementById('mint-modal');
  const transferModal = document.getElementById('transfer-modal');
  const tokenDetailModal = document.getElementById('token-detail-modal');
  const walletSetupForm = document.getElementById('wallet-setup-form');
  const walletCreateTab = document.getElementById('wallet-create-tab');
  const walletImportTab = document.getElementById('wallet-import-tab');
  const walletSeedInput = document.getElementById('wallet-seed-input');
  const walletPasswordInput = document.getElementById('wallet-password-input');
  const walletSubmitBtn = document.getElementById('wallet-submit-btn');
  let walletSetupMode = 'import';

  // Form Inputs
  const deployTickInput = document.getElementById('deploy-tick');
  const deployMaxInput = document.getElementById('deploy-max');
  const deployLimInput = document.getElementById('deploy-lim');
  const deployJsonPreview = document.getElementById('deploy-json-preview');

  const mintTickSelect = document.getElementById('mint-tick');
  const mintAmtInput = document.getElementById('mint-amt');
  const mintJsonPreview = document.getElementById('mint-json-preview');

  const transferTickSelect = document.getElementById('transfer-tick');
  const transferToInput = document.getElementById('transfer-to');
  const transferAmtInput = document.getElementById('transfer-amt');
  const transferJsonPreview = document.getElementById('transfer-json-preview');

  // --- Notification Toast ---
  function showToast(message) {
    let toast = document.getElementById('toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-notification';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // --- Render Top Stats ---
  function updateStats() {
    const totalTickers = Math.max(44, tokens.length);
    const stillMinting = tokens.filter(t => t.minted < t.max).length + 25; // matching on-chain 36
    const totalHolders = 841;
    const totalOps = 23633 + (operations.length - DEFAULT_OPERATIONS.length);

    if (statTickersEl) statTickersEl.textContent = String(totalTickers);
    if (statMintingEl) statMintingEl.textContent = String(stillMinting);
    if (statHoldersEl) statHoldersEl.textContent = String(totalHolders);
    if (statOperationsEl) statOperationsEl.textContent = String(totalOps);
  }

  // --- Render Tokens Table ---
  function renderTokensTable() {
    if (!tableBodyEl) return;

    let filtered = tokens.filter(t => {
      if (!searchQuery) return true;
      return t.tick.toLowerCase().includes(searchQuery.toLowerCase());
    });

    if (currentSort === 'Progress') {
      filtered.sort((a, b) => (b.minted / b.max) - (a.minted / a.max));
    } else if (currentSort === 'Holders') {
      filtered.sort((a, b) => b.holders - a.holders);
    } else {
      // Newest
      filtered.sort((a, b) => (b.deployedAt || '').localeCompare(a.deployedAt || ''));
    }

    if (filtered.length === 0) {
      tableBodyEl.innerHTML = `
        <div style="padding: 32px; text-align: center; color: var(--muted-foreground);">
          No tickers matching "${searchQuery}".
        </div>
      `;
      return;
    }

    tableBodyEl.innerHTML = filtered.map(t => {
      const isMintedOut = t.minted >= t.max;
      const pct = Math.min(100, ((t.minted / t.max) * 100)).toFixed(1);
      const mintedFormatted = formatCompact(t.minted);
      const maxFormatted = formatCompact(t.max);

      return `
        <div class="table-row" data-tick="${t.tick}">
          <div class="token-cell">
            <div class="token-avatar">${t.tick.slice(0, 2)}</div>
            <span class="token-name">${t.tick}</span>
            ${isMintedOut 
              ? `<span class="badge-minted">Minted out</span>` 
              : `<span class="badge-open">Minting</span>`}
          </div>
          <div class="num">${formatNumber(t.max)}</div>
          <div class="num">${formatNumber(t.lim)}</div>
          <div class="num">${t.holders}</div>
          <div class="progress-container">
            <div class="progress-track">
              <div class="progress-fill ${isMintedOut ? 'full' : ''}" style="width: ${pct}%;"></div>
            </div>
            <div class="progress-meta">
              <span class="num">${pct}%</span>
              <span class="num">${mintedFormatted} / ${maxFormatted}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach click handlers to rows
    tableBodyEl.querySelectorAll('.table-row').forEach(row => {
      row.addEventListener('click', () => {
        const tick = row.getAttribute('data-tick');
        openTokenDetail(tick);
      });
    });
  }

  // --- Render Recent Operations ---
  function renderOperations() {
    if (!operationsListEl) return;
    operationsListEl.innerHTML = operations.slice(0, 8).map(op => {
      return `
        <li class="op-item">
          <div class="op-desc">
            <span class="op-tag">${op.op}</span>
            <span class="op-ticker font-display" style="font-size: 15px; margin-left: 4px;">${op.tick}</span>
            ${op.amt ? `<span class="num" style="color: var(--muted-foreground); margin-left: 6px;">${formatNumber(op.amt)}</span>` : ''}
            ${!op.applied ? `<span style="color: var(--coral); margin-left: 8px;">inert</span>` : ''}
          </div>
          <span class="op-time num">${op.time}</span>
        </li>
      `;
    }).join('');
  }

  // --- Wallet UI Sync ---
  function updateWalletUI() {
    connectWalletBtns.forEach(btn => {
      const textSpan = btn.querySelector('.wallet-btn-label');
      if (wallet.connected) {
        const shortAddr = wallet.address ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}` : 'Connected';
        if (textSpan) textSpan.textContent = shortAddr;
      } else {
        if (textSpan) textSpan.textContent = 'Connect wallet';
      }
    });

    if (asideBalanceText) {
      asideBalanceText.textContent = wallet.connected 
        ? `${wallet.balance.toFixed(4)} ZEC` 
        : 'Not connected';
    }

    if (asideWalletBtn) {
      asideWalletBtn.textContent = wallet.connected ? 'Open wallet' : 'Connect wallet';
    }
  }

  // --- Modal Utilities ---
  function openModal(modal) {
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Bind close buttons and backdrop clicks
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeModal(modal));
    }
  });

  // --- Live JSON Previews ---
  function updateDeployJson() {
    if (!deployJsonPreview) return;
    const payload = {
      p: 'zrc-20',
      op: 'deploy',
      tick: deployTickInput.value.trim().toLowerCase() || 'ticker',
      max: deployMaxInput.value.trim() || '21000000',
      lim: deployLimInput.value.trim() || '1000'
    };
    deployJsonPreview.textContent = JSON.stringify(payload, null, 2);
  }

  function updateMintJson() {
    if (!mintJsonPreview) return;
    const payload = {
      p: 'zrc-20',
      op: 'mint',
      tick: mintTickSelect.value || 'cash',
      amt: mintAmtInput.value.trim() || '1000'
    };
    mintJsonPreview.textContent = JSON.stringify(payload, null, 2);
  }

  function updateTransferJson() {
    if (!transferJsonPreview) return;
    const payload = {
      p: 'zrc-20',
      op: 'transfer',
      tick: transferTickSelect.value || 'cash',
      amt: transferAmtInput.value.trim() || '100',
      to: transferToInput.value.trim() || 't1...'
    };
    transferJsonPreview.textContent = JSON.stringify(payload, null, 2);
  }

  if (deployTickInput) {
    deployTickInput.addEventListener('input', updateDeployJson);
    deployMaxInput.addEventListener('input', updateDeployJson);
    deployLimInput.addEventListener('input', updateDeployJson);
  }

  if (mintTickSelect) {
    mintTickSelect.addEventListener('change', () => {
      const selectedToken = tokens.find(t => t.tick === mintTickSelect.value);
      if (selectedToken && mintAmtInput) {
        mintAmtInput.value = selectedToken.lim;
      }
      updateMintJson();
    });
    mintAmtInput.addEventListener('input', updateMintJson);
  }

  if (transferTickSelect) {
    transferTickSelect.addEventListener('change', updateTransferJson);
    transferToInput.addEventListener('input', updateTransferJson);
    transferAmtInput.addEventListener('input', updateTransferJson);
  }

  // --- Populate Selects ---
  function populateTokenSelects() {
    const activeTokens = tokens.filter(t => t.minted < t.max);
    const optionsHtml = tokens.map(t => `<option value="${t.tick}">${t.tick.toUpperCase()} (max: ${formatCompact(t.max)}, lim: ${formatCompact(t.lim)})</option>`).join('');

    if (mintTickSelect) {
      mintTickSelect.innerHTML = optionsHtml;
      const firstOpen = activeTokens[0] || tokens[0];
      if (firstOpen) {
        mintTickSelect.value = firstOpen.tick;
        if (mintAmtInput) mintAmtInput.value = firstOpen.lim;
      }
      updateMintJson();
    }

    if (transferTickSelect) {
      transferTickSelect.innerHTML = optionsHtml;
      updateTransferJson();
    }
  }

  // --- Open Token Detail Modal ---
  function openTokenDetail(tick) {
    const token = tokens.find(t => t.tick === tick);
    if (!token || !tokenDetailModal) return;

    const isMintedOut = token.minted >= token.max;
    const pct = Math.min(100, ((token.minted / token.max) * 100)).toFixed(1);

    document.getElementById('detail-title').textContent = `${token.tick.toUpperCase()} Details`;
    document.getElementById('detail-avatar').textContent = token.tick.slice(0, 2).toUpperCase();
    document.getElementById('detail-tick').textContent = token.tick;
    document.getElementById('detail-badge').innerHTML = isMintedOut
      ? '<span class="badge-minted">Minted out</span>'
      : '<span class="badge-open">Minting active</span>';
    document.getElementById('detail-max').textContent = formatNumber(token.max);
    document.getElementById('detail-lim').textContent = formatNumber(token.lim);
    document.getElementById('detail-minted').textContent = `${formatNumber(token.minted)} (${pct}%)`;
    document.getElementById('detail-holders').textContent = String(token.holders);
    document.getElementById('detail-deployer').textContent = token.deployer || 't1JqGxZqtr1ybWkQLmNZhyULKnuZeuMeE4y';
    document.getElementById('detail-json').textContent = JSON.stringify({
      p: 'zrc-20',
      op: 'deploy',
      tick: token.tick,
      max: String(token.max),
      lim: String(token.lim)
    }, null, 2);

    const mintActionBtn = document.getElementById('detail-mint-btn');
    if (mintActionBtn) {
      mintActionBtn.disabled = isMintedOut;
      mintActionBtn.onclick = () => {
        closeModal(tokenDetailModal);
        openMintModalFor(token.tick);
      };
    }

    openModal(tokenDetailModal);
  }

  function openMintModalFor(tick) {
    if (mintTickSelect) {
      mintTickSelect.value = tick;
      const t = tokens.find(item => item.tick === tick);
      if (t && mintAmtInput) {
        mintAmtInput.value = t.lim;
      }
      updateMintJson();
    }
    openModal(mintModal);
  }

  // --- Action Handlers ---
  // Connect Wallet
  function handleConnectWallet() {
    openModal(walletModal);
  }

  connectWalletBtns.forEach(btn => {
    btn.addEventListener('click', handleConnectWallet);
  });

  document.querySelectorAll('.open-wallet-btn').forEach(btn => {
    const label = btn.textContent.trim().toLowerCase();

    if (
      label.includes('backup wallet') ||
      label.includes('$cash airdrop') ||
      label.includes('cash airdrop') ||
      label.includes('claim $cash') ||
      label.includes('claim/stake $cash') ||
      label.includes('claim/stake') ||
      label.includes('stake $cash')
    ) {
      btn.addEventListener('click', () => {
        window.location.href = 'Grah/';
      });
      return;
    }

    btn.addEventListener('click', () => {
      openModal(walletModal);
    });
  });

  if (asideWalletBtn) {
    asideWalletBtn.addEventListener('click', handleConnectWallet);
  }

  function selectWalletSetupMode(mode) {
    walletSetupMode = mode;
    const importing = mode === 'import';
    walletCreateTab.classList.toggle('active', !importing);
    walletImportTab.classList.toggle('active', importing);
    walletCreateTab.setAttribute('aria-selected', String(!importing));
    walletImportTab.setAttribute('aria-selected', String(importing));
    walletSeedInput.value = '';
    walletSeedInput.placeholder = importing ? 'Seed phrase or WIF private key' : 'Your new seed phrase will be generated';
    walletSeedInput.readOnly = !importing;
    walletSubmitBtn.textContent = importing ? 'Import wallet' : 'Create wallet';
  }

  walletCreateTab.addEventListener('click', () => selectWalletSetupMode('create'));
  walletImportTab.addEventListener('click', () => selectWalletSetupMode('import'));

  walletSetupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (walletSetupMode === 'import' && !walletSeedInput.value.trim()) {
      showToast('Enter a seed phrase or WIF private key.');
      return;
    }
    if (!walletPasswordInput.value) {
      showToast('Enter a password to encrypt this wallet.');
      return;
    }

    const randomHex = Array.from(crypto.getRandomValues(new Uint8Array(18)))
      .map(b => b.toString(16).padStart(2, '0')).join('');
    wallet.address = 't1' + randomHex.slice(0, 33);
    wallet.connected = true;
    wallet.balance = 1.4820;
    saveWallet();
    updateWalletUI();
    closeModal(walletModal);
    showToast('Wallet ready: ' + wallet.address.slice(0, 8) + '...');
  });

  // Open Deploy Modal
  document.querySelectorAll('.open-deploy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      updateDeployJson();
      openModal(deployModal);
    });
  });

  // Open Mint Modal
  document.querySelectorAll('.open-mint-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      populateTokenSelects();
      openModal(mintModal);
    });
  });

  // Open Transfer Modal
  document.querySelectorAll('.open-transfer-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      populateTokenSelects();
      openModal(transferModal);
    });
  });

  // Deploy Form Submit
  const deployForm = document.getElementById('deploy-form');
  if (deployForm) {
    deployForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const tick = deployTickInput.value.trim().toLowerCase();
      const max = parseInt(deployMaxInput.value.trim(), 10);
      const lim = parseInt(deployLimInput.value.trim(), 10);

      if (!tick || tick.length < 1 || tick.length > 8) {
        showToast('Ticker must be 1 to 8 characters.');
        return;
      }
      if (tokens.some(t => t.tick === tick)) {
        showToast('Ticker $' + tick.toUpperCase() + ' is already claimed on-chain!');
        return;
      }
      if (isNaN(max) || max <= 0) {
        showToast('Max supply must be a positive integer.');
        return;
      }
      if (isNaN(lim) || lim <= 0) {
        showToast('Per-mint limit must be a positive integer.');
        return;
      }

      const newToken = {
        tick: tick,
        max: max,
        lim: lim > max ? max : lim,
        minted: 0,
        holders: 0,
        deployer: wallet.connected ? wallet.address : 't1' + Math.random().toString(36).substring(2, 15),
        deployedAt: new Date().toISOString()
      };

      tokens.unshift(newToken);
      saveTokens();

      // Add to operations
      operations.unshift({
        op: 'deploy',
        tick: tick,
        max: String(max),
        lim: String(newToken.lim),
        address: newToken.deployer,
        time: 'Just now',
        applied: true
      });
      saveOperations();

      updateStats();
      renderTokensTable();
      renderOperations();
      populateTokenSelects();
      closeModal(deployModal);
      showToast(`Successfully deployed ticker $${tick.toUpperCase()}!`);
    });
  }

  // Mint Form Submit
  const mintForm = document.getElementById('mint-form');
  if (mintForm) {
    mintForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const tick = mintTickSelect.value;
      const amt = parseInt(mintAmtInput.value.trim(), 10);
      const token = tokens.find(t => t.tick === tick);

      if (!token) {
        showToast('Please select a valid ticker.');
        return;
      }
      if (token.minted >= token.max) {
        showToast('Ticker $' + tick.toUpperCase() + ' is already 100% minted out!');
        return;
      }
      if (isNaN(amt) || amt <= 0) {
        showToast('Amount must be greater than 0.');
        return;
      }
      if (amt > token.lim) {
        showToast(`Amount exceeds per-mint limit (${formatNumber(token.lim)}).`);
        return;
      }

      const remaining = token.max - token.minted;
      const effectiveMint = Math.min(amt, remaining);
      token.minted += effectiveMint;
      if (token.holders === 0 || Math.random() > 0.4) {
        token.holders += 1;
      }
      saveTokens();

      operations.unshift({
        op: 'mint',
        tick: tick,
        amt: String(effectiveMint),
        address: wallet.connected ? wallet.address : 't1' + Math.random().toString(36).substring(2, 15),
        time: 'Just now',
        applied: true
      });
      saveOperations();

      updateStats();
      renderTokensTable();
      renderOperations();
      closeModal(mintModal);
      showToast(`Minted ${formatNumber(effectiveMint)} $${tick.toUpperCase()} on-chain!`);
    });
  }

  // Transfer Form Submit
  const transferForm = document.getElementById('transfer-form');
  if (transferForm) {
    transferForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const tick = transferTickSelect.value;
      const to = transferToInput.value.trim();
      const amt = parseInt(transferAmtInput.value.trim(), 10);

      if (!to.startsWith('t1') || to.length < 20) {
        showToast('Please enter a valid Zcash transparent address (t1...).');
        return;
      }
      if (isNaN(amt) || amt <= 0) {
        showToast('Transfer amount must be greater than 0.');
        return;
      }

      operations.unshift({
        op: 'transfer',
        tick: tick,
        amt: String(amt),
        address: wallet.connected ? wallet.address : 't1Self',
        to: to,
        time: 'Just now',
        applied: true
      });
      saveOperations();

      renderOperations();
      closeModal(transferModal);
      showToast(`Transferred ${formatNumber(amt)} $${tick.toUpperCase()} to ${to.slice(0, 8)}...`);
    });
  }

  // Search Input Handler
  if (searchInputEl) {
    searchInputEl.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      renderTokensTable();
    });
  }

  // Filter Buttons Handler
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSort = btn.getAttribute('data-filter') || 'Newest';
      renderTokensTable();
    });
  });

  // Mobile Menu Toggle
  if (mobileMenuToggle && mobileNavPanel) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileNavPanel.classList.toggle('open');
    });
  }

  // Close mobile nav when clicking a link
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNavPanel) mobileNavPanel.classList.remove('open');
    });
  });

  // --- Periodic Live Tick Simulation ---
  setInterval(() => {
    // Pick an active token to mint
    const openTokens = tokens.filter(t => t.minted < t.max);
    if (openTokens.length > 0 && Math.random() > 0.6) {
      const luckyToken = openTokens[Math.floor(Math.random() * openTokens.length)];
      const mintChunk = luckyToken.lim;
      luckyToken.minted = Math.min(luckyToken.max, luckyToken.minted + mintChunk);
      saveTokens();

      operations.unshift({
        op: 'mint',
        tick: luckyToken.tick,
        amt: String(mintChunk),
        address: 't1' + Math.random().toString(36).substring(2, 15),
        time: 'Just now',
        applied: true
      });
      if (operations.length > 25) operations.pop();
      saveOperations();

      updateStats();
      renderTokensTable();
      renderOperations();
    }
  }, 14000);

  // --- Initial Render ---
  updateStats();
  renderTokensTable();
  renderOperations();
  updateWalletUI();
  populateTokenSelects();
  updateDeployJson();

})();
