import { Button } from 'antd';
import React, { Fragment, PureComponent } from 'react'
import { ProductServices } from '../../services/ProductServices';
import FieldType from '../../utils/constants/enums/FieldType';
import Field from '../../utils/field/Field';
import RateBar from '../../utils/RateBar';
import SendText from '../../utils/SendText';

export default class RateField extends PureComponent {
    state = {
        rated: false,
        header: '',
        content: '',
        number: 5,
        showInput: false,
        placeholder: '',
    }
    componentDidMount() {
        const getRandomInt = max => Math.floor(Math.random() * max);
        const placeholders = [
            'Tuyệt vời ông mặt trời',
            'Số jáck',
            'Toẹt vời',
            'Đã đọc 1000 lần',
        ]
        this.setState({
            placeholder: placeholders[getRandomInt(placeholders.length)]
        })
        this.getRate()
    }

    getRate = async () => {
        if (this.props.userProfile?.uid) {
            let [success, body] = await ProductServices.getRateOfUser(this.props.bookId)
            if (success) {
                if (body) {

                } else {
                    this.setState({
                        rated: false,
                        header: '',
                        content: '',
                        number: 5,
                    })
                }
            }
        }
    }

    handleChange = ({ name, value }) => {
        this.setState({
            [name]: value
        })
    }

    showInput = () => {
        this.setState({
            showInput: true
        })
    }

    createRated = async () => {
        const { content, header, number } = this.state;
        const { bookId } = this.props
        let data = new FormData();
        data.append('uid', bookId)
        data.append('rate', number)
        data.append('content', content)
        data.append('header', header)
        let [success, body] = await ProductServices.rate(data)
    }

    render() {
        const { rated, content, header, number, showInput, placeholder } = this.state;
        console.log(rated)
        return rated ?
            null :
            <div className='add-rate'>
                {
                    showInput ?
                        <div className='input-row'>
                            <div className='rate-selector'>
                                <RateBar
                                    onClick={rate => this.handleChange({
                                        name: 'number',
                                        value: rate,
                                    })}
                                    rate={number}
                                />
                            </div>
                            <Field
                                type={FieldType.TEXT}
                                name='header'
                                onChange={this.handleChange}
                                value={header}
                                label='Tiêu đề'
                                placeHolder={placeholder}
                            />
                            <Field
                                type={FieldType.TEXTAREA}
                                name='content'
                                onChange={this.handleChange}
                                value={content}
                                label='Nội dung'
                                placeHolder='Nội dung nhận xét'
                            />
                            <Button onClick={this.createRated}>Thêm nhận xét</Button>
                        </div> :
                        <Fragment>
                            <div>
                                Bạn chưa nhận xét sản phẩm này
                            </div>
                            <Button onClick={this.showInput}>Thêm nhận xét</Button>
                        </Fragment>
                }
            </div>
    }
}
