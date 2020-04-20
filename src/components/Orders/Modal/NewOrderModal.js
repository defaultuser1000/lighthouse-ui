import React from 'react';
import './NewOrderModal.scss';
import {Header, Image, Modal} from "semantic-ui-react";

let openNewOrderModal;

let handleClose = (prop) => {
    openNewOrderModal = prop;
};

const ModalModalExample = (props) => (
    <Modal closeIcon open={(openNewOrderModal = props.openModal)} closeOnDimmerClick onClose={handleClose(false)}>
        <Modal.Header>Select a Photo</Modal.Header>
        <Modal.Content image>
            <Image wrapped size='medium' src='https://react.semantic-ui.com/images/avatar/large/rachel.png' />
            <Modal.Description>
                <Header>Default Profile Image</Header>
                <p>
                    We've found the following gravatar image associated with your e-mail
                    address.
                </p>
                <p>Is it okay to use this photo?</p>
            </Modal.Description>
        </Modal.Content>
    </Modal>
);

export default ModalModalExample