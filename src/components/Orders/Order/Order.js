import React from 'react';
import ReactLoading from 'react-loading';
import './Order.scss'
import 'bootstrap/dist/css/bootstrap.css';
import {ORDER_1_FETCH_LINK} from "../../../config/Constants";
import {Form} from "react-bootstrap";

export default class Order extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            order: {},
            isLoading: true
        };
    }

    componentDidMount() {
        fetch(ORDER_1_FETCH_LINK)
            .then(results => results.json())
            .then(data => {
                this.setState({order: data.order, isLoading: false});
            }).catch(err => console.log(err))
    }

    render() {
        return(
            <div className={'order d-flex justify-content-center align-items-center'}>
                {this.state.isLoading ?
                    <ReactLoading type={"spin"} color={"#D84F47"} /> :
                    <OrderForm>{this.state.order}</OrderForm>
                }
            </div>
        );
    }
}

const OrderForm = (order) => (
    <Form >
        <Form.Group controlId="test">
            <Form.Label >Order Owner</Form.Label>
            <Form.Control
                type="text"
                value={[order.children.orderOwner.firstname, order.children.orderOwner.lastname].join(" ")}
                readOnly
                size='lg'
            />
            {/*{JSON.stringify(order.children)}*/}
        </Form.Group>
    </Form>
);