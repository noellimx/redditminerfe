import React from "react";
import {Colors} from "../colors";

export const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: "0",
    color: '#fff',
    height: 64,
    lineHeight: '64px',
    backgroundColor: Colors.RED_5,
    width: '100%',
    display: 'flex',
};

export const contentStyle: React.CSSProperties = {
    textAlign: 'center',
    minHeight: 120,
    width: '100%',
    height: '100%',
    color: '#fff',
    overflow: 'none',
    display: 'flex',
    backgroundColor: Colors.RED_1,
};
