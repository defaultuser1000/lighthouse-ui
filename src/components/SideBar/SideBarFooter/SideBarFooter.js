import React from 'react';
import './SideBarFooter.scss';
import {APP_VERSION} from "../../../config/Constants";

export function SideBarFooter() {
    return (
        <React.Fragment>
            <div className='footer-block'>
                <div>v {APP_VERSION}</div>
            </div>
            <div className='footer-block'>
                <div>© LighthouseFilmLab, 2020</div>
            </div>
        </React.Fragment>
    );
}