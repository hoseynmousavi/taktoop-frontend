import React, {PureComponent} from "react"
import SmoothArrowSvg from "../../Media/Svgs/SmoothArrowSvg"
import Material from "./Material"
import {Link} from "react-router-dom"

class MobileCategory extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {}
    }

    toggleMenu = () =>
    {
        const openMenu = !this.state.openMenu
        this.setState({...this.state, openMenu}, () =>
        {
            if (openMenu)
            {
                this.childs.style.height = this.childs.scrollHeight + "px"
                this.childs.style.transform = "translateX(0)"
            }
            else
            {
                this.childs.style.height = "0"
                this.childs.style.transform = "translateX(100%)"
            }
        })
    }

    hideSide = () =>
    {
        this.toggleMenu()
        this.props.hideSidebar()
    }

    render()
    {
        const {cat, childs} = this.props
        const {openMenu} = this.state
        return (
            <React.Fragment>
                <Material className="header-sidebar-btn category" onClick={this.toggleMenu}>
                    {cat.title}
                    <SmoothArrowSvg className={`header-sidebar-btn-arrow ${openMenu ? "open" : ""}`}/>
                </Material>
                <div ref={e => this.childs = e} style={{height: "0", transform: "translateX(100%)"}} className="header-mobile-category-cont">
                    {
                        childs.map(item =>
                            <Link key={"cat-child" + item._id} to={`/category/${item._id}`} onClick={this.hideSide}>
                                <Material className="header-sidebar-btn category-child">
                                    {item.title}
                                </Material>
                            </Link>,
                        )
                    }
                </div>
            </React.Fragment>
        )
    }
}

export default MobileCategory