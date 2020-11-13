import React from 'react';

import './Path.scss'

export default class Path extends React.Component {

    render() {
        return (
            <div className={'path-container'}>
                <div className={'label'}>
                    <span>Path:</span>
                </div>
                <div className={'value'}>
                    <span>Home/{this.props.additionalPath}</span>
                </div>
            </div>
        );
    }

}