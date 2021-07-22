import React, { memo, PureComponent } from 'react'
import { ProductServices } from '../../services/ProductServices';
import CollapableWrapper from '../../utils/CollapableWrapper';
import { commonFunction } from '../../utils/constants/commonFunction';
import RateBar from '../../utils/RateBar';

const RateItem = memo(props => {
    const { content, rating, name, updated_at, header } = props;
    return <div className='rate-wrapper'>
        <div className='rate-item'>
            <div className='header-row'>
                <RateBar rate={rating} />
                <div className='header'>{header}</div>
            </div>
            <div className='content-row'>{content}</div>
            <div className='user-row'>Được nhận xét bởi <span className='name'>{name}</span> vào {commonFunction.convertTimestamp(updated_at)}</div>
        </div>
    </div>
})
export default class BookRate extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            datas: []
        }
    }
    async componentDidMount() {
        let [success, body] = await ProductServices.getRate(this.props.uid)
        if (success) {
            this.setState({
                datas: body.data && body.data.results,
            })
        }
    }

    render() {
        const { datas } = this.state
        return (
            datas && datas.length ?
                <div className='common-content-wrapper'>
                    <div className='title'>ĐÁNH GIÁ</div>
                    <CollapableWrapper>
                        <div className='reviews'>
                            {datas.map(data =>
                                <RateItem {...data} key={data.uid} />
                            )}
                        </div>
                    </CollapableWrapper>
                </div> : null
        )
    }
}
