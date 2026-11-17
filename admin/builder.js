/**
 * PINGADO BUILDER — CORE ENGINE (ESTILO CARRD)
 * Editor visual in-context, toolbar, gaveta lateral e publicação direta no GitHub
 */

// Estado Global do Builder
const state = {
  activePage: 'index.html',
  selectedElement: null,
  undoStack: [],
  redoStack: [],
  isMobileView: false,
  hasUnsavedChanges: false,
  config: {
    repo: 'Lariikimie/Locked-Unit-Design-System',
    branch: 'main',
    token: localStorage.getItem('pingado_builder_token') || ''
  }
};

// Cores e Tokens Oficiais do Projeto
const TOKENS = {
  '#0A0D12': 'Preto Abissal (Fundo)',
  '#1C222B': 'Chapa de Aço (Superfície)',
  '#485261': 'Borda Metálica',
  '#00D2FF': 'Ciano Elétrico (Destaque)',
  '#F0B604': 'Amarelo Industrial (Alerta)',
  '#FF2A2A': 'Vermelho de Tensão (Perigo)',
  '#F01A12': 'Vermelho Pingado (Estúdio)',
  '#F5F7FA': 'Branco Titânio (Texto)',
  '#0072F5': 'Genius 1: Azul Elétrico',
  '#FF7A00': 'Genius 2: Laranja Vibrante',
  '#A020F0': 'Genius 3: Roxo Neon',
  '#FFD60A': 'Genius 4: Amarelo Intenso',
  '#FF3CAC': 'Genius 5: Magenta Vibrante'
};

document.addEventListener('DOMContentLoaded', () => {
  initUI();
  initIframe();
  initColorChips();
});

// Inicialização da Interface
function initUI() {
  const pageSelect = document.getElementById('pageSelector');
  const viewToggle = document.getElementById('viewToggle');
  const addBtn = document.getElementById('addBtn');
  const publishBtn = document.getElementById('publishBtn');
  const tokenBtn = document.getElementById('tokenBtn');
  const undoBtn = document.getElementById('undoBtn');
  const redoBtn = document.getElementById('redoBtn');

  // Alternador de Páginas
  pageSelect.addEventListener('change', (e) => {
    switchPage(e.target.value);
  });

  // Alternador Desktop / Mobile
  viewToggle.addEventListener('click', () => {
    state.isMobileView = !state.isMobileView;
    const frameWrap = document.querySelector('.canvas-frame-wrap');
    if (state.isMobileView) {
      frameWrap.classList.add('mobile-view');
      viewToggle.classList.add('active');
      viewToggle.innerHTML = '<span>📱</span> Celular';
    } else {
      frameWrap.classList.remove('mobile-view');
      viewToggle.classList.remove('active');
      viewToggle.innerHTML = '<span>💻</span> Desktop';
    }
  });

  // Botões de Desfazer / Refazer
  undoBtn.addEventListener('click', undo);
  redoBtn.addEventListener('click', redo);

  // Modal de Adicionar Elemento
  addBtn.addEventListener('click', () => {
    document.getElementById('addModal').classList.add('show');
  });

  // Modal de Token GitHub
  tokenBtn.addEventListener('click', openTokenModal);

  // Botão de Publicação no GitHub
  publishBtn.addEventListener('click', publishToGitHub);

  // Fechar Gaveta Lateral
  document.getElementById('drawerCloseBtn').addEventListener('click', deselectElement);

  // Abas da Gaveta (Conteúdo, Aparência, Configurações)
  document.querySelectorAll('.drawer-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.drawer-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const targetPane = document.getElementById(tab.getAttribute('data-tab'));
      if (targetPane) targetPane.classList.add('active');
    });
  });

  // Fechar modais ao clicar no fundo ou no botão fechar
  document.querySelectorAll('.builder-modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('modal-close-btn')) {
        modal.classList.remove('show');
      }
    });
  });

  // Configuração dos Componentes do Modal Adicionar (+)
  document.querySelectorAll('[data-add-component]').forEach(card => {
    card.addEventListener('click', () => {
      const componentType = card.getAttribute('data-add-component');
      addComponent(componentType);
      document.getElementById('addModal').classList.remove('show');
    });
  });

  // Ações de Rodapé da Gaveta (Duplicar, Mover, Excluir)
  document.getElementById('btnDuplicate').addEventListener('click', duplicateSelectedElement);
  document.getElementById('btnDelete').addEventListener('click', deleteSelectedElement);
  document.getElementById('btnMoveUp').addEventListener('click', moveSelectedElementUp);
  document.getElementById('btnMoveDown').addEventListener('click', moveSelectedElementDown);
}

