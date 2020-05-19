import React, {PureComponent} from "react"
import {Switch} from "react-router-dom"
import {ClipLoader} from "react-spinners"
import Material from "../Components/Material"
import CreatePostModal from "./CreatePostModal"
import api from "../../Functions/api"

class Posts extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            categories: {},
            posts: {},
        }
    }

    toggleCreateModal = () => this.setState({...this.state, openModal: !this.state.openModal})

    componentDidMount()
    {
        api.get("post")
            .then(posts => this.setState({...this.state, posts: posts.reduce((sum, post) => ({...sum, [post._id]: post}), {})}))

        api.get("category")
            .then(categories => this.setState({...this.state, categories: categories.reduce((sum, cat) => ({...sum, [cat._id]: cat}), {})}))
    }

    addOrUpdatePost = post =>
    {
        const {posts} = this.state
        if (posts[post._id]) this.setState({...this.state, posts: {...posts, [post._id]: {...post}}})
        else this.setState({...this.state, posts: {[post._id]: {...post}, ...posts}})
    }

    render()
    {
        const {error, isLoading, openModal, categories, posts} = this.state
        return (
            <div className="panel-categories-cont">
                <Switch>
                    <React.Fragment>
                        <div className="panel-table-title">
                            پست‌ها
                        </div>
                        {
                            error ?
                                <div className="panel-table-err-loading">مشکلی پیش آمد! کانکشن خود را بررسی کنید!</div>
                                :
                                Object.values(posts).length === 0 && !isLoading ? <div className="panel-table-err-loading">پستی یافت نشد!</div>
                                    :
                                    <div>
                                        {
                                            Object.values(posts).map(post =>
                                                <div key={post._id}>{post.title}</div>,
                                            )
                                        }
                                    </div>
                        }

                        {isLoading && <div className="panel-table-err-loading"><ClipLoader size={19} color="var(--primary-color)"/></div>}

                        <Material className="panel-add-item" backgroundColor="rgba(255,255,255,0.3)" onClick={this.toggleCreateModal}>+</Material>

                        {openModal && <CreatePostModal addOrUpdatePost={this.addOrUpdatePost} toggleCreateModal={this.toggleCreateModal} categories={categories}/>}

                    </React.Fragment>
                </Switch>
            </div>
        )
    }
}

export default Posts