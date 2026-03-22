const previewFrame = document.getElementById('previewFrame');
const previewSite = document.getElementById('previewSite');
const previewHero = document.getElementById('section-hero');
const previewTitle = document.getElementById('previewTitle');
const productGrid = document.getElementById('productGrid');
const footerSection = document.getElementById('section-footer');

const controls = document.getElementById('controls');
const controlGroups = document.querySelectorAll('.control-group');
const deviceButtons = document.querySelectorAll('.device-btn');

let isSyncingFromControls = false;
let syncTimer = null;

/* --------------------------
   デバイス切替
-------------------------- */
function updateDevice(value) {
  previewFrame.classList.remove('device-pc', 'device-tablet', 'device-mobile');
  previewFrame.classList.add(`device-${value}`);

  deviceButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.device === value);
  });
}

deviceButtons.forEach((button) => {
  button.addEventListener('click', () => {
    updateDevice(button.dataset.device);
  });
});

/* --------------------------
   HERO設定
-------------------------- */
function updateTitlePosition(value) {
  previewTitle.classList.remove(
    'preview-title-left',
    'preview-title-center',
    'preview-title-right'
  );
  previewTitle.classList.add(`preview-title-${value}`);
}

function updateTitleSize(value) {
  previewTitle.classList.remove(
    'preview-title-small',
    'preview-title-medium',
    'preview-title-large'
  );
  previewTitle.classList.add(`preview-title-${value}`);
}

function updateBackgroundTone(value) {
  previewHero.classList.remove(
    'preview-light',
    'preview-beige',
    'preview-dark'
  );
  previewHero.classList.add(`preview-${value}`);
}

function updateSpacing(value) {
  previewHero.classList.remove(
    'preview-space-compact',
    'preview-space-normal',
    'preview-space-wide'
  );
  previewHero.classList.add(`preview-space-${value}`);
}

document.querySelectorAll('input[name="title_position"]').forEach((input) => {
  input.addEventListener('change', (e) => {
    updateTitlePosition(e.target.value);
  });
});

document.querySelectorAll('input[name="title_size"]').forEach((input) => {
  input.addEventListener('change', (e) => {
    updateTitleSize(e.target.value);
  });
});

document.querySelectorAll('input[name="bg_tone"]').forEach((input) => {
  input.addEventListener('change', (e) => {
    updateBackgroundTone(e.target.value);
  });
});

document.querySelectorAll('input[name="spacing"]').forEach((input) => {
  input.addEventListener('change', (e) => {
    updateSpacing(e.target.value);
  });
});

/* --------------------------
   商品一覧
-------------------------- */
function updateProductLayout(value) {
  productGrid.classList.remove('product-grid-2', 'product-grid-3');
  productGrid.classList.add(`product-grid-${value}`);
}

document.querySelectorAll('input[name="product_layout"]').forEach((input) => {
  input.addEventListener('change', (e) => {
    updateProductLayout(e.target.value);
  });
});

/* --------------------------
   フッター
-------------------------- */
function updateFooterTone(value) {
  footerSection.classList.remove('footer-light', 'footer-dark');
  footerSection.classList.add(`footer-${value}`);
}

document.querySelectorAll('input[name="footer_tone"]').forEach((input) => {
  input.addEventListener('change', (e) => {
    updateFooterTone(e.target.value);
  });
});

/* --------------------------
   右クリック → 左へ移動
-------------------------- */
function scrollPreviewToTarget(targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;

  previewSite.scrollTo({
    top: target.offsetTop,
    behavior: 'smooth'
  });
}

controlGroups.forEach((group) => {
  group.addEventListener('click', (e) => {
    const clickedLabel = e.target.closest('label');
    const clickedHeading = e.target.closest('h3');
    const clickedGroup = e.currentTarget;

    if (clickedLabel || clickedHeading || clickedGroup) {
      scrollPreviewToTarget(clickedGroup.dataset.target);
      setActiveGroup(clickedGroup);
    }
  });
});

/* --------------------------
   右スクロール → 左へ追従
-------------------------- */
function setActiveGroup(activeGroup) {
  controlGroups.forEach((group) => {
    group.classList.toggle('active', group === activeGroup);
  });
}

