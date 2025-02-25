document.addEventListener("DOMContentLoaded", function () {
    const map = L.map("map").setView([35.6895, 139.6917], 10);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
    let positions = [];
    let markers = [];
    const polyline = L.polyline([], { color: "blue" }).addTo(map);
    
    map.on("click", function (e) {
        positions.push([e.latlng.lat, e.latlng.lng]);
        let marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
        markers.push(marker);
        polyline.setLatLngs(positions);
    });

    document.getElementById("reset").addEventListener("click", function () {
        positions = [];
        markers.forEach(marker => map.removeLayer(marker));
        markers = [];
        polyline.setLatLngs([]);
    });

    document.getElementById("save-map").addEventListener("click", function () {
        const mapName = document.getElementById("map-name").value;
        if (mapName) {
            localStorage.setItem("map-" + mapName, JSON.stringify(positions));
            alert("マップが保存されました！");
        }
    });

    document.getElementById("load-map").addEventListener("change", function () {
        const selectedKey = this.value;
        if (selectedKey) {
            positions = JSON.parse(localStorage.getItem(selectedKey));
            markers.forEach(marker => map.removeLayer(marker));
            markers = [];
            polyline.setLatLngs(positions);
            positions.forEach(([lat, lng]) => {
                let marker = L.marker([lat, lng]).addTo(map);
                markers.push(marker);
            });
        }
    });
});
