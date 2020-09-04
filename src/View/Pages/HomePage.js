import React, {PureComponent} from "react"
import api, {REST_URL} from "../../Functions/api"
import MySlider from "../Components/MySlider"
import {Link} from "react-router-dom"
import Material from "../Components/Material"
import LikeSvg from "../../Media/Svgs/LikeSvg"
import {Helmet} from "react-helmet"
import {ClipLoader} from "react-spinners"

class HomePage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            mostViewPosts: [],
            mostViewPostsLoading: true,
            posts: [],
            postsLoading: true,
            predictPosts: [],
            predictPostsLoading: true,
            boldPosts: [],
            boldPostsLoading: true,
            selectedTab: "news",
        }
    }

    componentDidMount()
    {
        window.scroll({top: 0})

        api.get("post", `?limit=5&page=1`)
            .then(posts => this.setState({...this.state, postsLoading: false, posts}))

        api.get("most-viewed-post", `?limit=5&page=1`)
            .then(mostViewPosts => this.setState({...this.state, mostViewPostsLoading: false, mostViewPosts}))

        api.get("bold-post", `?limit=5&page=1`)
            .then(boldPosts => this.setState({...this.state, boldPostsLoading: false, boldPosts}))

        api.get("predict-post", `?limit=5&page=1`)
            .then(predictPosts => this.setState({...this.state, predictPostsLoading: false, predictPosts}))
    }

    selectCategory(id)
    {
        this.setState({...this.state, posts: [], postsLoading: true}, () =>
        {
            if (id) api.get("category-post", `?limit=5&page=1&category_id=${id}`).then(posts => this.setState({...this.state, selectedTab: id, postsLoading: false, posts}))
            else api.get("post", `?limit=5&page=1`).then(posts => this.setState({...this.state, selectedTab: "news", postsLoading: false, posts}))
        })
    }

    render()
    {
        const {
            boldPosts, predictPosts, posts, mostViewPosts, selectedTab,
            mostViewPostsLoading, postsLoading, predictPostsLoading, boldPostsLoading,
        } = this.state
        const {categories} = this.props
        const sliders = Object.values(categories).filter(item => !item.parent_id)
        return (
            <div className="home-page-cont">

                <Helmet>
                    <title>مجله آنالیز فوتبال</title>
                    <meta property="og:title" content="مجله آنالیز فوتبال"/>
                    <meta name="twitter:title" content="مجله آنالیز فوتبال"/>
                </Helmet>

                {
                    sliders.length > 0 &&
                    <MySlider dots={true}
                              nodes={
                                  sliders.map(item =>
                                      <a key={"slider" + item._id} href={item.address} className="home-page-slider-cont">
                                          <img className="home-page-slider-item" src={REST_URL + item.slider_picture} alt={item.title}/>
                                          <div className="home-page-slider-text">
                                              <div>
                                                  <div className="home-page-slider-text-title">{item.title}</div>
                                                  <div className="home-page-slider-text-desc">{item.description}</div>
                                              </div>
                                          </div>
                                      </a>,
                                  )
                              }
                    />
                }
                <div className="home-page-bolds">
                    <div className="home-page-bolds-title">پست‌های مهم</div>
                    <div className="home-page-bolds-items hide-scroll dont-gesture">
                        {
                            boldPosts.length > 0 ?
                                boldPosts.map(post =>
                                    <Link key={"bold" + post._id} className="home-page-bolds-link" to={`/post/${post.title}`}>
                                        <Material className="home-page-bolds-cont">
                                            <img className="home-page-bolds-img" src={REST_URL + post.picture} alt={post.title}/>
                                            <div className="home-page-bolds-text">{post.title}</div>
                                        </Material>
                                    </Link>,
                                )
                                :
                                boldPostsLoading && <div className="loading-cont"><ClipLoader color="var(--primary-color)" size={20}/></div>
                        }
                    </div>
                </div>

                <div className="home-page-main">
                    <div className="home-page-main-col">
                        <div className="home-page-main-title">
                            <div className="home-page-main-title-text">آخرین مطالب</div>
                            <div className="home-page-main-title-tabs dont-gesture hide-scroll">
                                <Material className={`home-page-main-title-item ${selectedTab === "news" ? "selected" : ""}`} onClick={() => this.selectCategory()}>تازه‌ها</Material>
                                {
                                    sliders.map(item =>
                                        <Material className={`home-page-main-title-item ${selectedTab === item._id ? "selected" : ""}`} key={"tab" + item._id} onClick={() => this.selectCategory(item._id)}>{item.title}</Material>,
                                    )
                                }
                            </div>
                        </div>
                        <div className="home-page-main-posts">
                            {
                                posts.length > 0 ?
                                    posts.map(post =>
                                        <Link key={"new" + post._id} className="post-item-cont-link full-wide" to={`/post/${post.title}`}>
                                            <Material className="post-item-cont">
                                                <div className="post-item-cont-title">{post.title}</div>
                                                <img className="post-item-cont-pic" src={REST_URL + post.picture} alt={post.title}/>
                                                <div className="post-item-cont-text">
                                                    <div className="post-item-cont-text-desc">{post.short_description}</div>
                                                    <div className="post-item-cont-text-detail">
                                                        <LikeSvg className="post-item-cont-text-detail-like"/>
                                                        <div className="post-item-cont-text-detail-like-count">{post.likes_count || "0"}</div>
                                                    </div>
                                                </div>
                                            </Material>
                                        </Link>,
                                    )
                                    :
                                    postsLoading ?
                                        <div className="loading-cont"><ClipLoader color="var(--primary-color)" size={20}/></div>
                                        :
                                        <div className="loading-cont">پستی یافت نشد!</div>
                            }
                        </div>
                    </div>

                    <div className="home-page-side-col">
                        <section className="home-page-side-col-section">
                            <div className="home-page-main-title">
                                <div className="home-page-main-title-text side">پیشبینی‌ها</div>
                            </div>
                            {
                                predictPosts.length > 0 ?
                                    predictPosts.map(post =>
                                        <Link key={"predict" + post._id} className="home-page-side-post" to={`/post/${post.title}`}>
                                            <div className="home-page-side-post-title">{post.title}</div>
                                            <div className="home-page-side-post-desc">{post.short_description}</div>
                                        </Link>,
                                    )
                                    :
                                    predictPostsLoading ?
                                        <div className="loading-cont"><ClipLoader color="var(--primary-color)" size={20}/></div>
                                        :
                                        <div className="loading-cont">هنوز پستی نیست!</div>
                            }
                        </section>

                        <section className="home-page-side-col-section second">
                            <div className="home-page-main-title">
                                <div className="home-page-main-title-text side">پربازدیدترین‌ها</div>
                            </div>
                            {
                                mostViewPosts.length > 0 ?
                                    mostViewPosts.map(post =>
                                        <Link key={"high" + post._id} className="home-page-side-post" to={`/post/${post.title}`}>
                                            <div className="home-page-side-post-title">{post.title}</div>
                                            <div className="home-page-side-post-desc">{post.short_description}</div>
                                        </Link>,
                                    )
                                    :
                                    mostViewPostsLoading && <div className="loading-cont"><ClipLoader color="var(--primary-color)" size={20}/></div>
                            }
                        </section>
                    </div>
                </div>

            </div>
        )
    }
}

export default HomePage