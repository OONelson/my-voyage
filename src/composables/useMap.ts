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
  const updateMarker = (coordinates: [number, number], title: string) => {
    if (locationMarker.value) {
      locationMarker.value.remove();
    }
    locationMarker.value = addMarker(coordinates, {
      color: "#006E63",
      popup: `<h3 class="text-sm font-medium">${title}</h3>`,
    });
  };

  // Add a marker to the map
  const addMarker = (
    lngLat: LngLatLike,
    options?: {
      color?: string;
      popup?: string;
    }
  ): Marker => {
    if (!map.value) {
      throw new Error("Map not initialized. Call initMap first.");
    }

    const marker = new maplibregl.Marker({
      color: options?.color || "#006E63",
    })
      .setLngLat(lngLat)
      .addTo(map.value);

    if (options?.popup) {
      marker.setPopup(new maplibregl.Popup().setHTML(options.popup));
    }

    return marker;
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
