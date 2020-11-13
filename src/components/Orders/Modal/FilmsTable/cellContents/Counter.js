import * as React from 'react';
import {Button, Grid, GridColumn, Input} from "semantic-ui-react";
import './Counter.scss'

export default class Counter extends React.Component {

    state = { count: 0 };

    static getDerivedStateFromProps(props, state) {
        return { count: props.value };
    }

    handleClick = (type, func, name) => {
        let current = this.state.count;
        if (type === '-') {
            current--;
        } else {
            current++;
        }
        this.setState({count: current});
        func(name, current);
    };

    render() {
        return (
            <Grid className={'counter equal width'}>
                <GridColumn className={'button'}>
                    <Button className={'minus'} size={'mini'} icon={'minus'} circular onClick={this.handleClick.bind(this, '-', this.props.stepperchange, this.props.name)} onSubmit={null}/>
                </GridColumn>
                <GridColumn className={'value'}>
                    <Input name={this.props.name} className={'valueField'} value={this.state.count} disabled/>
                </GridColumn>
                <GridColumn className={'button'}>
                    <Button className={'plus'} size={'mini'} icon={'add'} circular onClick={this.handleClick.bind(this, '+', this.props.stepperchange, this.props.name)} onSubmit={null}/>
                </GridColumn>
            </Grid>
        );
    }

}