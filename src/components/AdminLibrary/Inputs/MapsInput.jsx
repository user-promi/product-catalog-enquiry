import React, { useEffect, useState, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';const MapsInput = (props) => {
    const [vendorLat, setVendorLat] = useState(props.vendorLat || 22.5726); // Default to Kolkata coordinates
    const [vendorLng, setVendorLng] = useState(props.vendorLng || 88.3639);
    const mapContainerRef = useRef(null);
    const markerRef = useRef(null);    useEffect(() => {
        // Initialize Mapbox
        mapboxgl.accessToken = appLocalizer.mapbox_api;        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [vendorLng, vendorLat],
            zoom: 12,
        });        const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            marker: false,
            mapboxgl,
        });        // Add geocoder control to the map
        map.addControl(geocoder);        // Create a marker and set it to the current location
        markerRef.current = new mapboxgl.Marker({ color: 'red' })
            .setLngLat([vendorLng, vendorLat])
            .addTo(map);        // Handle result from geocoder and update marker position
        geocoder.on('result', (ev) => {
            const { center } = ev.result;
            setVendorLat(center[1]);
            setVendorLng(center[0]);            // Move the marker to the new location
            markerRef.current.setLngLat(center);            // Call API to save the new latitude and longitude
        });        // Cleanup on component unmount
        return () => map.remove();
    }, []);    useEffect(() => {
        // Update the marker position when coordinates change
        if (markerRef.current) {
            markerRef.current.setLngLat([vendorLng, vendorLat]);
        }
    }, [vendorLat, vendorLng]);    return (
        <div className={props.wrapperClass}>
            <div
                ref={mapContainerRef} // Reference to the map container
                id={props.containerId || 'maps-container'}
                className={props.containerClass || 'maps-container'}
                style={{ width: '100%', height: '300px' }}
            ></div>            {props.proSetting && <span className="admin-pro-tag">pro</span>}            {props.description &&
                <p className={props.descClass} dangerouslySetInnerHTML={{ __html: props.description }}>
                </p>
            }
        </div>
    );
};export default MapsInput;