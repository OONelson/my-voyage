import { ref, onUnmounted, type Ref } from "vue";
import maplibregl, {
  type Map,
  type Marker,
  type LngLatLike,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type MapStyle =
  | "streets"
  | "outdoor"
  | "hybrid"
  | "satellite"
  | "light"
  | "dark"
  | "winter"
  | "basic";

interface UseMapReturn {
  mapContainer: Ref<HTMLDivElement | undefined>;
  map: Ref<Map | undefined>;
  style: Ref<MapStyle>;
  markers: Ref<Marker[]>;
  initMap: (options?: {
    center?: LngLatLike;
    zoom?: number;
    style?: MapStyle;
  }) => void;
  addMarker: (
    lngLat: LngLatLike,
    options?: {
      color?: string;
      draggable?: boolean;
      popup?: string;
    }
  ) => Marker;
  flyTo: (target: LngLatLike, zoom?: number) => void;
  changeStyle: (style: MapStyle) => void;
  removeAllMarkers: () => void;
}

export const useMap = (): UseMapReturn => {
  const mapContainer = ref<HTMLDivElement>();
  const map = ref<Map>();
  const style = ref<MapStyle>("streets");
  const markers = ref<Marker[]>([]);

  const styleUrls: Record<MapStyle, string> = {
    streets: "streets-v2",
    outdoor: "outdoor-v2",
    hybrid: "hybrid",
    satellite: "satellite",
    light: "light-v2",
    dark: "dark-v2",
    winter: "winter-v2",
    basic: "basic-v2",
  };

  const initMap = (
    options = {
      center: [0, 20] as LngLatLike,
      zoom: 2,
      style: "streets" as MapStyle,
    }
  ) => {
    if (!mapContainer.value) return;

    style.value = options.style;
    map.value = new maplibregl.Map({
      container: mapContainer.value,
      style: `https://api.maptiler.com/maps/${
        styleUrls[options.style]
      }/style.json?key=${import.meta.env.VITE_MAPTILER_KEY}`,
      center: options.center,
      zoom: options.zoom,
    });

    // Add default controls
    map.value.addControl(new maplibregl.NavigationControl(), "top-right");
    map.value.addControl(new maplibregl.ScaleControl(), "bottom-left");
    map.value.addControl(new maplibregl.GeolocateControl({}), "top-left");
    // Handle style loading
    map.value.on("style.load", () => {
      console.log(`Map style changed to ${style.value}`);
    });
  };

  const addMarker = (
    lngLat: LngLatLike,
    options?: {
      color?: string;
      draggable?: boolean;
      popup?: string;
    }
  ): Marker => {
    if (!map.value) throw new Error("Map not initialized");

    const { color = "#006E63", draggable = false, popup = "" } = options || {};

    const marker = new maplibregl.Marker({
      color,
      draggable,
    })
      .setLngLat(lngLat)
      .addTo(map.value);

    if (popup) {
      marker.setPopup(new maplibregl.Popup().setHTML(popup));
    }

    markers.value.push(marker);
    return marker;
  };

  const flyTo = (target: LngLatLike, zoom = 10) => {
    map.value?.flyTo({
      center: target,
      zoom,
      essential: true,
    });
  };

  const changeStyle = (newStyle: MapStyle) => {
    if (!map.value) return;
    style.value = newStyle;
    map.value.setStyle(
      `https://api.maptiler.com/maps/${styleUrls[newStyle]}/style.json?key=${
        import.meta.env.VITE_MAPTILER_KEY
      }`
    );
  };

  const removeAllMarkers = () => {
    markers.value.forEach((marker) => marker.remove());
    markers.value = [];
  };

  onUnmounted(() => {
    removeAllMarkers();
    map.value?.remove();
  });

  return {
    mapContainer,
    map,
    style,
    markers,
    initMap,
    addMarker,
    flyTo,
    changeStyle,
    removeAllMarkers,
  } as UseMapReturn;
};
