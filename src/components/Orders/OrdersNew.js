import React from 'react';
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TablePagination from "@material-ui/core/TablePagination";
import {Link, withRouter} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import {Label} from "semantic-ui-react";
import {statusColor, systemColor} from "../../config/Constants";
import CircularProgress from "@material-ui/core/CircularProgress";

// import './Orders.scss'

class OrdersNew extends React.Component {

    render() {
        return (
            <div className={'table-container'}>
                <StickyHeadTable/>
            </div>
        );
    }
}

export default withRouter(OrdersNew);

const adminColumns = [
    {
        maxWidth: 5,
        label: '#',
        align: 'left',
        id: 'orderNumber'
    },
    {
        label: 'Client',
        id: 'orderOwner',
        align: 'left',
        format: (value) => {
            return <a href={"/users/user/" + value.orderOwner.userId}
                      key={value.orderOwner.userId}>
                {
                    value.orderOwner.myUserDetails !== null
                        ? value.orderOwner.myUserDetails.fio
                        : 'EMPTY FIO'
                }
            </a>;
        }
    },
    {
        label: 'Status',
        id: 'orderStatus',
        sorting: false,
        align: 'center',
        render: (rowData) => {
            return <Label
                color={rowData.orderStatus ? statusColor.get(rowData.orderStatus.displayName.toLowerCase()) : null}
                key={rowData.orderStatus ? statusColor.get(rowData.orderStatus.displayName.toLowerCase()) : null}
            >
                {rowData.orderStatus.displayName}
            </Label>
        }
    },
    {label: 'Created At', id: 'creationDate', type: 'date'},
    {label: 'Modified At', id: 'modificationDate', type: 'date', defaultSort: 'desc'}
];

const columns = [
    {id: 'name', label: 'Name', minWidth: 170},
    {id: 'code', label: 'ISO\u00a0Code', minWidth: 100},
    {
        id: 'population',
        label: 'Population',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'size',
        label: 'Size\u00a0(km\u00b2)',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'density',
        label: 'Density',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toFixed(2),
    },
];

function createData(orderId, orderNumber, orderOwnerId, orderOwnerFio, orderStatus, creationDate, modificationDate) {
    return {orderId, orderNumber, orderOwnerId, orderOwnerFio, orderStatus, creationDate, modificationDate};
}

const rows = [
    createData(1, '1001', 1, 'Закржевский Андрей Сергеевич', 'New', '2020-10-15', '2020-10-15'),
    createData(2, '1002', 1, 'Закржевский Андрей Сергеевич', 'New', '2020-10-15', '2020-10-15'),
    createData(3, '1003', 1, 'Закржевский Андрей Сергеевич', 'New', '2020-10-15', '2020-10-15'),
    createData(4, '1004', 1, 'Закржевский Андрей Сергеевич', 'New', '2020-10-15', '2020-10-15'),
    createData(5, '1005', 1, 'Закржевский Андрей Сергеевич', 'New', '2020-10-15', '2020-10-15'),
    createData(6, '1006', 1, 'Закржевский Андрей Сергеевич', 'New', '2020-10-15', '2020-10-15'),
    createData(7, '1007', 1, 'Закржевский Андрей Сергеевич', 'New', '2020-10-15', '2020-10-15'),
    createData(8, '1008', 1, 'Закржевский Андрей Сергеевич', 'New', '2020-10-15', '2020-10-15'),
    createData(9, '1009', 1, 'Закржевский Андрей Сергеевич', 'New', '2020-10-15', '2020-10-15'),
    createData(10, '1010', 1, 'Закржевский Андрей Сергеевич', 'New', '2020-10-15', '2020-10-15'),
    createData(11, '1011', 1, 'Закржевский Андрей Сергеевич', 'New', '2020-10-15', '2020-10-15'),
    createData(12, '1012', 1, 'Закржевский Андрей Сергеевич', 'New', '2020-10-15', '2020-10-15'),
    createData(13, '1013', 1, 'Закржевский Андрей Сергеевич', 'New', '2020-10-15', '2020-10-15'),
    createData(14, '1014', 1, 'Закржевский Андрей Сергеевич', 'New', '2020-10-15', '2020-10-15'),
    createData(15, '1015', 1, 'Закржевский Андрей Сергеевич', 'New', '2020-10-15', '2020-10-15'),
];

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        height: '100%'
    },
    container: {
        height: 'calc(100% - 52px)'
    },
    pagination: {
        paddingRight: '80px !important'
    },
    // loadingSpinner: {
    //     marginLeft: theme.spacing(2)
    // }
}));

function StickyHeadTable() {
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [isDataLoading] = React.useState(true);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper className={`full-height-container ${classes.root}`}>
            <TableContainer className={`full-height-body ${classes.container}`}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {adminColumns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{minWidth: column.minWidth}}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            // isDataLoading
                            // ? <CircularProgress
                            //     colorPrimary={systemColor}
                            //     className={classes.loadingSpinner}
                            //     align={'center'}
                            // /> :
                            rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                return (
                                    <TableRow hover component={Link} to={'/orders/order/' + row.orderId} tabIndex={-1}
                                              key={row.code}>
                                        {adminColumns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {column.format && typeof value === 'number' ? column.format(value) : value}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[25, 50, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                className={classes.pagination}
            />
        </Paper>
    );
}