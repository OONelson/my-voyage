import { ref, onUnmounted } from "vue";
import maplibregl, {
  type Map,
  type Marker,
  type LngLatLike,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export const useMap = () => {
  const map = ref<Map>();
  const mapContainer = ref<HTMLDivElement>();
  const isMapInitialized = ref(false);
  const selectedLocation = ref<any>(null);
  const locationMarker = ref<Marker | null>(null);
  const locationSearch = ref("");
  const locationSuggestions = ref<any[]>([]);

  const initMap = async (
    container: HTMLDivElement,
    options = { center: [0, 20], zoom: 2 }
  ) => {
    try {
      map.value = new maplibregl.Map({
        container: container,
        style: "https://demotiles.maplibre.org/style.json",
        center: options.center,
        zoom: options.zoom,
      });

      // Add default controls
      map.value.addControl(new maplibregl.NavigationControl(), "top-right");
      map.value.addControl(new maplibregl.ScaleControl(), "bottom-left");

      map.value.on("load", () => {
        isMapInitialized.value = true;
      });

      // Set up click handler
      map.value.on("click", (e) => {
        handleMapClick(e.lngLat);
      });

      return map.value;
    } catch (error) {
      console.error("Failed to initialize map:", error);
      throw error;
    }
  };
  // Search for locations using Nominatim
  const searchLocation = async () => {
    if (locationSearch.value.length < 3) {
      locationSuggestions.value = [];
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          locationSearch.value
        )}&addressdetails=1&limit=5`
      );
      locationSuggestions.value = await response.json();
    } catch (error) {
      console.error("Location search error:", error);
      locationSuggestions.value = [];
    }
  };

  // Handle location selection from search results
  const selectSuggestion = (suggestion: any) => {
    const lat = parseFloat(suggestion.lat);
    const lon = parseFloat(suggestion.lon);

    selectedLocation.value = {
      display_name: suggestion.display_name,
      lat,
      lon,
    };

    flyTo([lon, lat], 12);
    updateMarker([lon, lat], suggestion.display_name);
    clearSuggestions();
  };

  // Handle map click to select location
  const handleMapClick = async (lngLat: { lng: number; lat: number }) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lngLat.lat}&lon=${lngLat.lng}`
      );
      const data = await response.json();

      selectedLocation.value = {
        display_name: data.display_name,
        lat: lngLat.lat,
        lon: lngLat.lng,
      };

      updateMarker([lngLat.lng, lngLat.lat], data.display_name);
    } catch (error) {
      console.error("Error reverse geocoding:", error);
    }
  };

  // Update or create marker
  // const updateMarker = (coordinates: [number, number], title: string) => {
  //   if (locationMarker.value) {
  //     locationMarker.value.remove();
  //   }
  //   locationMarker.value = addMarker(coordinates, {
  //     color: "#006E63",
  //     popup: `<h3 class="text-sm font-medium">${title}</h3>`,
  //   });
  // };

  // Add a marker to the map
  // Enhanced marker implementation
  const addMarker = (
    lngLat: LngLatLike,
    options?: {
      color?: string;
      popup?: string;
      title?: string;
    }
  ): Marker => {
    if (!map.value) {
      throw new Error("Map not initialized. Call initMap first.");
    }

    // Create custom marker element
    const el = document.createElement("div");
    el.className = "custom-marker-container";
    el.innerHTML = `
    <div class="custom-marker" style="background-color: ${
      options?.color || "#006E63"
    }">
      <div class="marker-dot"></div>
      ${
        options?.title ? `<div class="marker-label">${options.title}</div>` : ""
      }
    </div>
  `;

    // Create marker with custom element
    const marker = new maplibregl.Marker({
      element: el,
      anchor: "bottom",
      offset: [0, -10],
    })
      .setLngLat(lngLat)
      .addTo(map.value);

    // Add stable popup
    if (options?.popup) {
      const popup = new maplibregl.Popup({
        offset: [0, -30],
        closeOnClick: false,
        className: "custom-marker-popup",
        maxWidth: "300px",
      }).setHTML(options.popup);

      marker.setPopup(popup);

      // Custom click handler to prevent marker movement
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!marker.getPopup().isOpen()) {
          // Close other popups first
          closeAllPopups();
        }
        marker.togglePopup();
      });
    }

    return marker;
  };

  const updateMarker = (coordinates: [number, number], title: string) => {
    if (locationMarker.value) {
      locationMarker.value.remove();
    }
    locationMarker.value = addMarker(coordinates, {
      color: "#006E63",
      title: title[0], // Show first letter as label
      popup: `
      <div class="marker-popup-content">
        <h3 class="font-medium text-base">${title}</h3>
        <p class="text-sm text-gray-600 mt-1">
          ${coordinates[1].toFixed(4)}, ${coordinates[0].toFixed(4)}
        </p>
      </div>
    `,
    });
  };

  const closeAllPopups = () => {
    document
      .querySelectorAll(".custom-marker-container")
      .forEach((markerEl) => {
        const marker = [...markers.value].find(
          (m) => m.getElement() === markerEl
        );
        marker?.getPopup()?.remove();
      });
  };

  // Fly to a location
  const flyTo = (target: LngLatLike, zoom: number = 12) => {
    if (!map.value) return;
    map.value.flyTo({
      center: target,
      zoom,
      essential: true,
    });
  };

  // Use current geolocation
  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        handleMapClick({ lat: latitude, lng: longitude });
        flyTo([longitude, latitude], 14);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location");
      },
      { enableHighAccuracy: true }
    );
  };

  // Clear selected location
  const clearLocation = () => {
    selectedLocation.value = null;
    if (locationMarker.value) {
      locationMarker.value.remove();
      locationMarker.value = null;
    }
  };

  // Clear search suggestions
  const clearSuggestions = () => {
    locationSuggestions.value = [];
  };

  // Zoom controls
  const zoomIn = () => {
    if (!map.value) return;
    map.value.zoomIn();
  };

  const zoomOut = () => {
    if (!map.value) return;
    map.value.zoomOut();
  };

  onUnmounted(() => {
    if (locationMarker.value) {
      locationMarker.value.remove();
    }
    map.value?.remove();
  });

  return {
    map,
    mapContainer,
    isMapInitialized,
    selectedLocation,
    locationSearch,
    locationSuggestions,

    initMap,
    searchLocation,
    selectSuggestion,
    useCurrentLocation,
    clearLocation,
    zoomIn,
    zoomOut,

    // For form integration
    getLocationData: () => ({
      location: selectedLocation.value?.display_name || "",
      latitude: selectedLocation.value?.lat || null,
      longitude: selectedLocation.value?.lon || null,
    }),

    // For editing existing voyages
    setLocation: (locationData: {
      display_name: string;
      lat: number;
      lon: number;
    }) => {
      selectedLocation.value = locationData;
      flyTo([locationData.lon, locationData.lat], 12);
      updateMarker(
        [locationData.lon, locationData.lat],
        locationData.display_name
      );
    },
  };
};
