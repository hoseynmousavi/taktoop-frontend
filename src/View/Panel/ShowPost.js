import React, {PureComponent} from "react"
import api, {REST_URL} from "../../Functions/api"
import {ClipLoader} from "react-spinners"
import Material from "../Components/Material"
import GarbageSvg from "../../Media/Svgs/GarbageSvg"
import PencilSvg from "../../Media/Svgs/Pencil"
import SmoothArrowSvg from "../../Media/Svgs/SmoothArrowSvg"

class ShowPost extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            isLoading: true,
        }
    }

    componentDidMount()
    {
        const {title} = this.props
        api.get("post", `?title=${title}`)
            .then(post => this.setState({...this.state, post, isLoading: false}))
            .catch(() => this.setState({...this.state, isLoading: false, err: true}))
    }

    render()
    {
        const {err, isLoading, post} = this.state
        if (err) return <div className="panel-table-err-loading">مشکلی پیش آمد! کانکشن خود را بررسی کنید!</div>
        else if (isLoading) return <div className="panel-table-err-loading"><ClipLoader size={19} color="var(--primary-color)"/></div>
        return (
            <div>
                <div className="panel-table-title">
                    پست {post.title}
                </div>
                <div className="panel-post-description-cont">
                    {
                        post.post_descriptions.length > 0 ?
                            post.post_descriptions.map(item =>
                                <div key={item._id} className="panel-post-description">
                                    <Material className="panel-post-description-delete"><GarbageSvg/></Material>
                                    <Material className="panel-post-description-edit"><PencilSvg/></Material>
                                    <Material className="panel-post-description-order">{item.order}</Material>
                                    <SmoothArrowSvg className="panel-post-description-order-up"/>
                                    <SmoothArrowSvg className="panel-post-description-order-down"/>
                                    {
                                        item.type === "description" ?
                                            <div className="panel-post-description-desc">{item.content}</div>
                                            :
                                            item.type === "bold" ?
                                                <div className="panel-post-description-desc bold">{item.content}</div>
                                                :
                                                item.type === "picture" ?
                                                    <img className="panel-post-description-img-video" src={REST_URL + item.content} alt={post.title}/>
                                                    :
                                                    <video className="panel-post-description-img-video">
                                                        <source src={REST_URL + item.content}/>
                                                    </video>
                                    }
                                </div>,
                            )
                            :
                            <div className="panel-table-err-loading">بدون محتوا!</div>
                    }
                </div>
                <div className="panel-post-add-desc-menu">
                    <Material className="panel-post-add-desc-menu-item">+ توضیحات</Material>
                    <Material className="panel-post-add-desc-menu-item">+ متن بلد</Material>
                    <Material className="panel-post-add-desc-menu-item">+ عکس</Material>
                    <Material className="panel-post-add-desc-menu-item">+ ویدئو</Material>
                </div>
            </div>
        )
    }
}

export default ShowPost