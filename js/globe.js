import { scaleSequentialSqrt } from 'https://esm.sh/d3-scale';
import { interpolateRgb } from 'https://esm.sh/d3-interpolate';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.137.0/build/three.module.js';

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

function getColorInterpolator(goalNumber) {
  const targetColor = goalColors[goalNumber];
  return interpolateRgb("#F7F4F3", targetColor);
}

const colorScale = scaleSequentialSqrt(getColorInterpolator(1));

const getVal = feat => feat.properties.Value;

let world;

// default goal 1 and year 2020
loadGlobeData(1, 2020);

function loadGlobeData(goalNumber, year) {

  // build GeoJSON path dynamically
  const geojsonPath = `data-analysis/sdg-goal${goalNumber}-${year}.geojson`;

  fetch(geojsonPath)
    .then(res => res.json())
    .then(countries => {
      const allFeatures = countries.features;
      const dataValues = allFeatures
        .map(getVal)
        .filter(v => v != "NA" && v >= 0);
      const maxVal = Math.max(...dataValues);
      colorScale.domain([0, maxVal]);
      colorScale.interpolator(getColorInterpolator(goalNumber));

      if (!world) {
        // create globe
        world = new Globe(document.getElementById('globe-container'), {
            animateIn: false
          })
          .globeMaterial(new THREE.MeshLambertMaterial({
            color: 0x000000,
            opacity: 0.9,
            transparent: true,
          }))
          .backgroundImageUrl('globe-materials/material.png')
          .lineHoverPrecision(0)
          .pointOfView({ lat: 10, lng: 0, altitude: 1.8 }, 0)
          .polygonsData(allFeatures)
          .polygonAltitude(0.015)
          .polygonCapColor(feat =>
            getVal(feat) == "NA"
              ? '#7E7E7E' 
              : colorScale(getVal(feat))
          )
          .polygonSideColor(() => '#7E7E7E')
          .polygonStrokeColor(() => '#131112')
          .polygonLabel(({ properties: d }) => `
            <div class="globe-label">
              <span class="tooltip-title">${d.name}<br/></span>
              ${d.Value == "NA" ? 'No Data' : d.Value}
            </div>
          `)
          .onPolygonHover(hoverD => {
            world.polygonAltitude(d => 
              d === hoverD && getVal(d) !== "NA" ? 0.03 : 0.01
            );
          })
          .atmosphereColor('#F7F4F3')
          .atmosphereAltitude(0.1)
          .polygonsTransitionDuration(250)
          .globeOffset([300, -25])
          .pointOfView({ lat: 0, lng: 0, altitude: 1.9 }, 0);

        // globe spin
        function animateGlobeSpin() {
          requestAnimationFrame(animateGlobeSpin);
          world.controls().autoRotate = true;
          world.controls().autoRotateSpeed = 0.3;
          world.controls().update();
        }
        animateGlobeSpin();
      } else {
        // update polygons if globe already exists
        world
          .polygonsData(allFeatures)
          .polygonCapColor(feat =>
            getVal(feat) == "NA"
              ? '#7E7E7E' 
              : colorScale(getVal(feat))
          );
      }
    });
}

// dropdown listeners
const indicatorSelect = document.getElementById('indicator');
const yearSelect = document.getElementById('year');

// change goal and year
function updateDataFromSelectors() {
  const selectedText = indicatorSelect.value;
  const yearText = yearSelect.value;

  const goalNumberMatch = selectedText.match(/Goal (\d+)/);
  const selectedYear = yearText;

  if (!goalNumberMatch) return;

  const selectedGoalNumber = goalNumberMatch[1];

  loadGlobeData(selectedGoalNumber, selectedYear);
}

indicatorSelect.addEventListener('change', updateDataFromSelectors);
yearSelect.addEventListener('change', updateDataFromSelectors);
