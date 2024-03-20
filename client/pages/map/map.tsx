'use client';
import { MapContainer, TileLayer } from 'react-leaflet';

export default function Map() {
  return (
    <MapContainer
      center={{ lat: 51.5084643445558, lng: -0.1277097778591926 }}
      zoom={13}
      scrollWheelZoom={true}
      className='h-[400px] w-[400px]'
    >
      <TileLayer
        attribution="© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>"
        url='https://api.mapbox.com/styles/v1/facundoveliz9/clld12m6x01bj01qr5yp2dd34/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZmFjdW5kb3ZlbGl6OSIsImEiOiJjbGxkMTBhOTAwNXZiM3Fwa2oxZ3R0NWJwIn0.1TVQteUC_PQQ_srTHAoD9A'
      />
    </MapContainer>
  );
}
