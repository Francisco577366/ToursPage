export const displayMap = locations => {
  document.addEventListener('DOMContentLoaded', () => {
    const duracion = locations.length * 1000

    const map = L.map('map', {
      scrollWheelZoom: false,
      doubleClickZoom: false,
      dragging: true,
      touchZoom: false,
      boxZoom: false,
      keyboard: false,
      zoomControl: false,
      closePopupOnClick: false,
    })

    const bounds = []

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 8,
      attribution: '© OpenStreetMap contributors',
    }).addTo(map)

    locations.forEach((loc, i) => {
      const [lng, lat] = loc.coordinates
      console.log(loc)

      const marker = L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`<p>Día ${loc.day}: ${loc.description}</p>`, {
          autoClose: false,
        })

      // Abrir popup con efecto "presentación uno por uno"
      setTimeout(() => {
        marker.openPopup()
      }, i * 1000)

      bounds.push([lat, lng])
      console.log(bounds)
    })
    map.invalidateSize()
    map.fitBounds(bounds, {
      padding: [50, 50],
    })

    setTimeout(() => {
      map.touchZoom.enable()
      map.doubleClickZoom.enable()
      map.boxZoom.enable()
      map.keyboard.enable()
      map.zoomControl.addTo(map)
    }, duracion)

    // 3) Lane Router Cords
    // Recopilamos las coordenadas en orden para dibujar la línea
    const routeCoords = locations.map(loc => {
      const [lng, lat] = loc.coordinates
      return [lat, lng] // en formato Leaflet: [latitud, longitud]
    })

    // Dibujamos la línea que conecta los puntos
    L.polyline(routeCoords, {
      color: '#00b894',
      weight: 4,
      opacity: 0.7,
      dashArray: '6, 10', // estilo punteado (opcional)
      lineJoin: 'round',
    }).addTo(map)
  })
}

//1) Insert data from the map
// Coordenadas iniciales (ejemplo: Caracas)
