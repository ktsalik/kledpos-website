(() => {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  const button = form.querySelector('button[type="submit"]');
  const status = form.querySelector('.form-status');
  const buttonContent = button.innerHTML;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (button.disabled) return;
    button.disabled = true;
    button.textContent = 'Αποστολή...';
    form.setAttribute('aria-busy', 'true');
    status.className = 'form-status';
    status.textContent = '';
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      status.className = 'form-status success';
      status.textContent = result.message;
      form.reset();
    } catch (error) {
      status.className = 'form-status error';
      status.textContent =
        error instanceof Error &&
        !(error instanceof SyntaxError) &&
        error.message
          ? error.message
          : 'Δεν ήταν δυνατή η αποστολή. Δοκιμάστε ξανά σε λίγο.';
    } finally {
      button.disabled = false;
      button.innerHTML = buttonContent;
      form.removeAttribute('aria-busy');
    }
  });
})();