// Inicializa o Iframe e seus Listeners
function initIframe() {
  const iframe = document.getElementById('siteIframe');

  iframe.addEventListener('load', () => {
    injectIframeStyles(iframe);
    setupIframeListeners(iframe);
    pushSnapshot();
    showToast(`Página ${state.activePage} carregada no editor.`);
  });

  iframe.src = `../${state.activePage}`;
}

// Alternar página ativa
function switchPage(page) {
  if (state.hasUnsavedChanges) {
    if (!confirm('Você tem alterações não publicadas nesta página. Deseja trocar de página mesmo assim?')) {
      document.getElementById('pageSelector').value = state.activePage;
      return;
    }
  }
  state.activePage = page;
  deselectElement();
  state.undoStack = [];
  state.redoStack = [];
  updateUndoRedoButtons();
  const iframe = document.getElementById('siteIframe');
  iframe.src = `../${page}`;
}

// Injeta estilos auxiliares de seleção no Iframe
function injectIframeStyles(iframe) {
  try {
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    if (!doc.head) return;

    let style = doc.getElementById('builder-injected-style');
    if (!style) {
      style = doc.createElement('style');
      style.id = 'builder-injected-style';
      style.textContent = `
        .builder-hover-target {
          outline: 2px dashed rgba(0, 210, 255, 0.5) !important;
          outline-offset: 3px !important;
          cursor: pointer !important;
        }
        .builder-selected-target {
          outline: 2px solid #00d2ff !important;
          outline-offset: 4px !important;
          box-shadow: 0 0 20px rgba(0, 210, 255, 0.45) !important;
          position: relative !important;
        }
        [contenteditable="true"]:focus {
          outline: 2px solid #f0b604 !important;
          box-shadow: 0 0 15px rgba(240, 182, 4, 0.4) !important;
        }
      `;
      doc.head.appendChild(style);
    }
  } catch (e) {
    console.warn("Cross-origin or iframe access note:", e);
  }
}

// Configura os ouvintes de seleção e edição dentro do Iframe
function setupIframeListeners(iframe) {
  try {
    const doc = iframe.contentDocument || iframe.contentWindow.document;

    // Hover effect
    doc.body.addEventListener('mouseover', (e) => {
      const target = getEligibleTarget(e.target);
      if (!target || target === state.selectedElement) return;
      target.classList.add('builder-hover-target');
    });

    doc.body.addEventListener('mouseout', (e) => {
      const target = getEligibleTarget(e.target);
      if (target) target.classList.remove('builder-hover-target');
    });

    // Clique de Seleção
    doc.body.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const target = getEligibleTarget(e.target);
      if (!target) return;

      selectElement(target);
    });

    // Duplo clique para edição inline WYSIWYG
    doc.body.addEventListener('dblclick', (e) => {
      const target = getEligibleTarget(e.target);
      if (!target) return;

      if (['H1','H2','H3','H4','P','SPAN','A','BUTTON','LI','TD','TH'].includes(target.tagName)) {
        target.setAttribute('contenteditable', 'true');
        target.focus();

        target.addEventListener('blur', () => {
          target.removeAttribute('contenteditable');
          syncDrawerContent();
          pushSnapshot();
        }, { once: true });
      }
    });

    // Tecla ESC desmarca elemento
    doc.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') deselectElement();
    });

  } catch (e) {
    console.error("Erro ao configurar ouvintes do iframe:", e);
  }
}

