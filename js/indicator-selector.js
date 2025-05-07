const indicatorSelect = document.getElementById('indicator');

const goalColors = {
  1: '#eb1c2d',
  2: '#d3a029',
  3: '#279b48',
  4: '#c31f33',
  5: '#ef402b',
  6: '#00aed9',
  7: '#fdb713',
  8: '#8f1838',
  9: '#f36d25',
  10: '#e11484',
  11: '#f99d26',
  12: '#cf8d2a',
  13: '#48773e',
  14: '#007dbc',
  15: '#5dbb46',
  16: '#02558b',
  17: '#183668'
};

function updateColors(newColor) {
  document.querySelector('.footer').style.backgroundColor = newColor;

  // Scrollbar thumb (using CSS variable)
  document.querySelector('.panel-bottom').style.setProperty('--scrollbar-color', newColor);
}

indicatorSelect.addEventListener('change', () => {
  const selectedText = indicatorSelect.value;
  const goalNumberMatch = selectedText.match(/Goal (\d+)/);
  if (!goalNumberMatch) return;

  const selectedGoalNumber = goalNumberMatch[1];

  for (let i = 1; i <= 17; i++) {
    const goalDiv = document.getElementById(i.toString());
    if (goalDiv) {
      goalDiv.style.display = 'none';
    }
  }

  const activeGoalDiv = document.getElementById(selectedGoalNumber);
  if (activeGoalDiv) {
    activeGoalDiv.style.display = 'block';
  }

  const newColor = goalColors[selectedGoalNumber];
  updateColors(newColor);
});

window.addEventListener('DOMContentLoaded', () => {
  for (let i = 2; i <= 17; i++) {
    const goalDiv = document.getElementById(i.toString());
    if (goalDiv) {
      goalDiv.style.display = 'none';
    }
  }
  updateColors(goalColors[1]);
});
