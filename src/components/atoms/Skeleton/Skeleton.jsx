// @ts-check
import React from "react";
import "./Skeleton.css";

const Skeleton = ({ width = "100%", height = "1em", variant = "text", className = "" }) => {
    const style = {
        width: width,
        height: height,
    };

    return (
        <div
            className={`skeleton skeleton--${variant} ${className}`}
            style={style}
        />
    );
};

export default Skeleton;
