import { scaleSequentialSqrt } from 'https://esm.sh/d3-scale';
import { interpolateRgb } from 'https://esm.sh/d3-interpolate';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.137.0/build/three.module.js';

const customColorInterpolator = interpolateRgb("#F7F4F3", "#662C91");

const colorScale = scaleSequentialSqrt(customColorInterpolator);
const getVal = feat => feat.properties.Value;

fetch('sdg-poverty-2020.geojson')
  .then(res => res.json())
  .then(countries => {
    const allFeatures = countries.features.filter(f => f.properties.ISO_A2 !== 'AQ');
    const dataValues = allFeatures.map(getVal).filter(v => v != null && v >= 0);
    const maxVal = Math.max(...dataValues);
    colorScale.domain([0, maxVal]);

    const world = new Globe(document.getElementById('globe-container'), {
        animateIn: false
      })
      .globeMaterial(new THREE.MeshLambertMaterial({
        color: 0x000000,
        opacity: 0.9,
        transparent: true,
      }))
      .backgroundImageUrl('material.png')
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
          ${d.Value == "NA" ? 'No Data' : d.Value + '%'}
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
      .globeOffset([200, 0])
      .pointOfView({ lat: 0, lng: 0, altitude: 2.3 }, 0)


      function animateGlobeSpin() {
        requestAnimationFrame(animateGlobeSpin);
        world.controls().autoRotate = true;
        world.controls().autoRotateSpeed = 0.3;
        world.controls().update();
      }
      
      animateGlobeSpin();
  });