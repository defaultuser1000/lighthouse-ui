import React from 'react';
import {Link} from "react-router-dom";
import {Grid, GridColumn} from "semantic-ui-react";

export default class NotFound extends React.Component {



    render() {
        return (
            <Grid textAlign='center'
                  style={{height: '100vh'}}
                  verticalAlign='middle'
            >
                <GridColumn>
                    <h1>404 - Not Found!</h1>
                    <Link to="/">
                        Go Home
                    </Link>
                </GridColumn>
            </Grid>
        );
    }
}