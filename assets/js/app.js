/**
 * LOCKED UNIT & PINGADO STUDIOS — SCRIPT INTERATIVO
 * Gerencia cópia de design tokens, snippets do mídia kit e navegação
 */

document.addEventListener('DOMContentLoaded', () => {
  initCopyButtons();
  initSidebarSpy();
});

// Toast de Notificação
function showToast(message = "Copiado para a área de transferência!") {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

// Inicializa botões de cópia de tokens e textos
function initCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = button.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = button.textContent;
        button.textContent = "Copiado!";
        showToast(`Copiado: ${textToCopy}`);
        
        setTimeout(() => {
          button.textContent = originalText;
        }, 1500);
      }).catch(err => {
        console.error("Erro ao copiar texto:", err);
      });
    });
  });

  // Botões de cópia de snippets do Mídia Kit
  document.querySelectorAll('[data-copy-target]').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = button.getAttribute('data-copy-target');
      const targetElement = document.getElementById(targetId);
      if (!targetElement) return;

      const text = targetElement.innerText || targetElement.textContent;
      navigator.clipboard.writeText(text.trim()).then(() => {
        const originalText = button.textContent;
        button.textContent = "Texto Copiado!";
        showToast("Texto copiado para a área de transferência!");
        
        setTimeout(() => {
          button.textContent = originalText;
        }, 1800);
      });
    });
  });
}

// Scroll Spy para Sidebar do Design System
function initSidebarSpy() {
  const sidebarLinks = document.querySelectorAll('.ds-sidebar-nav a');
  if (!sidebarLinks.length) return;

  const sections = Array.from(sidebarLinks).map(link => {
    const id = link.getAttribute('href').replace('#', '');
    return document.getElementById(id);
  }).filter(Boolean);

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach(section => {
      if (section.offsetTop <= scrollPos) {
        currentId = section.getAttribute('id');
      }
    });

    sidebarLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}
