document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.matrix-table tbody tr').forEach(row => {
    const cost = row.querySelector('.cost');
    const impact = row.querySelector('.impact');
    const effort = row.querySelector('.effort');
    const scoreCell = row.querySelector('.score');

    function update() {
      const c = Number(cost.value);
      const i = Number(impact.value);
      const e = Number(effort.value);
      const score = i * 0.5 + e * 0.3 + (10 - c) * 0.2;
      scoreCell.textContent = score.toFixed(1);
    }

    [cost, impact, effort].forEach(sl => sl.addEventListener('input', update));
    update();
  });
});
