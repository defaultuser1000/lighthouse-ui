import React from 'react';

import './Path.scss'

export default class Path extends React.Component {

    render() {
        let additionalPath = localStorage.getItem('additionalPath')
            ? localStorage.getItem('additionalPath') + '/'
            : '';
        return (
            <div className={'path-container'}>
                <div className={'label'}>
                    <span>Path:</span>
                </div>
                <div className={'value'}>
                    <span>Home/{additionalPath}</span>
                </div>
            </div>
        );
    }

}