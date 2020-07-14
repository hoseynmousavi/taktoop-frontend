import React, {PureComponent} from "react"
import Material from "../Components/Material"
import GarbageSvg from "../../Media/Svgs/GarbageSvg"
import PencilSvg from "../../Media/Svgs/Pencil"
import SmoothArrowSvg from "../../Media/Svgs/SmoothArrowSvg"
import {REST_URL} from "../../Functions/api"
import TickSvg from "../../Media/Svgs/TickSvg"
import ImageShow from "../Components/ImageShow"
import formatDetection from "../../Helpers/formatDetection"

class PostDescription extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {}
    }

    componentDidMount()
    {
        const {item} = this.props
        if (item.type === "description" && this.desc) formatDetection(this.desc)
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
        const {item, toggleUpdateDescription, toggleUpdateBoldDescription, toggleUpdateImgVideo, deleteDesc, regularView} = this.props
        return (
            <div className={`panel-post-description ${!regularView ? "" : "regular"}`}>
                {
                    !regularView &&
                    <React.Fragment>
                        <Material className="panel-post-description-delete" onClick={() => deleteDesc(item)}><GarbageSvg/></Material>
                        <label>
                            <Material className="panel-post-description-edit" onClick={() => item.type === "description" ? toggleUpdateDescription(item) : item.type === "bold" ? toggleUpdateBoldDescription(item) : null}>
                                {
                                    item.type === "picture" || item.type === "video" ?
                                        <React.Fragment>
                                            <PencilSvg/>
                                            <input hidden type="file" accept={item.type === "picture" ? "image/*" : "video/*"} onChange={e => toggleUpdateImgVideo(e, item)}/>
                                        </React.Fragment>
                                        :
                                        <PencilSvg/>
                                }
                            </Material>
                        </label>
                        <Material className="panel-post-description-order">{order ? order : item.order}</Material>
                        <SmoothArrowSvg className="panel-post-description-order-up" onClick={this.setOrderUp}/>
                        <SmoothArrowSvg className="panel-post-description-order-down" onClick={this.setOrderDown}/>
                        {order && order !== item.order && <TickSvg className="panel-post-description-sub" onClick={this.updateOrder}/>}
                    </React.Fragment>
                }
                {
                    item.type === "description" ?
                        <div className="panel-post-description-desc" ref={e => this.desc = e}>{item.content}</div>
                        :
                        item.type === "bold" ?
                            <div className="panel-post-description-desc bold" ref={e => this.desc = e}>{item.content}</div>
                            :
                            item.type === "picture" ?
                                <ImageShow className="panel-post-description-img-video" key={item.content} src={REST_URL + item.content} alt=""/>
                                :
                                <video key={item.content} className="panel-post-description-img-video">
                                    <source src={REST_URL + item.content}/>
                                </video>
                }
            </div>
        )
    }
}

export default PostDescription