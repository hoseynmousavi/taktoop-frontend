import React, {PureComponent} from "react"
import {Switch, Route} from "react-router-dom"
import {ClipLoader} from "react-spinners"
import Material from "../Components/Material"
import CreatePostModal from "./CreatePostModal"
import api, {REST_URL} from "../../Functions/api"
import {Link} from "react-router-dom"
import ShowPost from "./ShowPost"
import GarbageSvg from "../../Media/Svgs/GarbageSvg"
import PencilSvg from "../../Media/Svgs/Pencil"
import {NotificationManager} from "react-notifications"

class Posts extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            categories: {},
            posts: {},
            isLoading: true,
        }
        this.activeScrollHeight = 0
        this.page = 2
    }

    toggleCreateModal = () => this.setState({...this.state, openModal: !this.state.openModal, post: undefined})

    componentDidMount()
    {
        api.get("post", `?limit=10&page=1`)
            .then(posts => this.setState({...this.state, isLoading: false, posts: posts.reduce((sum, post) => ({...sum, [post._id]: post}), {})}))

        api.get("category")
            .then(categories => this.setState({...this.state, categories: categories.reduce((sum, cat) => ({...sum, [cat._id]: cat}), {})}))

        document.addEventListener("scroll", this.onScroll)
    }

    componentWillUnmount()
    {
        document.removeEventListener("scroll", this.onScroll)
    }

    onScroll = () =>
    {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() =>
        {
            const {posts} = this.state
            const scrollHeight = document.body ? document.body.scrollHeight : 0
            if (Object.values(posts).length > 0 && window.innerHeight + window.scrollY >= scrollHeight - 200 && scrollHeight > this.activeScrollHeight)
            {
                this.setState({...this.state, isLoading: true}, () =>
                {
                    this.activeScrollHeight = scrollHeight
                    api.get("post", `?limit=10&page=${this.page}`).then((data) =>
                    {
                        this.page += 1
                        this.setState({...this.state, isLoading: false, posts: {...posts, ...data.reduce((sum, post) => ({...sum, [post._id]: {...post}}), {})}})
                    })
                })
            }
        }, 20)
    }

    addOrUpdatePost = post =>
    {
        const {posts} = this.state
        if (posts[post._id]) this.setState({...this.state, posts: {...posts, [post._id]: {...post}}})
        else this.setState({...this.state, posts: {[post._id]: {...post}, ...posts}})
    }

    deletePost(e, _id)
    {
        e.preventDefault()
        const confirm = window.confirm("از حذف مطمئنید؟")
        if (confirm)
        {
            document.getElementById("post" + _id).style.opacity = "0.5"
            document.getElementById("post" + _id).style.cursor = "not-allowed"
            document.getElementById("post" + _id).onclick = e => e.preventDefault()
            api.del("post", {_id})
                .then(() =>
                {
                    const posts = {...this.state.posts}
                    delete posts[_id]
                    this.setState({...this.state, posts})
                })
                .catch(() =>
                {
                    document.getElementById("post" + _id).style.opacity = "1"
                    document.getElementById("post" + _id).style.cursor = "auto"
                    document.getElementById("post" + _id).onclick = () => null
                    NotificationManager.error("مشکلی پیش آمد! کانکشن خود را چک کنید!")
                })
        }
    }

    editPost(e, _id)
    {
        e.preventDefault()
        this.setState({...this.state, post: this.state.posts[_id], openModal: true})
    }

    render()
    {
        const {error, isLoading, openModal, categories, posts, post} = this.state
        return (
            <div className="panel-categories-cont">
                <Switch>
                    <Route path="/panel/posts/:title" render={route => <ShowPost title={route.match.params.title}/>}/>

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
                                    <div className="panel-posts-cont">
                                        {
                                            Object.values(posts).map(post =>
                                                <Link to={`/panel/posts/${post.title}`} className="panel-posts-item" key={post._id} id={"post" + post._id}>
                                                    <Material className="panel-post-description-delete post-page" onClick={e => this.deletePost(e, post._id)}><GarbageSvg/></Material>
                                                    <Material className="panel-post-description-edit post-page" onClick={e => this.editPost(e, post._id)}><PencilSvg/></Material>
                                                    <img className="panel-posts-item-img" src={REST_URL + post.picture} alt={post.title}/>
                                                    <div className="panel-posts-item-title">{post.title}</div>
                                                    <div className="panel-posts-item-cat">{categories[post.category_id]?.title}</div>
                                                    <div className="panel-posts-item-desc">{post.short_description}</div>
                                                    {post.is_bold && <div className="panel-posts-item-bold">پست بولد</div>}
                                                    {post.is_predict && <div className="panel-posts-item-bold">پست پیشبینی: {new Date(post.is_predict).toLocaleString("fa-ir")}</div>}
                                                </Link>,
                                            )
                                        }
                                    </div>
                        }

                        {isLoading && <div className="panel-table-err-loading"><ClipLoader size={19} color="var(--primary-color)"/></div>}

                        <Material className="panel-add-item" backgroundColor="rgba(255,255,255,0.3)" onClick={this.toggleCreateModal}>+</Material>

                        {openModal && <CreatePostModal update={post} addOrUpdatePost={this.addOrUpdatePost} toggleCreateModal={this.toggleCreateModal} categories={categories}/>}

                    </React.Fragment>
                </Switch>
            </div>
        )
    }
}

export default Posts