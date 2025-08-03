import type { Ref } from "vue";

export type MapStyle =
  | "streets"
  | "hybrid"
  | "satellite"
  | "dark"
  | "topo"
  | "basic";

export interface MapOptions {
  center?: maplibregl.LngLatLike;
  zoom?: number;
  style?: MapStyle;
  minZoom?: number;
  maxZoom?: number;
  pitch?: number;
  bearing?: number;
}

export interface MarkerOptions {
  color?: string;
  draggable?: boolean;
  popup?: string | HTMLElement;
  onClick?: (marker: maplibregl.Marker) => void;
  onDragEnd?: (lngLat: maplibregl.LngLat) => void;
}

export interface UseMapReturn {
  mapContainer: Ref<HTMLDivElement | undefined>;
  map: Ref<maplibregl.Map | undefined>;
  style: Ref<MapStyle>;
  markers: Ref<maplibregl.Marker[]>;
  initMap: (options?: MapOptions) => void;
  isMapInitialized: Ref<boolean>;
  addMarker: (
    lngLat: maplibregl.LngLatLike,
    options?: MarkerOptions
  ) => maplibregl.Marker;
  flyTo: (
    target: maplibregl.LngLatLike,
    options?: {
      zoom?: number;
      duration?: number;
      pitch?: number;
      bearing?: number;
    }
  ) => void;
  changeStyle: (style: MapStyle) => void;
  removeAllMarkers: () => void;
  fitBounds: (
    bounds: maplibregl.LngLatBoundsLike,
    options?: {
      padding?: number | maplibregl.PaddingOptions;
      maxZoom?: number;
    }
  ) => void;
  addGeoJSONLayer: (
    id: string,
    geojson: GeoJSON.FeatureCollection,
    paint?: maplibregl.AnyPaint
  ) => void;
  removeLayer: (id: string) => void;
  getCenter: () => maplibregl.LngLat | undefined;
  getZoom: () => number | undefined;
}
