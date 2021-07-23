import React, { memo, PureComponent } from 'react'
import { ProductServices } from '../../services/ProductServices';
import CollapableWrapper from '../../utils/CollapableWrapper';
import { commonFunction } from '../../utils/constants/commonFunction';
import RateBar from '../../utils/RateBar';
import IconAndTextButton from '../../utils/IconAndTextButton';

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
            datas: [],
            isCollapsed: true,
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

    toggle = () => {
        const isCollapsed = !this.state.isCollapsed
        this.setState({
            isCollapsed: isCollapsed,
        })
    }

    render() {
        const { datas, isCollapsed } = this.state
        return (
            datas && datas.length ?
                <div className='common-content-wrapper'>
                    <div className='title'>ĐÁNH GIÁ</div>
                    <div className='reviews'>
                        {(isCollapsed ? datas.slice(0, 3) : datas).map(data =>
                            <RateItem {...data} key={data.uid} />
                        )}
                    </div>
                    <IconAndTextButton
                        texts={[{
                            text: this.state.isCollapsed ? 'Xem thêm' : 'Thu gọn',
                        }]}
                        icons={[
                            {
                                icon: (this.state.isCollapsed ? 'arrow-down-icon' : 'arrow-up-icon') + ' icon24'
                            }
                        ]}
                        revert={true}
                        click={this.toggle}
                        className='center-button'
                    />
                </div> : null
        )
    }
}
