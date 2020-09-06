import React, {PureComponent} from "react"
import api from "../../Functions/api"
import {ClipLoader} from "react-spinners"
import PostDescription from "../Panel/PostDescription"
import {Helmet} from "react-helmet"
import Material from "../Components/Material"
import LikeSvg from "../../Media/Svgs/LikeSvg"
import EyeSvg from "../../Media/Svgs/EyeSvg"
import DateSvg from "../../Media/Svgs/DateSvg"

class PostPage extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
        }
    }

    componentDidMount() {
        const {title} = this.props
        api.get("post", `?title=${title}`)
            .then(post => this.setState({...this.state, post, isLoading: false}))
            .catch(() => this.setState({...this.state, isLoading: false, err: true}))
    }

    toggleLike = () => {
        const {post} = this.state
        if (!post.is_liked) {
            api.post("post-like", {post_id: post._id})
                .then(() => this.setState({...this.state, post: {...this.state.post, is_liked: true, likes_count: this.state.post.likes_count + 1}}))
        }
        else {
            api.del("post-like", {post_id: post._id})
                .then(() => this.setState({...this.state, post: {...this.state.post, is_liked: false, likes_count: this.state.post.likes_count - 1}}))
        }
    }

    render() {
        const {user} = this.props
        const {err, isLoading, post} = this.state
        if (err) return <div className="panel-table-err-loading">مشکلی پیش آمد! کانکشن خود را بررسی کنید!</div>
        else if (isLoading) return <div className="panel-table-err-loading"><ClipLoader size={19} color="var(--primary-color)"/></div>
        return (
            <div className="post-page-cont">

                <Helmet>
                    <title>مجله آنالیز فوتبال | {post.title}</title>
                    <meta property="og:title" content={`مجله آنالیز فوتبال | ${post.title}`}/>
                    <meta name="twitter:title" content={`مجله آنالیز فوتبال | ${post.title}`}/>
                    {post.keywords && <meta name="keywords" content={`${post.keywords}`}/>}
                </Helmet>

                <div className="panel-table-title regular with-detail">
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

                {
                    Object.values(post.post_descriptions).length > 0 ?
                        <div className="post-page-content">
                            {
                                Object.values(post.post_descriptions).sort((a, b) => a.order - b.order).map(item =>
                                    <PostDescription key={item._id}
                                                     regularView={true}
                                                     toggleUpdateBoldDescription={this.toggleUpdateBoldDescription}
                                                     toggleUpdateDescription={this.toggleUpdateDescription}
                                                     length={Object.values(post.post_descriptions).length}
                                                     item={item}
                                                     updatePostDescription={this.updatePostDescription}
                                                     deleteDesc={this.deleteDesc}
                                                     toggleUpdateImgVideo={this.toggleUpdateImgVideo}
                                    />,
                                )
                            }
                        </div>
                        :
                        <div className="panel-table-err-loading">بدون محتوا!</div>
                }

                {
                    user &&
                    <Material className="panel-add-item like" backgroundColor="rgba(255,255,255,0.3)" onClick={this.toggleLike}>
                        <div className={`post-like-count ${post.is_liked ? "liked" : ""}`}>{post.likes_count}</div>
                        <LikeSvg className={`post-like-btn ${post.is_liked ? "liked" : ""}`}/>
                    </Material>
                }

            </div>
        )
    }
}

export default PostPage