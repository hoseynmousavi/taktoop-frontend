import React, {PureComponent} from "react"
import api from "../../Functions/api"
import {ClipLoader} from "react-spinners"
import PostDescription from "../Panel/PostDescription"

class PostPage extends PureComponent
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
            <div className="post-page-cont">
                <div className="panel-table-title">{post.title}</div>
                {
                    Object.values(post.post_descriptions).length > 0 ?
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
                        :
                        <div className="panel-table-err-loading">بدون محتوا!</div>
                }
            </div>
        )
    }
}

export default PostPage