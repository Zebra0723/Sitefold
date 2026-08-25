/* Sitefold — pricing comparison filter */
document.getElementById('pr-seg')?.addEventListener('seg', (e) => {
  const diffOnly = e.detail === 'diff';
  document.querySelectorAll('#pr-body tr').forEach((tr) => {
    tr.hidden = diffOnly && tr.dataset.diff !== '1';
  });
});
