import { scaleSequentialSqrt } from 'https://esm.sh/d3-scale';
import { interpolateYlOrRd } from 'https://esm.sh/d3-scale-chromatic';

const colorScale = scaleSequentialSqrt(interpolateYlOrRd);
const getVal = feat => feat.properties.Value;

fetch('sdg-poverty-2020.geojson').then(res => res.json()).then(countries => {
  const features = countries.features.filter(f => f.properties.ISO_A2 !== 'AQ');
  const values = features.map(getVal).filter(v => v != null && v >= 0);
  const maxVal = Math.max(...values);
  colorScale.domain([0, maxVal]);

  const world = new Globe(document.getElementById('globe-container'))
    .globeImageUrl('//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg')
    .backgroundImageUrl('//cdn.jsdelivr.net/npm/three-globe/example/img/night-sky.png')
    .lineHoverPrecision(0)
    .polygonsData(features)
    .polygonAltitude(0.06)
    .polygonCapColor(feat => getVal(feat) == null
      ? 'gray'
      : feat.properties.ISO_A3 === 'GHA'
        ? 'crimson'
        : colorScale(getVal(feat)))
    .polygonSideColor(() => 'rgba(0, 100, 0, 0.15)')
    .polygonStrokeColor(() => '#111')
    .polygonLabel(({ properties: d }) => `
      <b>${d.name}</b><br/>
      Poverty Rate (2020): <i>${d.Value == null ? 'No data' : d.Value + '%'}</i>
    `)
    .onPolygonHover(hoverD => world
      .polygonAltitude(d => d === hoverD ? 0.12 : 0.06)
      .polygonCapColor(feat =>
        getVal(feat) == null
          ? 'gray'
          : colorScale(getVal(feat))
      )      
    )
    .polygonsTransitionDuration(300);
});