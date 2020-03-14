import React from 'react';
import './Modal.scss';
import {Button, Col, Container, Row} from "react-bootstrap";

export function Modal(props) {

    return (
        <Modal {...props} aria-labelledby="contained-modal-title-vcenter">
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Using Grid in Modal
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row className="show-grid">
                        <Col xs={12} md={8}>
                            <code>.col-xs-12 .col-md-8</code>
                        </Col>
                        <Col xs={6} md={4}>
                            <code>.col-xs-6 .col-md-4</code>
                        </Col>
                    </Row>

                    <Row className="show-grid">
                        <Col xs={6} md={4}>
                            <code>.col-xs-6 .col-md-4</code>
                        </Col>
                        <Col xs={6} md={4}>
                            <code>.col-xs-6 .col-md-4</code>
                        </Col>
                        <Col xs={6} md={4}>
                            <code>.col-xs-6 .col-md-4</code>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );

}