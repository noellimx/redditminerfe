import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import React, {useEffect, useState} from "react";
import {Colors} from "../../colors";
import {contentStyle} from "../../styles/styles.ts";
import {Content} from "antd/es/layout/layout";
import {GetOutlet, type Outlet} from "../../client/https.ts";
import type {Info} from "../../store";
import {Button, Typography} from "antd";
import {GoogleCircleFilled, LinkOutlined} from "@ant-design/icons";
import L from 'leaflet';

import pin from '../../../src/assets/location-pin.png';

const iconPerson = new L.Icon({
    iconUrl: pin,
    iconSize: new L.Point(60, 75),
    className: 'leaflet-div-icon'
});

const mapContentStyle: React.CSSProperties = {
    textAlign: 'center',
    minHeight: 120,
    width: '100%',
    display: 'flex',
    height: '100%',
    color: '#fff',
    backgroundColor: Colors.RED_1,
};


interface Props {
    initInfo?: Info
}

export function MakanMap({initInfo}: Props) {
    const [outlets, setOutlets] = useState<Outlet[]>([]);
    useEffect(() => {
        (async () => {
            const outlets = await GetOutlet(initInfo ? initInfo.server_url : "")
            console.log(`outlets ${JSON.stringify(outlets)}`);
            setOutlets(outlets || []);
        })();
    }, [initInfo])


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

            {outlets.map(outlet => {
                const {latlong, review_links, official_links, name, address, postal_code} = outlet;
                if (latlong == undefined || latlong == null) {
                    return <></>
                }

                const {latitude, longitude} = latlong
                console.log(latitude, longitude)
                return <Marker icon={iconPerson} position={[parseFloat(latitude), parseFloat(longitude)]}>
                    <Popup>
                        <Typography>
                            {`Outlet Name: ${name}`}
                        </Typography>
                        <Typography>
                            {address ? `Address: ${address}}` : `Address: ${postal_code}`}
                        </Typography>
                        <Typography>
                            {official_links && official_links.map(link => {
                                return <a href={link}></a>
                            })}
                        </Typography>

                        <Typography>Search</Typography>
                        <Button
                            style={{padding: '0px'}}
                            type="link" htmlType="submit"
                            href={`https://www.google.com/search?q=${name}+${postal_code}`}
                            target="_blank">
                            <GoogleCircleFilled/>
                        </Button>

                        <Typography>Reviews</Typography>
                        {review_links && review_links.map(link => {
                            return <Button
                                style={{padding: '0px'}}
                                type="link" htmlType="submit"
                                href={link}
                                target="_blank">
                                <LinkOutlined/>
                            </Button>
                        })}

                    </Popup>
                </Marker>
            })}
            <a>aa</a>
        </MapContainer></Content>;
}