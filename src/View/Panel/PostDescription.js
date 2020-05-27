import React, {PureComponent} from "react"
import Material from "../Components/Material"
import GarbageSvg from "../../Media/Svgs/GarbageSvg"
import PencilSvg from "../../Media/Svgs/Pencil"
import SmoothArrowSvg from "../../Media/Svgs/SmoothArrowSvg"
import {REST_URL} from "../../Functions/api"
import TickSvg from "../../Media/Svgs/TickSvg"

class PostDescription extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {}
    }

    setOrderUp = () =>
    {
        const {order} = this.state
        const {item, length} = this.props
        const newOrder = order ? order + 1 : item.order + 1
        this.setState({...this.state, order: newOrder <= length ? newOrder : length})
    }

    setOrderDown = () =>
    {
        const {order} = this.state
        const {item} = this.props
        const newOrder = order ? order - 1 : item.order - 1
        this.setState({...this.state, order: newOrder >= 1 ? newOrder : 1})
    }

    updateOrder = () =>
    {
        const {order} = this.state
        const {updatePostDescription, item} = this.props
        updatePostDescription({order, _id: item._id})
    }

    render()
    {
        const {order} = this.state
        const {item, toggleUpdateDescription, toggleUpdateBoldDescription, deleteDesc} = this.props
        return (
            <div className="panel-post-description">
                <Material className="panel-post-description-delete" onClick={() => deleteDesc(item)}><GarbageSvg/></Material>
                <Material className="panel-post-description-edit" onClick={() => item.type === "description" ? toggleUpdateDescription(item) : toggleUpdateBoldDescription(item)}><PencilSvg/></Material>
                <Material className="panel-post-description-order">{order ? order : item.order}</Material>
                <SmoothArrowSvg className="panel-post-description-order-up" onClick={this.setOrderUp}/>
                <SmoothArrowSvg className="panel-post-description-order-down" onClick={this.setOrderDown}/>
                {order && order !== item.order && <TickSvg className="panel-post-description-sub" onClick={this.updateOrder}/>}
                {
                    item.type === "description" ?
                        <div className="panel-post-description-desc">{item.content}</div>
                        :
                        item.type === "bold" ?
                            <div className="panel-post-description-desc bold">{item.content}</div>
                            :
                            item.type === "picture" ?
                                <img className="panel-post-description-img-video" src={REST_URL + item.content} alt=""/>
                                :
                                <video className="panel-post-description-img-video">
                                    <source src={REST_URL + item.content}/>
                                </video>
                }
            </div>
        )
    }
}

export default PostDescription