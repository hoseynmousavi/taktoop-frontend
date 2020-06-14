import React, {PureComponent} from "react"
import api, {REST_URL} from "../../Functions/api"
import {ClipLoader} from "react-spinners"
import Material from "../Components/Material"
import {Link} from "react-router-dom"
import LikeSvg from "../../Media/Svgs/LikeSvg"

class CategoryPage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            posts: [],
            isLoading: true,
        }
        this.getData = false
        this.activeScrollHeight = 0
        this.page = 2
    }

    componentDidMount()
    {
        window.scroll({top: 0})

        if (this.props.category) this.getPosts()
        else this.getData = true

        document.addEventListener("scroll", this.onScroll)
    }

    componentWillUnmount()
    {
        document.removeEventListener("scroll", this.onScroll)
    }

    componentDidUpdate(prevProps, prevState, snapshot)
    {
        if (this.getData && this.props.category) this.getPosts()
    }

    onScroll = () =>
    {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() =>
        {
            const {posts} = this.state
            const scrollHeight = document.body ? document.body.scrollHeight : 0
            if (posts.length > 0 && window.innerHeight + window.scrollY >= scrollHeight - 200 && scrollHeight > this.activeScrollHeight)
            {
                this.setState({...this.state, isLoading: true}, () =>
                {
                    this.activeScrollHeight = scrollHeight
                    api.get("post", `?limit=10&page=${this.page}`).then((data) =>
                    {
                        this.page += 1
                        this.setState({...this.state, isLoading: false, posts: [...posts, ...data]})
                    })
                })
            }
        }, 20)
    }

    getPosts()
    {
        const {category} = this.props
        api.get("post", `?category_id=${category._id}&limit=10&page=1`)
            .then(posts => this.setState({...this.state, posts, isLoading: false}))
    }

    render()
    {
        const {category, parent} = this.props
        const {posts, isLoading} = this.state
        return (
            <div className="category-page-cont">
                {
                    category ?
                        <React.Fragment>
                            <a href={parent.address} className="home-page-slider-cont">
                                <img className="home-page-slider-item" src={REST_URL + parent.slider_picture} alt={parent.title}/>
                                <div className="home-page-slider-text">
                                    <div>
                                        <div className="home-page-slider-text-title">{category.title}</div>
                                        <div className="home-page-slider-text-desc">{category.description}</div>
                                    </div>
                                </div>
                            </a>
                            {
                                posts.length > 0 ?
                                    <div className="post-items-container">
                                        {
                                            posts.map(post =>
                                                <Link key={post._id} className="post-item-cont-link" to={`/post/${post._id}`}>
                                                    <Material className="post-item-cont">
                                                        <div className="post-item-cont-title">{post.title}</div>
                                                        <img className="post-item-cont-pic" src={REST_URL + post.picture} alt={post.title}/>
                                                        <div className="post-item-cont-text">
                                                            <div className="post-item-cont-text-desc">{post.short_description}</div>
                                                            <div className="post-item-cont-text-detail">
                                                                <LikeSvg className="post-item-cont-text-detail-like"/>
                                                                <div className="post-item-cont-text-detail-like-count">{post.likes_cout || "0"}</div>
                                                            </div>
                                                        </div>
                                                    </Material>
                                                </Link>,
                                            )
                                        }
                                    </div>
                                    :
                                    !isLoading && <div className="loading-cont">پستی یافت نشد!</div>
                            }
                            <div className="loading-cont">{isLoading && <ClipLoader color="var(--primary-color)" size={20}/>}</div>
                        </React.Fragment>
                        :
                        <div className="loading-cont"><ClipLoader color="var(--primary-color)" size={20}/></div>
                }
            </div>
        )
    }
}

export default CategoryPage