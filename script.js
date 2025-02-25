document.addEventListener("DOMContentLoaded", () => {
    const map = L.map("map").setView([35.6895, 139.6917], 10);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors"
    }).addTo(map);

    let positions = [];
    let markers = [];
    let polyline = L.polyline([], { color: "blue" }).addTo(map);

    const startBtn = document.getElementById("set-start");
    const endBtn = document.getElementById("set-end");
    const downloadBtn = document.getElementById("download");
    const resetBtn = document.getElementById("reset");
    const saveBtn = document.getElementById("save-map");
    const loadSelect = document.getElementById("load-map");
    const mapNameInput = document.getElementById("map-name");

    map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        positions.push([lat, lng]);

        let marker = L.marker([lat, lng], { icon: defaultIcon }).addTo(map);
        markers.push(marker);
        updateMarkers();
        polyline.setLatLngs(positions);
    });

    function updateMarkers() {
        markers.forEach((marker, index) => {
            if (index === 0) {
                marker.setIcon(startIcon);
            } else if (index === positions.length - 1) {
                marker.setIcon(endIcon);
            } else {
                marker.setIcon(defaultIcon);
            }
        });
    }

    startBtn.addEventListener("click", () => {
        if (positions.length > 0) {
            updateMarkers();
        }
    });

    endBtn.addEventListener("click", () => {
        if (positions.length > 0) {
            updateMarkers();
        }
    });

    downloadBtn.addEventListener("click", () => {
        const content = "Latitude,Longitude\n" + positions.map(p => p.join(",")).join("\n");
        const blob = new Blob([content], { type: "text/plain" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "coordinates.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    resetBtn.addEventListener("click", () => {
        positions = [];
        markers.forEach(marker => map.removeLayer(marker));
        markers = [];
        polyline.setLatLngs([]);
    });

    saveBtn.addEventListener("click", () => {
        const mapName = mapNameInput.value.trim();
        if (mapName && positions.length > 0) {
            localStorage.setItem(`map-${mapName}`, JSON.stringify(positions));
            loadMaps();
        }
    });

    function loadMaps() {
        loadSelect.innerHTML = '<option value="">保存済みマップを選択</option>';
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith("map-")) {
                const option = document.createElement("option");
                option.value = key;
                option.textContent = key.replace("map-", "");
                loadSelect.appendChild(option);
            }
        });
    }

    loadSelect.addEventListener("change", () => {
        const selectedKey = loadSelect.value;
        if (selectedKey) {
            positions = JSON.parse(localStorage.getItem(selectedKey));
            resetBtn.click();
            positions.forEach(([lat, lng]) => {
                let marker = L.marker([lat, lng], { icon: defaultIcon }).addTo(map);
                markers.push(marker);
            });
            polyline.setLatLngs(positions);
            updateMarkers();
        }
    });

    loadMaps();

    const defaultIcon = new L.Icon({
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41]
    });

    const startIcon = new L.Icon({
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x-red.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41]
    });

    const endIcon = new L.Icon({
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x-green.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41]
    });
});
