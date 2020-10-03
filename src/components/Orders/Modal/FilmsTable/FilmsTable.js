import * as React from 'react';
import Cell from './Cell';
import './FilmsTable.scss';

export default class FilmsTable extends React.Component {

    headings = [
        '#', 'Film Type', 'Processing Type', 'Quantity', 'Resolution', 'Push'
    ];

    renderHeadingRow = (_cell, cellIndex) => {

        return (
            <Cell key ={`heading-${cellIndex}`} content={this.headings[cellIndex]} header={true}/>
        );
    };

    renderRow = (_row, rowIndex) => {
        const {rows} = this.props;

        return (
            <tr key={`row-${rowIndex}`}>
                {rows[rowIndex].map((_cell, cellIndex) => {
                    return (
                        <Cell key={`${rowIndex}-${cellIndex}`} content={rows[rowIndex][cellIndex]}/>
                    );
                })}
            </tr>
        );
    };

    render() {
        const {rows} = this.props;

        this.renderHeadingRow = this.renderHeadingRow.bind(this);
        this.renderRow = this.renderRow.bind(this);

        const theadMarkup = (
            <tr key={'heading'}>{this.headings.map(this.renderHeadingRow)}</tr>
        );

        const tbodyMarkup = rows.map(this.renderRow);

        return (
            <div className={'Films-Table'}>
                <table className={'Table'}>
                    <thead>{theadMarkup}</thead>
                    <tbody>
                        {tbodyMarkup}
                        <tr>
                            <Cell key={'add1'} content={'1'}/>
                            <Cell key={'add2'} content={'2'}/>
                            <Cell key={'add3'} content={'3'}/>
                            <Cell key={'add4'} content={'4'}/>
                            <Cell key={'add5'} content={'5'}/>
                            <Cell key={'add6'} content={'6'}/>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }

}