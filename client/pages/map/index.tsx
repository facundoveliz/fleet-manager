"use client";
import dynamic from "next/dynamic";

/**
 * Leaflet makes direct calls to the DOM when it is loaded, therefore React Leaflet is not compatible with server-side rendering.
 * @see https://stackoverflow.com/a/64634759/9244579
 */
const Map = dynamic(() => import("./map"), {
  loading: () => <p>Map is loading</p>,
  ssr: false,
});

export default Map;
