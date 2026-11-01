
// US DOE standard base table:
// 100-150 sq ft: 5,000 BTU
// 150-250: 6,000
// 250-300: 7,000
// 300-350: 8,000
// 350-400: 9,000
// 400-450: 10,000
// 450-550: 12,000
// 550-700: 14,000
// 700-1000: 18,000
// 1000-1200: 21,000
// 1200-1400: 23,000
// 1400-1500: 24,000

function calc() {
  const sq = parseFloat(document.getElementById('sqFt').value) || 0;
  const ceiling = parseFloat(document.getElementById('ceilingHt').value) || 8;
  const sun = parseFloat(document.getElementById('sunExposure').value) || 1.0;
  const kitchen = document.getElementById('isKitchen').value === 'yes';

  // Base rule approx 20-22 BTU per sq ft for 8ft ceilings
  let baseBtu = sq * 20;
  if (sq < 200) baseBtu = Math.max(5000, sq * 25);

  // Ceiling modifier
  if (ceiling > 8) {
    baseBtu *= (ceiling / 8);
  }

  // Sun modifier
  baseBtu *= sun;

  // Kitchen addition
  if (kitchen) {
    baseBtu += 4000;
  }

  // Round to nearest standard commercial sizes (5k, 6k, 8k, 10k, 12k, 14k, 18k, 24k, etc.)
  const roundedBtu = Math.ceil(baseBtu / 500) * 500;
  const tons = (roundedBtu / 12000).toFixed(1);

  // Cost approx: 8 hours/day * 30 days * (BTU / 11 EER) / 1000 * $0.16/kWh
  const monthlyCost = Math.round((240 * (roundedBtu / 11) / 1000) * 0.16);

  document.getElementById('btuTotal').innerText = roundedBtu.toLocaleString() + ' BTU';
  document.getElementById('tonRating').innerText = tons + ' Tons';
  document.getElementById('estCost').innerText = '$' + monthlyCost + '/mo';

  let unit = '';
  if (roundedBtu <= 12000) {
    unit = `Window / Mini-Split (${(roundedBtu/1000).toFixed(0)}k)`;
  } else if (roundedBtu <= 24000) {
    unit = `Ductless Mini-Split (${tons} Ton)`;
  } else {
    unit = `Central AC Zone (${tons} Tons)`;
  }
  document.getElementById('unitType').innerText = unit;

  document.getElementById('btuVerdict').innerHTML = 
    `For a <strong>${sq} sq ft</strong> room with <strong>${ceiling} ft ceilings</strong>, you need approx <strong>${roundedBtu.toLocaleString()} BTUs</strong> of cooling. Avoid buying an oversized unit: an AC that is too large will short-cycle, dropping the room temperature too fast without removing airborne humidity, leaving the room clammy and damp.`;
}

['sqFt', 'ceilingHt', 'sunExposure', 'isKitchen'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    if (id === 'sqFt' && document.getElementById('sqFtRange')) {
      document.getElementById('sqFtRange').value = document.getElementById('sqFt').value;
    }
    calc();
  });
});

document.getElementById('sqFtRange').addEventListener('input', (e) => {
  document.getElementById('sqFt').value = e.target.value;
  calc();
});

calc();
