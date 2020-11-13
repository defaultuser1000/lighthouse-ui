import * as React from 'react';
import Cell from './Cell';
import './FilmsTable.scss';
import {Button, Select} from "semantic-ui-react";
import Counter from "./cellContents/Counter";

export default class FilmsTable extends React.Component {

    state = {
        films: this.props.rows,
        newFilm: {
            filmType: null,
            processingType: null,
            quantity: 0,
            resolution: null,
            push: 0
        },
        scanResolutions: this.props.scanResolutions
    };

    editableHeadings = [
        '#', 'Film Type', 'Processing Type', 'Quantity', 'Resolution', 'Push', 'Action'
    ];

    fixedHeadings = [
        '#', 'Film Type', 'Processing Type', 'Quantity', 'Resolution', 'Push'
    ];

    filmTypes = [
        {key: 35, text: '35mm', value: '35'},
        {key: 120, text: '120type', value: '120'}
    ];

    processingTypes = [
        {key: 'c41', text: 'C41', value: 'C41'},
        {key: 'bw', text: 'BW', value: 'BW'},
        {key: 'e6', text: 'E6', value: 'E6'}
    ];

    constructor(props) {
        super(props);

        this.renderHeadingRow = this.renderHeadingRow.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.valueChanged = this.valueChanged.bind(this);
    }

    componentDidMount() {
        this.setState({
            films: this.props.rows,
            newFilm: {
                filmType: null,
                processingType: null,
                quantity: 0,
                resolution: null,
                push: 0
            },
            scanResolutions: this.props.scanResolutions
        });
    }

    renderHeadingRow = (_cell, cellIndex) => {
        return (
            <Cell
                key ={`heading-${cellIndex}`}
                content={
                    this.props.editable
                        ? this.editableHeadings[cellIndex]
                        : this.fixedHeadings[cellIndex]
                }
                header={true}
            />
        );
    };

    renderRow = (_row, rowIndex) => {
        const rows = this.state.films;

        const filmTypeContent = this.filmTypes.filter(type => type.value === rows[rowIndex].filmType.toString())[0].text;

        const processingTypeContent = this.props.editable
            ? this.processingTypes.filter(type => type.value === rows[rowIndex].processingType)[0].text
            : rows[rowIndex].processingType;

        const quantityContent = rows[rowIndex].quantity;

        const resolutionContent = this.props.editable
            ? this.state.scanResolutions.filter(res => res.value === rows[rowIndex].resolution)[0].text
            : rows[rowIndex].resolution;

        const pushContent = rows[rowIndex].push;

        return (
            <tr key={`row-${rowIndex}`}>
                <Cell key={`${rowIndex}-number`} content={rowIndex + 1}/>
                <Cell key={'filmType'} content={filmTypeContent}/>
                <Cell key={'processingType'} content={processingTypeContent}/>
                <Cell key={'quantity'} content={quantityContent}/>
                <Cell key={'resolution'} content={resolutionContent}/>
                <Cell key={'push'} content={pushContent}/>
                {this.props.editable &&
                    <Cell key={'action'} content={
                          <Button
                              rowindex={rowIndex}
                              icon={'trash'}
                              color={'red'}
                              circular
                              size={'mini'}
                              onClick={this.removeRow}
                          />
                      }
                    />
                }
            </tr>
        );
    };

    onChange = (e:any, {name, value}) => {
        this.valueChanged(name, value);
    };

    valueChanged(name, value) {
        let film = this.state.newFilm;
        film[name?.toString()] = value?.toString();
        this.setState({ newFilm: film });
    };

    createSelect(options, className, value) {
        return <Select name={className} onChange={this.onChange} className={className} options={options} value={value}/>
    }

    createCounter(className, value) {
        return <Counter className={className} name={className} stepperchange={this.valueChanged} value={value}/>
    }

    addRow = () => {
        let film = this.state.newFilm;
        let films = this.state.films;
        if ((film.filmType !== '' && film.filmType !== undefined)
            && (film.processingType !== '' && film.processingType !== undefined)
            && (film.resolution !== '' && film.resolution !== undefined)
            && film.quantity > 0
        ) {
            films.push(film);
            // this.props.onChange(film);
            this.resetSelectFields()
        }
        this.setState({
            films: films
        });
    };

    resetSelectFields() {
        this.setState({
            newFilm: {
                filmType: null,
                processingType: null,
                quantity: 0,
                resolution: null,
                push: 0
            }
        });
    }

    removeRow = (e:any, {rowindex}) => {
        let films = this.state.films;
        films.splice(rowindex, 1);
        this.setState({ films: films });
    };

    render() {
        const rows = this.state.films;

        const theadMarkup = (
            <tr key={'heading'}>
                {
                    this.props.editable
                        ? this.editableHeadings.map(this.renderHeadingRow)
                        : this.fixedHeadings.map(this.renderHeadingRow)
                }
            </tr>
        );

        const tbodyMarkup = rows.map(this.renderRow);
        const scanResolutions = this.state.scanResolutions;

        return (
            <div className={'Films-Table'}>
                <table className={'Table'}>
                    <thead>{theadMarkup}</thead>
                    <tbody>
                        {tbodyMarkup}
                        {this.props.editable &&
                            <tr>
                                <Cell key={'newNumber'} content={tbodyMarkup.length + 1}/>
                                <Cell key={'filmType'} content={this.createSelect(this.filmTypes, 'filmType', this.state.newFilm.filmType)}/>
                                <Cell key={'processingType'} content={this.createSelect(this.processingTypes, 'processingType', this.state.newFilm.processingType)}/>
                                <Cell key={'quantity'} content={this.createCounter('quantity', this.state.newFilm.quantity)}/>
                                <Cell key={'resolution'} content={this.createSelect(scanResolutions, 'resolution', this.state.newFilm.resolution)}/>
                                <Cell key={'push'} content={this.createCounter('push', this.state.newFilm.push)}/>
                                <Cell key={'action'} content={<Button icon={'add'} circular size={'mini'} onClick={this.addRow}/>}/>
                            </tr>}
                    </tbody>
                </table>
            </div>
        );
    }

}