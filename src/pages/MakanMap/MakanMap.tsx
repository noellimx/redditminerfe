import React, {useEffect, useState} from "react";

import "./custom.css";
import pin from '../../../src/assets/noun-pin-3083030.svg';
import {Colors} from "../../colors";
import type {Info} from "../../store";
import {GetOutlet, type Outlet} from "../../client/https.ts";

import L from 'leaflet';
import {GoogleCircleFilled} from "@ant-design/icons";
import {Button, Card, Flex, Row, Space, Typography} from "antd";
import {MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents} from "react-leaflet";

const iconMarker = new L.Icon({
    iconUrl: pin,
    iconSize: new L.Point(40, 40),
});

const containerStyle: React.CSSProperties = {
    textAlign: 'center',
    minHeight: "120px",
    overflow: "none",
    width: '100%',
    display: 'flex',
    height: '100%',
    color: '#fff',
    flexDirection: 'column',
    backgroundColor: Colors.RED_1,
};

interface Props {
    initInfo?: Info
}

function MapEventsNAC({onClick}: { onClick: () => void }) {
    const map = useMap()
    // console.log(`MapEventInit ${map}`)

    if (map) {
        setTimeout(() => {
            map.invalidateSize()
        }, 500)
    }
    useMapEvents({'click': onClick})
    return null
}

interface FMarkerProps {
    setFocusOutlet: (outlet: Outlet) => void;
    outlet: Outlet

}

function FMarker({setFocusOutlet, outlet}: FMarkerProps) {
    const map = useMap()
    const latitude = outlet.latlong?.latitude;
    const longitude = outlet.latlong?.longitude;
    const {name, address, postal_code, /*official_links, review_links*/} = outlet;
    if (!latitude || !longitude) {
        return null
    }
    return <Marker
        eventHandlers={{
            click: (e) => {
                const location = e.target.getLatLng();

                console.log("marker event: clicked")
                setFocusOutlet(outlet)

                setTimeout(() => {
                    map.flyToBounds([location]);
                }, 200)
            }
        }}
        key={outlet.id} icon={iconMarker}
        position={[parseFloat(latitude), parseFloat(longitude)]}>
        <Popup className={"map-marker-popup"}>
            <Typography style={{
                fontWeight: "bold",
                whiteSpace: "normal",
                fontSize: "24px",
                width: "100%",
                alignItems: "center"
            }}>
                {`${name}`}
            </Typography>
            <Button
                style={{padding: '0px'}}
                type="link" htmlType="submit"
                href={`https://www.google.com/search?q=${name}+${postal_code}`}
                target="_blank">
                <GoogleCircleFilled/>
            </Button>
            <Flex style={{gap: "10px", alignItems: "center"}}>
                <Typography style={{fontWeight: "bold"}}>
                    {address ? `${address}` : `${postal_code}`}
                </Typography>
            </Flex>
            {/*<Flex style={{alignItems: "center", gap: "10px"}}>*/}
            {/*    <Typography>Links</Typography>*/}
            {/*    {official_links && official_links.map(link => {*/}
            {/*        return <Button*/}
            {/*            style={{padding: '0px'}}*/}
            {/*            type="link" htmlType="submit"*/}
            {/*            href={link}*/}
            {/*            target="_blank">*/}
            {/*            <LinkOutlined/>*/}
            {/*        </Button>*/}
            {/*    })}*/}
            {/*</Flex>*/}

            {/*<Flex style={{alignItems: "center", gap: "10px"}}>*/}
            {/*    <Typography>Reviews</Typography>*/}
            {/*    {review_links && review_links.map(link => {*/}
            {/*        return <Button*/}
            {/*            style={{padding: '0px'}}*/}
            {/*            type="link" htmlType="submit"*/}
            {/*            href={link.link}*/}
            {/*            target="_blank">*/}
            {/*            <LinkOutlined/>*/}
            {/*        </Button>*/}
            {/*    })}*/}
            {/*</Flex>*/}

        </Popup>
    </Marker>;
}

// const useResizeObserver = () => {
//     const mapRef = useRef(null);
//     const containerRef = useRef(null);
//     console.log(`resize observer ${mapRef.current} ${containerRef.current}`);
//     const map = mapRef.current;
//
//     useEffect(() => {
//         const container = containerRef.current;
//         const resizeObserver = new ResizeObserver(() => {
//
//             console.log(`resize observer effect ${map} ${container}`);
//             if (map) {
//                 console.log("resize observer: invalidating");
//                 map.invalidateSize();
//             }
//         });
//
//         resizeObserver.observe(container);
//
//         return () => {
//             resizeObserver.unobserve(container);
//         };
//     }, []);
//
//     return {mapRef, containerRef};
// }

