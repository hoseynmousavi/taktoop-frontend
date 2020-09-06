import React, {PureComponent} from "react"
import api from "../../Functions/api"
import {ClipLoader} from "react-spinners"
import Material from "../Components/Material"
import PostDescription from "./PostDescription"
import {NotificationManager} from "react-notifications"
import AddDescription from "./AddDescription"
import compressImage from "../../Helpers/compressImage"
import EyeSvg from "../../Media/Svgs/EyeSvg"
import DateSvg from "../../Media/Svgs/DateSvg"

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
            .then(post => this.setState({...this.state, post: {...post, post_descriptions: post.post_descriptions.reduce((sum, desc) => ({...sum, [desc._id]: desc}), {})}, isLoading: false}))
            .catch(() => this.setState({...this.state, isLoading: false, err: true}))
    }

    updatePostDescription = fields =>
    {
        api.patch("post-description", fields)
            .then(updated =>
            {
                const post = {...this.state.post}
                post.post_descriptions[updated._id] = {...updated}
                this.setState({...this.state, post})
            })
            .catch(() => NotificationManager.error("مشکلی پیش آمد! کانکشن خود را بررسی کنید!"))
    }

    addPostDescription = newDesc =>
    {
        const post = {...this.state.post}
        post.post_descriptions[newDesc._id] = {...newDesc}
        this.setState({...this.state, post})
    }

    toggleAddDescription = () => this.setState({...this.state, addDescription: !this.state.addDescription, update: undefined})

    toggleAddBoldDescription = () => this.setState({...this.state, addBoldDescription: !this.state.addBoldDescription, update: undefined})

    toggleUpdateImgVideo = (e, desc) =>
    {
        const file = e.target.files[0]
        e.target.value = ""
        this.setState({...this.state, sendLoading: true}, () =>
        {
            let form = new FormData()
            compressImage(file).then(file =>
            {
                form.append("_id", desc._id)
                form.append("type", desc.type)
                form.append("content", file)
                api.patch("post-description", form, "", e => this.setState({...this.state, loadingPercent: Math.floor((e.loaded * 100) / e.total)}))
                    .then(updated =>
                    {
                        console.log(updated)
                        const post = {...this.state.post}
                        post.post_descriptions[updated._id] = {...updated}
                        this.setState({...this.state, post, sendLoading: undefined, loadingPercent: undefined})
                    })
                    .catch(() => NotificationManager.error("مشکلی پیش آمد! کانکشن خود را بررسی کنید!"))
            })
        })
    }

    toggleUpdateDescription = update => this.setState({...this.state, addDescription: !this.state.addDescription, update})

    toggleUpdateBoldDescription = update => this.setState({...this.state, addBoldDescription: !this.state.addDescription, update})

    deleteDesc = item =>
    {
        const confirm = window.confirm("مطمئنید؟")
        if (confirm)
        {
            api.del("post-description", {_id: item._id})
                .then(() =>
                {
                    const post = {...this.state.post}
                    delete post.post_descriptions[item._id]
                    this.setState({...this.state, post})
                })
        }
    }

    selectPicture = e =>
    {
        const file = e.target.files[0]
        e.target.value = ""
        this.setState({...this.state, sendLoading: true}, () =>
        {
            const {post} = this.state
            let form = new FormData()
            compressImage(file).then(file =>
            {
                form.append("content", file)
                form.append("type", "picture")
                form.append("post_id", post._id)
                form.append("order", (Object.values(post.post_descriptions).length + 1).toString())
                api.post("post-description", form, "", e => this.setState({...this.state, loadingPercent: Math.floor((e.loaded * 100) / e.total)}))
                    .then(newDesc =>
                    {
                        const post = {...this.state.post}
                        post.post_descriptions[newDesc._id] = {...newDesc}
                        this.setState({...this.state, post, sendLoading: undefined, loadingPercent: undefined})
                    })
                    .catch(() => NotificationManager.error("مشکلی پیش آمد! کانکشن خود را بررسی کنید!"))
            })
        })
    }

    selectVideo = e =>
    {
        const file = e.target.files[0]
        e.target.value = ""
        this.setState({...this.state, sendLoading: true}, () =>
        {
            const {post} = this.state
            let form = new FormData()
            form.append("content", file)
            form.append("type", "video")
            form.append("post_id", post._id)
            form.append("order", (Object.values(post.post_descriptions).length + 1).toString())
            api.post("post-description", form, "", e => this.setState({...this.state, loadingPercent: Math.floor((e.loaded * 100) / e.total)}))
                .then(newDesc =>
                {
                    const post = {...this.state.post}
                    post.post_descriptions[newDesc._id] = {...newDesc}
                    this.setState({...this.state, post, sendLoading: undefined, loadingPercent: undefined})
                })
        })
    }

    render()
    {
        const {err, isLoading, post, addDescription, addBoldDescription, update, loadingPercent, sendLoading} = this.state
        if (err) return <div className="panel-table-err-loading">مشکلی پیش آمد! کانکشن خود را بررسی کنید!</div>
        else if (isLoading) return <div className="panel-table-err-loading"><ClipLoader size={19} color="var(--primary-color)"/></div>
        return (
            <React.Fragment>
                {
                    sendLoading &&
                    <div className="sign-up-page-loading-cont override">
                        <div className="panel-upload-percent">{loadingPercent} %</div>
                    </div>
                }
                <div>
                    <div className="panel-table-title with-detail">
                        <div className="panel-table-title-text">{post.title}</div>
                        <div className="panel-table-title-detail">
                            <div className="display-inline">
                                <div className="post-item-cont-text-detail-like-count black">{post.views_count || "1"}</div>
                                <EyeSvg className="post-item-cont-text-detail-like eye-black"/>
                            </div>
                            <div className="display-inline">
                                <div className="post-item-cont-text-detail-like-count date black">
                                    {new Date(post.created_date).toLocaleTimeString("fa-ir").slice(0, 5)}
                                    <span> - </span>
                                    {new Date(post.created_date).toLocaleDateString("fa-ir")}
                                </div>
                                <DateSvg className="post-item-cont-text-detail-like black"/>
                            </div>
                        </div>
                    </div>
                    <div className="panel-post-description-cont">
                        {
                            Object.values(post.post_descriptions).length > 0 ?
                                Object.values(post.post_descriptions).sort((a, b) => a.order - b.order).map(item =>
                                    <PostDescription key={item._id}
                                                     toggleUpdateBoldDescription={this.toggleUpdateBoldDescription}
                                                     toggleUpdateDescription={this.toggleUpdateDescription}
                                                     length={Object.values(post.post_descriptions).length}
                                                     item={item}
                                                     updatePostDescription={this.updatePostDescription}
                                                     deleteDesc={this.deleteDesc}
                                                     toggleUpdateImgVideo={this.toggleUpdateImgVideo}
                                    />,
                                )
                                :
                                <div className="panel-table-err-loading">بدون محتوا!</div>
                        }
                    </div>
                    <div className="panel-post-add-desc-menu">
                        <Material className="panel-post-add-desc-menu-item" onClick={this.toggleAddDescription}>+ توضیحات</Material>
                        <Material className="panel-post-add-desc-menu-item" onClick={this.toggleAddBoldDescription}>+ متن بلد</Material>
                        <label>
                            <Material className="panel-post-add-desc-menu-item">+ عکس</Material>
                            <input hidden type="file" accept="image/*" onChange={this.selectPicture}/>
                        </label>
                        <label>
                            <Material className="panel-post-add-desc-menu-item">+ ویدئو</Material>
                            <input hidden type="file" accept="video/*" onChange={this.selectVideo}/>
                        </label>
                    </div>


                    {
                        addDescription &&
                        <AddDescription update={update}
                                        post_id={post._id}
                                        order={Object.values(post.post_descriptions).length + 1}
                                        toggleAddDescription={this.toggleAddDescription}
                                        addPostDescription={this.addPostDescription}
                        />
                    }

                    {
                        addBoldDescription &&
                        <AddDescription update={update}
                                        isBold={true}
                                        post_id={post._id}
                                        order={Object.values(post.post_descriptions).length + 1}
                                        toggleAddDescription={this.toggleAddBoldDescription}
                                        addPostDescription={this.addPostDescription}
                        />
                    }

                </div>
            </React.Fragment>
        )
    }
}

export default ShowPost