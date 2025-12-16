// ===============================
// INISIALISASI PETA
// ===============================
const map = L.map("map").setView([-4.9, 105.2], 8);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

// ===============================
// DATA POPULASI LAMPUNG (BPS 2022)
// ===============================
const dataLampung = [
  { name: "Kabupaten Lampung Barat", pop: 311012, lat: -5.036, lng: 104.095 },
  { name: "Kabupaten Tanggamus", pop: 640275, lat: -5.385, lng: 104.623 },
  { name: "Kabupaten Lampung Selatan", pop: 1095577, lat: -5.562, lng: 105.547 },
  { name: "Kabupaten Lampung Timur", pop: 1108405, lat: -5.113, lng: 105.688 },
  { name: "Kabupaten Lampung Tengah", pop: 1470691, lat: -4.889, lng: 105.267 },
  { name: "Kabupaten Lampung Utara", pop: 620540, lat: -4.819, lng: 104.882 },
  { name: "Kabupaten Way Kanan", pop: 476871, lat: -4.497, lng: 104.565 },
  { name: "Kabupaten Tulang Bawang", pop: 430021, lat: -4.317, lng: 105.548 },
  { name: "Kabupaten Pesawaran", pop: 468751, lat: -5.407, lng: 105.079 },
  { name: "Kabupaten Pringsewu", pop: 405820, lat: -5.357, lng: 104.983 },
  { name: "Kabupaten Mesuji", pop: 227518, lat: -4.042, lng: 105.426 },
  { name: "Kabupaten Tulang Bawang Barat", pop: 301579, lat: -4.457, lng: 105.006 },
  { name: "Kabupaten Pesisir Barat", pop: 164695, lat: -5.193, lng: 103.928 },

  { name: "Kota Bandar Lampung", pop: 1166916, lat: -5.429, lng: 105.262 },
  { name: "Kota Metro", pop: 168676, lat: -5.117, lng: 105.307 }
];

let markers = [];

// ===============================
// WARNA & ICON
// ===============================
function getColor(pop) {
  if (pop >= 1000000) return "red";
  if (pop >= 600000) return "orange";
  if (pop >= 300000) return "yellow";
  return "green";
}

function getIcon(pop) {
  const color = getColor(pop);
  return L.icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
}

// ===============================
// RENDER MARKER
// ===============================
function renderMarkers(data) {
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  data.forEach(d => {
    const marker = L.marker([d.lat, d.lng], { icon: getIcon(d.pop) }).addTo(map);
    marker.bindPopup(`
      <strong>${d.name}</strong><br>
      Jumlah Penduduk: ${d.pop.toLocaleString("id-ID")} jiwa
    `);
    markers.push(marker);
  });
}

// ===============================
// FILTER & SEARCH
// ===============================
function filterData() {
  const name = document.getElementById("searchName").value.toLowerCase();
  const minPop = document.getElementById("minPop").value;

  const filtered = dataLampung.filter(d => {
    const matchName = name ? d.name.toLowerCase().includes(name) : true;
    const matchPop = minPop ? d.pop >= minPop : true;
    return matchName && matchPop;
  });

  renderMarkers(filtered);
}

function resetData() {
  document.getElementById("searchName").value = "";
  document.getElementById("minPop").value = "";
  renderMarkers(dataLampung);
}

// ===============================
// RENDER AWAL
// ===============================
renderMarkers(dataLampung);

// ===============================
// LEGENDA
// ===============================
const legend = L.control({ position: "bottomright" });
legend.onAdd = function () {
  const div = L.DomUtil.create("div", "legend");
  div.innerHTML = `
    <strong>Jumlah Penduduk</strong><br>
    <i style="background: green"></i> < 300.000<br>
    <i style="background: yellow"></i> 300.000 – 599.999<br>
    <i style="background: orange"></i> 600.000 – 999.999<br>
    <i style="background: red"></i> ≥ 1.000.000
  `;
  return div;
};
legend.addTo(map);

// ===============================
// SKALA & NORTH ARROW
// ===============================
L.control.scale({
  position: "bottomleft",
  metric: true,
  imperial: false
}).addTo(map);

const northArrow = L.control({ position: "topleft" });
northArrow.onAdd = () => {
  const div = L.DomUtil.create("div", "north-arrow");
  div.innerHTML = "N ↑";
  return div;
};
northArrow.addTo(map);
