// @ts-check
import React from "react";
import { Link } from "react-router-dom";
import Icon from "../../atoms/Icon/Icon";
import "./Breadcrumb.css";

const Breadcrumb = ({ items = [] }) => {
    return (
        <nav className="breadcrumb" aria-label="Breadcrumb">
            <ol className="breadcrumb-list">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <li key={index} className="breadcrumb-item">
                            {!isLast && item.to ? (
                                <Link to={item.to} className="breadcrumb-link">
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="breadcrumb-current" aria-current="page">
                                    {item.label}
                                </span>
                            )}
                            {!isLast && (
                                <Icon name="chevronRight" size={14} className="breadcrumb-separator" />
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
