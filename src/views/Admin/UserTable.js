import { Tooltip } from 'antd';
import React, { PureComponent } from 'react'
import { AdminUserServices } from '../../services/AdminUserServices';
import Table from '../../utils/table/Table';

export default class UserTable extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            columns: this.columns,
            data: [],
            currentPage: 1,
            pageSize: 25,
            totalRows: 0,
            isLoadingTable: true,
        }
    }

    columns = [
        {
            header: 'Tên người dùng',
            name: 'images',
            cell: 'images',
            headerClasses: 'table-header',
            cellClasses: 'table-cell',
        },
        {
            header: 'Email',
            name: 'name',
            cell: 'name',
            headerClasses: 'table-header',
            cellClasses: 'table-cell',
        },
        {
            header: 'Hành động',
            name: 'actions',
            cell: 'actions',
            headerClasses: 'table-header align-right',
            cellClasses: 'table-cell actions align-right',
            formatter: this.actionBaches,
        }
    ]

    prepareData = async (pageNo, pageSize) => {
        await this.setState({
            isLoadingTable: true,
        })
        let data = {
            pageNo: pageNo ? pageNo : this.state.currentPage,
            pageSize: pageSize ? pageSize : this.state.pageSize,
            name: this.state.name,
        }
        let [success, body] = await AdminUserServices.getUsers(data.pageNo, data.pageSize, data.name);
        if (success) {
            if (body.data) {
                this.setState({
                    data: body.data.content,
                    currentPage: body.data.currentPage,
                    pageSize: body.data.pageSize,
                    totalRows: body.data.totalRows,
                })
            }
        }
        await this.setState({
            isLoadingTable: false,
        })
    }

    componentDidMount() {
        this.prepareData();
    }

    actionBaches = (cell, row) => {
        return (
            <div>
                <Tooltip title={'Chỉnh sửa'} placement="bottom" destroyTooltipOnHide={true}>
                    <div className="edit-btn" onClick={() => this.handleOpenUpdate(cell, row)}></div>
                </Tooltip>
                <Tooltip title={'Xoá'} placement="bottom" destroyTooltipOnHide={true}>
                    <div className="del-btn" onClick={(e) => this.handleDelBtn(cell, row)}></div>
                </Tooltip>
            </div>
        )
    }

    handlePagination = (currentPage, pageSize) => {
        this.prepareData(currentPage, pageSize);
    }

    render() {
        return (
            this.props.display ?
                <Table
                    rowKey='uid'
                    isLoading={this.state.isLoadingTable}
                    data={this.state.data}
                    className='df-table-container'
                    classNamePagination='km-pagination'
                    columns={this.state.columns}
                    pagination={{
                        pageNo: this.state.currentPage,
                        pageSize: this.state.pageSize,
                        totalRows: this.state.totalRows,
                        handlePagination: this.handlePagination
                    }}
                    apiPagination={this.handlePagination}
                /> : null
        )
    }
}
