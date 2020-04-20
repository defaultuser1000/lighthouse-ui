import React from 'react';
import './Home.scss';
import {Header, Segment} from "semantic-ui-react";

export class Home extends React.Component {
    render() {
        return (
            <div className='home'>
                <Segment className='d-flex justify-content-center align-items-center'>
                    <React.Fragment>
                        <Header as='h1'>Dashboard</Header>
                    </React.Fragment>
                </Segment>
            </div>
        );
    }
}