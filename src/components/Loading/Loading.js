import React from 'react';
import * as animation from './lighthouse.json';
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import {Grid, GridColumn, GridRow, Header} from "semantic-ui-react";

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation.default,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
};

export default class Loading extends React.Component {

    render() {
        return (
            <FadeIn>
                <Grid textAlign='center'
                      style={{height: '100vh', margin: 0}}
                      verticalAlign='middle'
                >
                    <GridRow>
                        <GridColumn verticalAlign='middle'>
                            <Lottie options={defaultOptions}
                                    isClickToPauseDisabled={true}
                                    height={400}
                                    width={400}
                                    speed={3}
                            />
                            {/*<Header>Loading data...</Header>*/}
                        </GridColumn>
                    </GridRow>
                </Grid>
            </FadeIn>
        );
    }

}