// Filtra elementos editáveis
function getEligibleTarget(el) {
  if (!el || el === document.body || el.tagName === 'HTML' || el.tagName === 'BODY') return null;
  if (el.closest('.site-header') || el.closest('.site-footer')) {
    // Permite editar textos do header/footer também
    return el;
  }
  return el;
}

// Seleciona elemento e abre a Gaveta Lateral (Carrd Drawer)
function selectElement(el) {
  deselectElement();

  state.selectedElement = el;
  el.classList.add('builder-selected-target');
  el.classList.remove('builder-hover-target');

  // Abre a gaveta
  const drawer = document.getElementById('propertiesDrawer');
  drawer.classList.add('open');

  // Popula os dados do elemento na gaveta
  populateDrawer(el);
}

// Desmarca elemento e fecha a gaveta
function deselectElement() {
  if (state.selectedElement) {
    state.selectedElement.classList.remove('builder-selected-target');
    state.selectedElement = null;
  }
  document.getElementById('propertiesDrawer').classList.remove('open');
}

// Popula os campos da Gaveta com os dados do elemento selecionado
function populateDrawer(el) {
  const tagBadge = document.getElementById('drawerElementTag');
  const labelText = document.getElementById('drawerElementLabel');
  const textInput = document.getElementById('fieldContentText');
  const urlFieldWrap = document.getElementById('fieldUrlWrap');
  const urlInput = document.getElementById('fieldContentUrl');
  const fontSizeInput = document.getElementById('fieldAppearanceFontSize');
  const fontFamilySelect = document.getElementById('fieldAppearanceFont');
  const idInput = document.getElementById('fieldSettingsId');
  const classInput = document.getElementById('fieldSettingsClass');
  const copyAttrInput = document.getElementById('fieldSettingsDataCopy');

  const tagName = el.tagName.toUpperCase();
  tagBadge.textContent = tagName;
  labelText.textContent = el.className ? `.${el.className.split(' ')[0]}` : tagName;

  // Conteúdo textual
  textInput.value = el.innerText || el.textContent || '';
  textInput.oninput = () => {
    el.innerText = textInput.value;
    state.hasUnsavedChanges = true;
  };

  // URL (Links ou Imagens)
  if (el.tagName === 'A' || el.tagName === 'IMG') {
    urlFieldWrap.style.display = 'block';
    urlInput.value = el.getAttribute('href') || el.getAttribute('src') || '';
    urlInput.oninput = () => {
      if (el.tagName === 'A') el.setAttribute('href', urlInput.value);
      if (el.tagName === 'IMG') el.setAttribute('src', urlInput.value);
      state.hasUnsavedChanges = true;
    };
  } else {
    urlFieldWrap.style.display = 'none';
  }

  // Estilos
  const computed = window.getComputedStyle(el);
  fontSizeInput.value = parseInt(computed.fontSize) || 16;
  fontSizeInput.oninput = () => {
    el.style.fontSize = `${fontSizeInput.value}px`;
    state.hasUnsavedChanges = true;
  };

  fontFamilySelect.value = computed.fontFamily.split(',')[0].replace(/['"]/g, '').trim();
  fontFamilySelect.onchange = () => {
    el.style.fontFamily = fontFamilySelect.value;
    state.hasUnsavedChanges = true;
  };

  // Alinhamento
  document.querySelectorAll('[data-align]').forEach(btn => {
    btn.onclick = () => {
      el.style.textAlign = btn.getAttribute('data-align');
      state.hasUnsavedChanges = true;
    };
  });

  // Configurações (ID, Classes, data-copy)
  idInput.value = el.id || '';
  idInput.oninput = () => { el.id = idInput.value; };

  classInput.value = el.className.replace('builder-selected-target', '').trim();
  classInput.oninput = () => { el.className = `${classInput.value} builder-selected-target`; };

  copyAttrInput.value = el.getAttribute('data-copy') || el.getAttribute('data-copy-target') || '';
  copyAttrInput.oninput = () => {
    if (copyAttrInput.value) {
      el.setAttribute('data-copy', copyAttrInput.value);
    } else {
      el.removeAttribute('data-copy');
    }
  };
}

// Sincroniza o texto da gaveta caso editado inline
function syncDrawerContent() {
  if (!state.selectedElement) return;
  const textInput = document.getElementById('fieldContentText');
  textInput.value = state.selectedElement.innerText || state.selectedElement.textContent || '';
}

// Inicializa os chips de cores oficiais (Tokens do Carrd Drawer)
function initColorChips() {
  const container = document.getElementById('colorChipsContainer');
  container.innerHTML = '';

  Object.entries(TOKENS).forEach(([hex, name]) => {
    const chip = document.createElement('div');
    chip.className = 'color-chip';
    chip.style.backgroundColor = hex;
    chip.title = `${name} (${hex})`;

    chip.addEventListener('click', () => {
      if (!state.selectedElement) return;
      // Aplica como cor de texto se for texto, ou como fundo se for container
      if (['P','H1','H2','H3','H4','SPAN','A','STRONG','CODE','KBD'].includes(state.selectedElement.tagName)) {
        state.selectedElement.style.color = hex;
      } else {
        state.selectedElement.style.backgroundColor = hex;
      }
      state.hasUnsavedChanges = true;
      pushSnapshot();
    });

    container.appendChild(chip);
  });
}

// Ações de Manipulação de Elementos
function duplicateSelectedElement() {
  if (!state.selectedElement) return;
  const clone = state.selectedElement.cloneNode(true);
  clone.classList.remove('builder-selected-target');
  state.selectedElement.parentNode.insertBefore(clone, state.selectedElement.nextSibling);
  selectElement(clone);
  pushSnapshot();
  showToast('Elemento duplicado com sucesso.');
}

function deleteSelectedElement() {
  if (!state.selectedElement) return;
  if (confirm('Deseja realmente excluir o elemento selecionado?')) {
    const parent = state.selectedElement.parentNode;
    state.selectedElement.remove();
    deselectElement();
    pushSnapshot();
    showToast('Elemento excluído.');
  }
}

function moveSelectedElementUp() {
  if (!state.selectedElement) return;
  const prev = state.selectedElement.previousElementSibling;
  if (prev) {
    state.selectedElement.parentNode.insertBefore(state.selectedElement, prev);
    pushSnapshot();
  }
}

function moveSelectedElementDown() {
  if (!state.selectedElement) return;
  const next = state.selectedElement.nextElementSibling;
  if (next) {
    state.selectedElement.parentNode.insertBefore(next, state.selectedElement);
    pushSnapshot();
  }
}

// Adicionar Novos Componentes (Modal +)
function addComponent(type) {
  const iframe = document.getElementById('siteIframe');
  const doc = iframe.contentDocument || iframe.contentWindow.document;
  const main = doc.querySelector('main') || doc.body;

  let newElement = null;

  switch (type) {
    case 'text':
      newElement = doc.createElement('p');
      newElement.textContent = 'Novo parágrafo editável no visual builder. Clique para alterar o texto ou a tipografia.';
      newElement.style.color = 'var(--color-text-medium)';
      newElement.style.fontSize = '1rem';
      newElement.style.margin = '16px 0';
      break;

    case 'heading':
      newElement = doc.createElement('h2');
      newElement.className = 'section-title';
      newElement.textContent = 'NOVO TÍTULO DE SEÇÃO';
      newElement.style.margin = '24px 0 12px';
      break;

    case 'interfone':
      newElement = doc.createElement('div');
      newElement.className = 'interfone-quote';
      newElement.textContent = '"Maria... O tempo está passando e os seus passos estão ficando lentos."';
      break;

    case 'card':
      newElement = doc.createElement('div');
      newElement.className = 'card';
      newElement.innerHTML = `
        <div class="voice-badge voice-manual">Novo Módulo</div>
        <h3 class="card-title">Título do Card</h3>
        <p style="font-size: 0.92rem; color: var(--color-text-medium);">Descreva aqui as características ou regras do projeto.</p>
      `;
      break;

    case 'swatch':
      newElement = doc.createElement('div');
      newElement.className = 'color-swatch-card';
      newElement.innerHTML = `
        <div class="swatch-color-box" style="background: #00D2FF;">
          <span class="badge-key">NOVO TOKEN</span>
        </div>
        <div class="swatch-info">
          <div class="swatch-name">Novo Token de Cor</div>
          <div class="swatch-hex">
            <code>#00D2FF</code>
            <button class="btn-copy-token" data-copy="#00D2FF">Copiar</button>
          </div>
          <p class="swatch-role">Função semântica deste token no jogo.</p>
        </div>
      `;
      break;

    case 'media':
      newElement = doc.createElement('div');
      newElement.className = 'image-placeholder-box';
      newElement.innerHTML = `
        <div class="placeholder-icon">📷</div>
        <div class="placeholder-title">Novo Espaço para Print ou Arte</div>
        <div class="placeholder-desc">Insira aqui a captura de tela ou arte conceitual (assets/img/uploads/exemplo.png)</div>
      `;
      break;

    case 'button':
      newElement = doc.createElement('a');
      newElement.className = 'btn btn-primary';
      newElement.href = '#';
      newElement.textContent = 'Botão de Ação';
      newElement.style.margin = '12px 0';
      break;
  }

  if (newElement) {
    if (state.selectedElement && state.selectedElement.parentNode) {
      state.selectedElement.parentNode.insertBefore(newElement, state.selectedElement.nextSibling);
    } else {
      main.appendChild(newElement);
    }

    selectElement(newElement);
    pushSnapshot();
    showToast('Novo elemento adicionado à página!');
  }
}

// Histórico de Desfazer / Refazer (Undo / Redo)
function pushSnapshot() {
  const iframe = document.getElementById('siteIframe');
  const doc = iframe.contentDocument || iframe.contentWindow.document;
  if (!doc || !doc.body) return;

  // Clona o HTML e limpa tags do builder
  const cleanHtml = getCleanDocumentHtml(doc);
  state.undoStack.push(cleanHtml);
  if (state.undoStack.length > 25) state.undoStack.shift();
  state.redoStack = [];
  updateUndoRedoButtons();
}

function undo() {
  if (state.undoStack.length <= 1) return;
  const iframe = document.getElementById('siteIframe');
  const doc = iframe.contentDocument || iframe.contentWindow.document;

  state.redoStack.push(state.undoStack.pop());
  const previousState = state.undoStack[state.undoStack.length - 1];

  deselectElement();
  doc.open();
  doc.write(previousState);
  doc.close();

  setTimeout(() => {
    injectIframeStyles(iframe);
    setupIframeListeners(iframe);
    updateUndoRedoButtons();
    showToast('Ação desfeita.');
  }, 100);
}

function redo() {
  if (state.redoStack.length === 0) return;
  const iframe = document.getElementById('siteIframe');
  const doc = iframe.contentDocument || iframe.contentWindow.document;

  const nextState = state.redoStack.pop();
  state.undoStack.push(nextState);

  deselectElement();
  doc.open();
  doc.write(nextState);
  doc.close();

  setTimeout(() => {
    injectIframeStyles(iframe);
    setupIframeListeners(iframe);
    updateUndoRedoButtons();
    showToast('Ação refeita.');
  }, 100);
}

function updateUndoRedoButtons() {
  document.getElementById('undoBtn').disabled = state.undoStack.length <= 1;
  document.getElementById('redoBtn').disabled = state.redoStack.length === 0;
}

// Gera o código HTML limpo sem classes ou estilos injetados pelo builder
function getCleanDocumentHtml(doc) {
  const clone = doc.documentElement.cloneNode(true);

  // Remove estilos e classes do builder
  const injectedStyle = clone.querySelector('#builder-injected-style');
  if (injectedStyle) injectedStyle.remove();

  clone.querySelectorAll('.builder-hover-target').forEach(el => el.classList.remove('builder-hover-target'));
  clone.querySelectorAll('.builder-selected-target').forEach(el => el.classList.remove('builder-selected-target'));
  clone.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));

  return '<!DOCTYPE html>\n' + clone.outerHTML;
}

