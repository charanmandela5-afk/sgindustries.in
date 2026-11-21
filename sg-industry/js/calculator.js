/**
 * SG INDUSTRY - B2B SPECIFICATION & CONTAINER LOAD CALCULATOR
 * Accurate volume, weight, and carton capacity estimation for international procurement
 */

(function () {
  const productSelect = document.getElementById('calc-product');
  const containerSelect = document.getElementById('calc-container');
  const plySlider = document.getElementById('calc-ply');
  const plyVal = document.getElementById('calc-ply-val');
  const gsmSlider = document.getElementById('calc-gsm');
  const gsmVal = document.getElementById('calc-gsm-val');
  const sheetsInput = document.getElementById('calc-sheets');

  // Outputs
  const outCartons = document.getElementById('out-cartons');
  const outTotalUnits = document.getElementById('out-total-units');
  const outGrossWeight = document.getElementById('out-gross-weight');
  const outCbmUtil = document.getElementById('out-cbm-util');
  const outContainerLabel = document.getElementById('out-container-label');
  const exportBtn = document.getElementById('calc-export-btn');

  if (!productSelect || !containerSelect) return;

  // Product specification standards (Carton volume in CBM, units per carton, weight factor)
  const productSpecs = {
    'facial-box': {
      name: 'Facial Tissue Box (Flat)',
      unitsPerCarton: 36,
      cartonCbm: 0.052,
      baseUnitWeightKg: 0.18
    },
    'facial-cube': {
      name: 'Facial Tissue Cube',
      unitsPerCarton: 48,
      cartonCbm: 0.048,
      baseUnitWeightKg: 0.12
    },
    'toilet-roll': {
      name: 'Standard Bath Tissue Roll',
      unitsPerCarton: 48,
      cartonCbm: 0.065,
      baseUnitWeightKg: 0.14
    },
    'toilet-jumbo': {
      name: 'JRT Commercial Jumbo Roll',
      unitsPerCarton: 12,
      cartonCbm: 0.072,
      baseUnitWeightKg: 0.65
    },
    'kitchen-towel': {
      name: '2-Pack Kitchen Towel',
      unitsPerCarton: 24,
      cartonCbm: 0.082,
      baseUnitWeightKg: 0.28
    },
    'table-napkin': {
      name: 'Dinner Table Napkins (Pack of 100)',
      unitsPerCarton: 30,
      cartonCbm: 0.045,
      baseUnitWeightKg: 0.22
    }
  };

  // Container dimensions
  const containerCapacity = {
    '20gp': {
      label: '20ft Standard GP',
      maxCbm: 28.5,
      maxPayloadKg: 18000
    },
    '40hc': {
      label: '40ft High Cube (HQ)',
      maxCbm: 68.0,
      maxPayloadKg: 26500
    }
  };

  function updateCalculator() {
    const prodKey = productSelect.value || 'facial-box';
    const contKey = containerSelect.value || '40hc';
    const ply = parseInt(plySlider.value, 10) || 2;
    const gsm = parseFloat(gsmSlider.value) || 14.5;
    const sheets = parseInt(sheetsInput.value, 10) || 200;

    plyVal.textContent = ply + ' Ply';
    gsmVal.textContent = gsm.toFixed(1) + ' GSM';

    const prod = productSpecs[prodKey];
    const cont = containerCapacity[contKey];

    // Weight scaling based on ply and GSM vs benchmark (2 ply, 14.5 gsm, 200 sheets)
    const weightMultiplier = (ply / 2) * (gsm / 14.5) * (sheets / 200);
    const unitWeightKg = prod.baseUnitWeightKg * weightMultiplier;
    const cartonWeightKg = unitWeightKg * prod.unitsPerCarton + 0.8; // adding carton tare

    // Container calculation
    const cartonsByVolume = Math.floor(cont.maxCbm / prod.cartonCbm);
    const cartonsByWeight = Math.floor(cont.maxPayloadKg / cartonWeightKg);
    const finalCartons = Math.min(cartonsByVolume, cartonsByWeight);

    const totalUnits = finalCartons * prod.unitsPerCarton;
    const grossWeightMt = (finalCartons * cartonWeightKg) / 1000;
    const actualCbm = finalCartons * prod.cartonCbm;
    const cbmUtilPercent = Math.min(100, Math.round((actualCbm / cont.maxCbm) * 100));

    // Update UI
    outCartons.textContent = finalCartons.toLocaleString();
    outTotalUnits.textContent = totalUnits.toLocaleString();
    outGrossWeight.innerHTML = grossWeightMt.toFixed(1) + ' <span>MT</span>';
    outCbmUtil.innerHTML = cbmUtilPercent + '<span>%</span>';
    outContainerLabel.textContent = cont.label;
  }

  // Event Listeners
  [productSelect, containerSelect, sheetsInput].forEach(el => {
    el.addEventListener('change', updateCalculator);
    el.addEventListener('input', updateCalculator);
  });

  plySlider.addEventListener('input', updateCalculator);
  gsmSlider.addEventListener('input', updateCalculator);

  // Export to Inquiry Form
  if (exportBtn) {
    exportBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const prodName = productSpecs[productSelect.value].name;
      const contLabel = containerCapacity[containerSelect.value].label;
      const ply = plySlider.value;
      const gsm = gsmSlider.value;
      const sheets = sheetsInput.value;
      const cartons = outCartons.textContent;

      const messageBox = document.getElementById('rfq-message');
      const productField = document.getElementById('rfq-product');

      if (productField) {
        productField.value = productSelect.value;
      }

      if (messageBox) {
        messageBox.value = `[Inquiry from Container Calculator]\nProduct: ${prodName}\nContainer Size: ${contLabel}\nEstimated Cartons: ${cartons}\nPly: ${ply} Ply | Grammage: ${gsm} GSM | Sheets: ${sheets}\nTotal Target Capacity: ~${outGrossWeight.textContent.trim()} Gross`;
      }

      // Smooth scroll to Inquiry section
      const inquirySec = document.getElementById('contact');
      if (inquirySec) {
        inquirySec.scrollIntoView({ behavior: 'smooth' });
        // Highlight form
        const formCard = document.querySelector('.inquiry-form-card');
        if (formCard) {
          formCard.style.outline = '2px solid var(--accent)';
          setTimeout(() => { formCard.style.outline = 'none'; }, 2000);
        }
      }
    });
  }

  // Initial Calculation
  updateCalculator();
})();
