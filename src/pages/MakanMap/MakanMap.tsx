import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import React from "react";
import {Colors} from "../../colors";
import {contentStyle} from "../../styles/styles.ts";
import {Content} from "antd/es/layout/layout";


const mapContentStyle: React.CSSProperties = {
    textAlign: 'center',
    minHeight: 120,
    width: '100%',
    display: 'flex',
    height: '100%',
    color: '#fff',
    backgroundColor: Colors.RED_1,
};

export function MakanMap() {
    return <Content style={{...contentStyle, backgroundColor: 'black'}}>
        <MapContainer style={{...mapContentStyle, backgroundColor: 'black'}}
                      zoom={13}
                      center={[1.2868108, 103.8545349]}
                      scrollWheelZoom={true}
                      fadeAnimation={true}
                      markerZoomAnimation={true}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[1.2868108, 103.8545349]}>
                <Popup>
                    A pretty CSS3 popup. <br/> Easily customizable.
                </Popup>
            </Marker>
            <a>aa</a>
        </MapContainer></Content>;
}