// Configuração do Token do GitHub (PAT)
function openTokenModal() {
  const modal = document.getElementById('tokenModal');
  const tokenInput = document.getElementById('githubTokenInput');
  tokenInput.value = state.config.token;
  modal.classList.add('show');

  document.getElementById('btnSaveToken').onclick = () => {
    const val = tokenInput.value.trim();
    if (!val) {
      alert('Por favor, informe um token válido do GitHub.');
      return;
    }
    state.config.token = val;
    localStorage.setItem('pingado_builder_token', val);
    modal.classList.remove('show');
    showToast('Token do GitHub salvo com sucesso!');
  };
}

// Publicação Direta no Repositório GitHub (GitHub REST API)
async function publishToGitHub() {
  if (!state.config.token) {
    openTokenModal();
    return;
  }

  const publishBtn = document.getElementById('publishBtn');
  const originalHtml = publishBtn.innerHTML;
  publishBtn.disabled = true;
  publishBtn.innerHTML = '<span>⏳</span> Publicando...';

  const iframe = document.getElementById('siteIframe');
  const doc = iframe.contentDocument || iframe.contentWindow.document;
  const cleanHtml = getCleanDocumentHtml(doc);

  const filePath = state.activePage;
  const apiUrl = `https://api.github.com/repos/${state.config.repo}/contents/${filePath}`;

  try {
    // 1. Obtém o SHA atual do arquivo remoto
    let sha = null;
    const getRes = await fetch(apiUrl, {
      headers: {
        'Authorization': `token ${state.config.token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (getRes.ok) {
      const getData = await getRes.json();
      sha = getData.sha;
    } else if (getRes.status !== 404) {
      throw new Error(`Erro ao checar arquivo no repositório: ${getRes.statusText}`);
    }

    // 2. Codifica o HTML em UTF-8 Base64 com segurança
    const contentBase64 = utf8ToBase64(cleanHtml);

    // 3. Envia o commit via PUT
    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${state.config.token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        message: `chore(cms): atualizacao visual de ${filePath} via Pingado Builder`,
        content: contentBase64,
        sha: sha,
        branch: state.config.branch
      })
    });

    if (!putRes.ok) {
      const errData = await putRes.json();
      throw new Error(errData.message || 'Erro ao publicar no GitHub.');
    }

    state.hasUnsavedChanges = false;
    showToast(`🚀 ${filePath} publicado com sucesso na branch main!`, 'success');

  } catch (err) {
    console.error("Falha ao publicar:", err);
    alert(`Erro ao publicar no GitHub: ${err.message}\nVerifique se o token tem permissão de 'repo'.`);
    showToast('Falha na publicação.', 'error');
  } finally {
    publishBtn.disabled = false;
    publishBtn.innerHTML = originalHtml;
  }
}

// Codificador UTF-8 para Base64
function utf8ToBase64(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}

// Toast de Notificação
function showToast(message, type = 'normal') {
  let toast = document.querySelector('.builder-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'builder-toast';
    document.body.appendChild(toast);
  }

  toast.className = `builder-toast ${type}`;
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}
