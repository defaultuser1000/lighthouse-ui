import "./Details.scss"
import React, {Component} from "react";
import {Button, Form, Grid, Header, ItemImage} from "semantic-ui-react";

class Details extends Component {

    state = {
        currentUser: {
            creationDate: null,
            modificationDate: null,
            username: null,
            eMail: null,
            password: null,
            enabled: null,
            myUserDetails: {
                avatar: null,
                firstName: null,
                secondName: null,
                lastName: null,
                birthDay: null,
                postalCode: null,
                country: null,
                city: null,
                address: null,
                phoneNumber: null,
                instagram: [],
                fio: null,
                userDetailId: null
            },
            roles: [
                {
                    name: null,
                    roleId: null
                }
            ],
            ownedOrders: [
                {
                    creationDate: null,
                    modificationDate: null,
                    orderNumber: null,
                    orderStatus: {
                        creationDate: null,
                        modificationDate: null,
                        displayName: null,
                        nextStatusId: null,
                        orderStatusId: null
                    },
                    orderOwner: null,
                    orderCreator: null,
                    scanner: {
                        creationDate: null,
                        modificationDate: null,
                        name: null,
                        description: null,
                        yearOfManufacture: null,
                        scannerId: null
                    },
                    orderType: {
                        creationDate: null,
                        modificationDate: null,
                        name: null,
                        orderTypeId: null
                    },
                    scanSize: {
                        creationDate: null,
                        modificationDate: null,
                        size: null,
                        description: null,
                        scanSizeId: null
                    },
                    orderFilms: [
                        {
                            creationDate: null,
                            modificationDate: null,
                            filmType: null,
                            processingType: null,
                            quantity: null,
                            resolution: null,
                            push: null,
                            filmId: null
                        }
                    ],
                    special: null,
                    colorTones: null,
                    contrast: null,
                    density: null,
                    frame: true,
                    pack: null,
                    express: false,
                    afterOrderProcessed: null,
                    transportCompany: null,
                    orderDiskDestination: null,
                    orderId: null
                }
            ],
            termsOfConditionsAccepted: null,
            email: null,
            userId: null
        }
    };

    constructor(props) {
        super(props);
        this.setState({ currentUser: localStorage.getItem('detailedProfile') });
    }

    render() {
        return (
            <Grid columns={"equal"}>
                <Grid.Row>
                    <Grid.Column width={"8"}>
                        <Header size={"large"}>
                            {
                                this.state.currentUser && this.state.currentUser.myUserDetails !== null
                                    ? this.state.currentUser.myUserDetails.fio || 'EMPTY'
                                    : this.state.currentUser.username || 'EMPTY'
                            }
                        </Header>
                    </Grid.Column>
                    <Grid.Column textAlign='right'>
                        <Button
                            size={"large"}
                            icon={"edit outline"}
                            circular={true}
                            labelPosition={"left"}
                            label={"Edit"}
                            onClick={() => {console.log("Edit clicked");}}
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Form size={'large'} onSubmit={this.handleSubmit}>
                            <Form.Field>
                                <label>E-mail</label>
                                <input placeholder='E-mail' name='email' onChange={this.handleSelectChange}/>
                            </Form.Field>
                            <Form.Field>
                                <label>Instagram</label>
                                <input placeholder='Instagram' name='instagram' onChange={this.handleSelectChange}/>
                            </Form.Field>
                            <Form.Field>
                                <label>Phone</label>
                                <input placeholder='Phone' name='phoneNumber' onChange={this.handleSelectChange}/>
                            </Form.Field>
                            <Form.Field>
                                <label>E-mail</label>
                                <input placeholder='E-mail' name='email' onChange={this.handleSelectChange}/>
                            </Form.Field>
                        </Form>
                    </Grid.Column>
                    <Grid.Column>
                        <ItemImage size={'50px'} rounded avatar content={this.state.currentUser.myUserDetails.avatar}/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }

}

export default Details