function syncPreviewToNearestGroup() {
  const controlsRect = controls.getBoundingClientRect();
  const controlsCenter = controlsRect.top + controlsRect.height * 0.35;

  let nearestGroup = null;
  let nearestDistance = Infinity;

  controlGroups.forEach((group) => {
    const rect = group.getBoundingClientRect();
    const groupCenter = rect.top + rect.height / 2;
    const distance = Math.abs(groupCenter - controlsCenter);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestGroup = group;
    }
  });

  if (!nearestGroup) return;

  setActiveGroup(nearestGroup);

  isSyncingFromControls = true;
  scrollPreviewToTarget(nearestGroup.dataset.target);

  clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    isSyncingFromControls = false;
  }, 450);
}

controls.addEventListener('scroll', () => {
  if (isSyncingFromControls) return;
  syncPreviewToNearestGroup();
});

/* --------------------------
   フォームデータ取得
-------------------------- */
function getFormData() {
    return {
      title_position: document.querySelector('input[name="title_position"]:checked')?.value || "",
      title_size: document.querySelector('input[name="title_size"]:checked')?.value || "",
      bg_tone: document.querySelector('input[name="bg_tone"]:checked')?.value || "",
      spacing: document.querySelector('input[name="spacing"]:checked')?.value || "",
      product_layout: document.querySelector('input[name="product_layout"]:checked')?.value || "",
      footer_tone: document.querySelector('input[name="footer_tone"]:checked')?.value || "",
    };
  }
  
  /* --------------------------
     結果URL生成
  -------------------------- */
  function generateResultURL(data) {
    const params = new URLSearchParams({
      title_position: data.title_position,
      title_size: data.title_size,
      bg_tone: data.bg_tone,
      spacing: data.spacing,
      product_layout: data.product_layout,
      footer_tone: data.footer_tone,
      locked: "1",
    });
  
    return `https://Kazuki-Ichikawa52.github.io/config-tool/result.html?${params.toString()}`;
  }
  
  /* --------------------------
     URLパラメータ取得
  -------------------------- */
  function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
  
    return {
      title_position: params.get("title_position"),
      title_size: params.get("title_size"),
      bg_tone: params.get("bg_tone"),
      spacing: params.get("spacing"),
      product_layout: params.get("product_layout"),
      footer_tone: params.get("footer_tone"),
      locked: params.get("locked"),
    };
  }
  
  /* --------------------------
     値を画面へ反映
  -------------------------- */
  function applyData(data) {
    if (data.title_position) updateTitlePosition(data.title_position);
    if (data.title_size) updateTitleSize(data.title_size);
    if (data.bg_tone) updateBackgroundTone(data.bg_tone);
    if (data.spacing) updateSpacing(data.spacing);
    if (data.product_layout) updateProductLayout(data.product_layout);
    if (data.footer_tone) updateFooterTone(data.footer_tone);
  
    Object.keys(data).forEach((key) => {
      const input = document.querySelector(`input[name="${key}"][value="${data[key]}"]`);
      if (input) input.checked = true;
    });
  }
  
  /* --------------------------
     UIロック
  -------------------------- */
  function lockUI() {
    document.querySelectorAll('input[type="radio"]').forEach((el) => {
      el.disabled = true;
    });
  }
  
  /* --------------------------
     送信処理
  -------------------------- */
  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      const formData = getFormData();
      const resultURL = generateResultURL(formData);
  
      const message = `
  【サイト設計結果】
  
  ・タイトル位置：${formData.title_position}
  ・タイトルサイズ：${formData.title_size}
  ・背景：${formData.bg_tone}
  ・余白：${formData.spacing}
  ・商品：${formData.product_layout}列
  ・フッター：${formData.footer_tone}
  
  ▼確認URL
  ${resultURL}
  `;
  
      if (typeof emailjs === "undefined") {
        alert("EmailJS が読み込まれていません");
        console.log(message);
        return;
      }
  
      emailjs.send("service_cgbkiwu", "template_n02707e", {
        message: message,
      })
      .then(() => {
        alert("送信完了！");
      })
      .catch((error) => {
        console.error(error);
        alert("送信失敗");
      });
    });
  }
  
  /* --------------------------
     初期化
  -------------------------- */
  updateDevice("pc");
  updateTitlePosition("center");
  updateTitleSize("medium");
  updateBackgroundTone("light");
  updateSpacing("normal");
  updateProductLayout("2");
  updateFooterTone("light");
  setActiveGroup(document.querySelector(".control-group.active") || controlGroups[0]);
  
  const queryData = getQueryParams();
  
  if (queryData && Object.values(queryData).some((value) => value)) {
    applyData(queryData);
  
    if (queryData.locked === "1") {
      lockUI();
    }
  }
