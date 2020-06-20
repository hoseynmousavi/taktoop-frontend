import React, {PureComponent} from "react"
import api, {REST_URL} from "../../Functions/api"
import MySlider from "../Components/MySlider"
import {Link} from "react-router-dom"
import Material from "../Components/Material"
import LikeSvg from "../../Media/Svgs/LikeSvg"

class HomePage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            boldPosts: [],
            boldPostsLoading: true,
        }
    }

    componentDidMount()
    {
        window.scroll({top: 0})

        api.get("post", `?limit=5&page=1`) // get bolds
            .then(boldPosts => this.setState({...this.state, boldPostsLoading: false, boldPosts}))
    }

    render()
    {
        const {boldPostsLoading, boldPosts} = this.state
        const {categories} = this.props
        const sliders = Object.values(categories).filter(item => !item.parent_id)
        return (
            <div className="home-page-cont">
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
                            boldPosts.map(post =>
                                <Link key={"bold" + post._id} className="home-page-bolds-link" to={`/post/${post._id}`}>
                                    <Material className="home-page-bolds-cont">
                                        <img className="home-page-bolds-img" src={REST_URL + post.picture} alt={post.title}/>
                                        <div className="home-page-bolds-text">{post.title}</div>
                                    </Material>
                                </Link>,
                            )
                        }
                    </div>
                </div>

                <div className="home-page-main">
                    <div className="home-page-main-col">
                        <div className="home-page-main-title">
                            <div className="home-page-main-title-text">آخرین مطالب</div>
                            <div className="home-page-main-title-tabs">
                                <Material className="home-page-main-title-item selected">تازه‌ها</Material>
                                {
                                    sliders.map(item =>
                                        <Material className="home-page-main-title-item" key={"tab" + item._id}>{item.title}</Material>,
                                    )
                                }
                            </div>
                        </div>
                        <div className="home-page-main-posts">
                            {
                                boldPosts.map(post =>
                                    <Link key={"new" + post._id} className="post-item-cont-link full-wide" to={`/post/${post._id}`}>
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
                    </div>

                    <div className="home-page-side-col">
                        <section className="home-page-side-col-section">
                            <div className="home-page-main-title">
                                <div className="home-page-main-title-text side">پیشبینی‌ها</div>
                            </div>
                            {
                                boldPosts.map(post =>
                                    <Link key={"predict" + post._id} className="home-page-side-post" to={`/post/${post._id}`}>
                                        <div className="home-page-side-post-title">{post.title}</div>
                                        <div className="home-page-side-post-desc">{post.short_description}</div>
                                    </Link>,
                                )
                            }
                        </section>

                        <section className="home-page-side-col-section second">
                            <div className="home-page-main-title">
                                <div className="home-page-main-title-text side">پربازدیدترین‌ها</div>
                            </div>
                            {
                                boldPosts.map(post =>
                                    <Link key={"high" + post._id} className="home-page-side-post" to={`/post/${post._id}`}>
                                        <div className="home-page-side-post-title">{post.title}</div>
                                        <div className="home-page-side-post-desc">{post.short_description}</div>
                                    </Link>,
                                )
                            }
                        </section>
                    </div>
                </div>

            </div>
        )
    }
}

export default HomePage