import React from 'react';
import TermsOfCondition from "./TermsOfCondition";
import {Form, FormButton, FormCheckbox, FormGroup, Grid, GridColumn} from "semantic-ui-react";

export default class TCAccept extends React.Component {

    state = {
        checked: false
    };

    checkBoxChange = (event, data) => {
        this.setState({acceptTerms: data.acceptTerms});
    };

    accept = () => {
        if (!this.state.checked) {
            alert('You need to accept our terms and conditions...');
        } else {

        }
    };

    render() {
        return (
            <Grid textAlign='center'
                  verticalAlign='middle'
                  style={{height: '100vh'}}
            >
                <GridColumn textAlign='center' style={{maxWidth: 1000}}>
                    <Form>
                        <FormGroup>
                            <TermsOfCondition/>
                        </FormGroup>
                        <FormGroup widths='2'>
                            <FormCheckbox label='I agree with terms and conditions'
                                          name='acceptTerms'
                                          checked={this.state.checked}
                                          onChange={this.checkBoxChange}
                            />
                            <FormButton onClick={this.accept}>Next</FormButton>
                        </FormGroup>
                    </Form>
                </GridColumn>
            </Grid>
        );
    }

}