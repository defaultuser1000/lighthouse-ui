import {withRouter} from "react-router-dom";
import './Profile.scss';
import React, {Component} from "react";
import {Header, Segment} from "semantic-ui-react";
import ReferenceGallery from "./ReferenceGallery/ReferenceGallery";
import Details from "./Details/Details";
import {authenticationService} from "../../_services/authentication.service";

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = { currentUser: {}};
    }

    componentDidMount() {
        authenticationService.getDetailedUserProfile();
    }

    render() {
        return (
            <div className='profile'>
                <Segment className='d-flex justify-content-center align-items-center'>
                    <React.Fragment>
                        <Header as='h1'>Your Profile</Header>
                    </React.Fragment>
                </Segment>
                <Segment>
                    <Details/>
                </Segment>
                <Segment>
                    <ReferenceGallery/>
                </Segment>
            </div>
        );
    }
}

export default withRouter(Profile);