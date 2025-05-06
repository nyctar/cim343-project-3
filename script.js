import { scaleSequentialSqrt } from 'https://esm.sh/d3-scale';
import { interpolateYlOrRd } from 'https://esm.sh/d3-scale-chromatic';

const colorScale = scaleSequentialSqrt(interpolateYlOrRd);
const getVal = feat => feat.properties.Total;

fetch('ghana_trade_2018.geojson').then(res => res.json()).then(countries => {
  const features = countries.features.filter(f => f.properties.ISO_A2 !== 'AQ');
  const values = features.map(getVal).filter(v => v >= 0);
  const maxVal = Math.max(...values);
  colorScale.domain([0, maxVal]);

  const world = new Globe(document.getElementById('globe-container'))
    .globeImageUrl('//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg')
    .backgroundImageUrl('//cdn.jsdelivr.net/npm/three-globe/example/img/night-sky.png')
    .lineHoverPrecision(0)
    .polygonsData(features)
    .polygonAltitude(0.06)
    .polygonCapColor(feat => getVal(feat) === -1
      ? 'gray'
      : feat.properties.ISO_A3 === 'GHA'
        ? 'crimson'
        : colorScale(getVal(feat)))
    .polygonSideColor(() => 'rgba(0, 100, 0, 0.15)')
    .polygonStrokeColor(() => '#111')
    .polygonLabel(({ properties: d }) => `
      <b>${d.ADMIN} (${d.ISO_A2})</b><br/>
      Total Trade: <i>${d.Total === -1 ? 'No data' : d3.format('.4s')(d.Total)}</i><br/>
      Export: <i>${d.Export === -1 ? 'No data' : d3.format('.4s')(d.Export)}</i><br/>
      Import: <i>${d.Import === -1 ? 'No data' : d3.format('.4s')(d.Import)}</i><br/>
      Top Export: ${d.Export_commodity || 'N/A'}<br/>
      Top Import: ${d.Import_commodity || 'N/A'}
    `)
    .onPolygonHover(hoverD => world
      .polygonAltitude(d => d === hoverD ? 0.12 : 0.06)
      .polygonCapColor(d => d === hoverD
        ? 'steelblue'
        : getVal(d) === -1
          ? 'gray'
          : d.properties.ISO_A3 === 'GHA'
            ? 'crimson'
            : colorScale(getVal(d))
      )
    )
    .polygonsTransitionDuration(300);
});
