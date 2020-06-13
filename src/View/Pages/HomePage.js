import React, {PureComponent} from "react"
import {REST_URL} from "../../Functions/api"
import MySlider from "../Components/MySlider"

class HomePage extends PureComponent
{

    componentDidMount()
    {
        window.scroll({top: 0})
    }

    render()
    {
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
            </div>
        )
    }
}

export default HomePage