export function MakanMap({initInfo}: Props) {
    const [outlets, setOutlets] = useState<Outlet[]>([]);
    const [focusOulet, setFocusOutlet] = useState<Outlet | null>();
    // const {mapRef, containerRef} = useResizeObserver();
    const focusing = !!focusOulet;
    useEffect(() => {
        (async () => {
            const outlets = await GetOutlet(initInfo ? initInfo.server_url : "", {})
            // console.log(`outlets ${JSON.stringify(outlets)}`);
            setOutlets(outlets || []);
        })();
    }, [initInfo])

    return <Flex className={"mk-map-page"} style={containerStyle}>
        <Flex className={"mk-map-" +
            "mutable-map-container"} style={{
            height: focusing ? '70%' : '100%',
            width: '100%',
            overflow: "none",
        }}
            // ref={containerRef}
        >
            <MapContainer style={{
                overflow: "none",
                width: '100%',
                display: 'flex',
                height: '100%',
            }}

                // ref={mapRef}
                          className={"mk-map-leaflet-container"}
                          zoom={13}
                          center={[1.2868108, 103.8545349]}
                          scrollWheelZoom={true}
                          fadeAnimation={true}
                          markerZoomAnimation={true}
            >
                <MapEventsNAC onClick={() => setFocusOutlet(null)}/>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {outlets.map(outlet => {
                    // console.log(latitude, longitude)
                    return <FMarker outlet={outlet} setFocusOutlet={setFocusOutlet}></FMarker>
                })}
            </MapContainer>
        </Flex>

        {focusOulet && (<Card className={"mk-map-mutable-container-focus"}
                              style={{
                                  backgroundColor: Colors.RED_1,
                                  width: '100%',
                                  flexGrow: 1,
                                  flexDirection: "column",
                                  overflow: 'auto',
                                  position: 'relative',
                                  borderTop: `3px solid ${Colors.RED_3}`,
                              }}>
            <Row style={{alignItems: "center", gap: "10px"}}
                 className={"mk-map-mutable-container-focus-header-address"}>
                <Typography style={{textAlign: "left", fontWeight: "bold", fontSize: "24px"}}>
                    {focusOulet.name}
                </Typography>
                <Button
                    style={{padding: '0px', height: '100%', width: 'auto',}}
                    type="link" htmlType="submit"
                    href={`https://www.google.com/search?q=${focusOulet.name}+${focusOulet.postal_code}`}
                    target="_blank">
                    <GoogleCircleFilled style={{fontSize: '18px'}}/>
                </Button>
            </Row>
            <Typography style={{textAlign: "left", fontSize: "20px"}}>
                {/*if address not empty and doesnt include postal then include it*/}
                {focusOulet.address ? (focusOulet.address.includes(focusOulet.postal_code) ? `${focusOulet.address}` : `${focusOulet.address} ${focusOulet.postal_code}`) : `${focusOulet.postal_code}`}
            </Typography>

            {<Flex className={"linkgroups-gap"} style={{flexDirection: "column", gap: "5px"}}>
                {
                    focusOulet.official_links && <Flex style={{padding: '0px', gap: '10px', alignItems: "center"}}>
                        <Typography style={{fontWeight: "bold"}}> Websites </Typography>
                        {
                            focusOulet.official_links.map((link) => {
                                return <Button style={{
                                    padding: '5px',
                                    borderRadius: "5px",
                                    border: "1px solid black",
                                    backgroundColor: Colors.RED_3,
                                    color: Colors.CHARBLACK
                                }}
                                               type="link" htmlType="submit"
                                               href={link}
                                               target="_blank">
                                    {getDomain(link)}
                                </Button>
                            })
                        }
                    </Flex>
                }
                {<Space className={"space-gap"} style={{height: "5px"}}></Space>}

                {
                    focusOulet.review_links &&
                    <Flex className={"focus-review-links"} style={{padding: '0px', gap: '10px', alignItems: "center"}}>
                        <Typography style={{fontWeight: "bold"}}> Reviews </Typography>
                        {
                            focusOulet.review_links.map((link, id) => {
                                let creator = link.creator;
                                let platform = link.platform;

                                let description = "";
                                if (link.creator === "Others") {
                                    creator = "";
                                }
                                if (link.platform === "Others") {
                                    platform = ""
                                }

                                if (creator !== "" && platform !== "") {
                                    description = `${link.creator} @ ${link.platform}`;
                                } else if (creator === "" && platform === "") {
                                    description = getDomain(link.link);
                                } else if (creator === "") {
                                    description = `@ ${link.platform}`;
                                } else {
                                    description = `${link.creator}`;
                                }
                                return <Button key={`map-focusreview-link-buttons-${id}`} style={{
                                    padding: '5px',
                                    borderRadius: "5px",
                                    border: "1px solid black",
                                    backgroundColor: Colors.RED_3,
                                    color: Colors.CHARBLACK
                                }}
                                               type="link" htmlType="submit"
                                               href={link.link}
                                               target="_blank">
                                    {description}
                                </Button>
                            })
                        }
                    </Flex>
                }</Flex>}
            <Flex style={{position: "absolute", right: 0, top: 0}}>
                <Button onClick={() => {
                    setFocusOutlet(null)
                }}>
                    Close
                </Button>
            </Flex>
        </Card>)}
    </Flex>;
}

function getDomain(url: string) {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        // Handle cases where the URL is invalid
        return "";
    }
}