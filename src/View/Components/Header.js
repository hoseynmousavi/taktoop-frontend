import React, {PureComponent} from "react"
import Material from "./Material"
import {Link, NavLink} from "react-router-dom"
import Hamburger from "./Hamburger"
import Logo from "../../Media/Images/Logo.png"
import {REST_URL} from "../../Functions/api"
import SmoothArrowSvg from "../../Media/Svgs/SmoothArrowSvg"
import MobileCategory from "./MobileCategory"

class Header extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            collapseSidebar: true,
        }
        this.deltaX = 0
        this.posX = 0
        this.posY = 0
        this.prevX = null
        this.changing = false
        this.started = false
        this.deltaY = 0
        this.onTouchStart = this.onTouchStart.bind(this)
        this.onTouchMove = this.onTouchMove.bind(this)
        this.onTouchEnd = this.onTouchEnd.bind(this)
    }

    componentDidMount()
    {
        document.addEventListener("touchstart", this.onTouchStart)
        document.addEventListener("touchmove", this.onTouchMove)
        document.addEventListener("touchend", this.onTouchEnd)
    }

    componentWillUnmount()
    {
        document.removeEventListener("touchstart", this.onTouchStart)
        document.removeEventListener("touchmove", this.onTouchMove)
        document.removeEventListener("touchend", this.onTouchEnd)
    }

    checkParentClass(element, classname)
    {
        if (element.className && element.className.toString().split(" ").indexOf(classname) >= 0) return true
        return element.parentNode && this.checkParentClass(element.parentNode, classname)
    }

    onTouchStart(e)
    {
        if (!this.checkParentClass(e.target, "dont-gesture"))
        {
            this.prevX = !this.state.collapseSidebar ? 0 : this.sidebar ? this.sidebar.clientWidth : 0
            this.posX = e.touches[0].clientX
            this.posY = e.touches[0].clientY
            this.started = true
        }
    }

    onTouchMove(e)
    {
        this.deltaY = this.posY - e.touches[0].clientY
        this.deltaX = this.posX - e.touches[0].clientX
        if (this.changing || (this.started && this.deltaY < 5 && this.deltaY > -5 && (this.deltaX > 5 || this.deltaX < -5)))
        {
            this.posX = e.touches[0].clientX
            this.prevX = this.prevX - this.deltaX >= 0 ? this.prevX - this.deltaX <= this.sidebar.clientWidth ? this.prevX - this.deltaX : this.sidebar.clientWidth : 0
            this.sidebar.style.transform = `translateX(${this.prevX}px)`
            this.sidebarBack.style.opacity = `${1 - (this.prevX / this.sidebar.clientWidth)}`
            this.sidebarBack.style.height = `100vh`
            if (this.started)
            {
                document.body.style.overflow = "hidden"
                this.changing = true
            }
            this.started = false
        }
        else this.started = false
    }

    onTouchEnd()
    {
        if (this.changing)
        {
            if (!(this.deltaX > 3) && (this.deltaX < -3 || this.prevX >= this.sidebar.clientWidth / 2))
            {
                this.prevX = this.sidebar.clientWidth
                this.hideSidebar()
            }
            else
            {
                this.prevX = 0
                this.showSidebar()
            }
            this.changing = false
        }
    }

    showSidebar = () =>
    {
        this.setState({...this.state, collapseSidebar: false})
        this.sidebar.style.transition = "transform linear 0.2s"
        this.sidebar.style.transform = `translateX(0px)`
        this.sidebarBack.style.transition = "opacity linear 0.3s, height linear 0s 0s"
        this.sidebarBack.style.opacity = `1`
        this.sidebarBack.style.height = `100vh`
        document.body.style.overflow = "hidden"
        setTimeout(() =>
        {
            if (this.sidebar) this.sidebar.style.transition = "initial"
            if (this.sidebarBack) this.sidebarBack.style.transition = "initial"
        }, 250)
    }

    hideSidebar = () =>
    {
        this.setState({...this.state, collapseSidebar: true})
        this.sidebar.style.transition = "transform linear 0.1s"
        this.sidebar.style.transform = `translateX(100%)`
        this.sidebarBack.style.transition = "opacity linear 0.3s, height linear 0s 0.4s"
        this.sidebarBack.style.opacity = `0`
        this.sidebarBack.style.height = `0`
        document.body.style.overflow = "auto"
        setTimeout(() =>
        {
            if (this.sidebar) this.sidebar.style.transition = "initial"
            if (this.sidebarBack) this.sidebarBack.style.transition = "initial"
        }, 250)
    }

    toggleLoginModal = () =>
    {
        this.hideSidebar()
        this.props.toggleLoginModal()
    }

    logout = () =>
    {
        this.hideSidebar()
        this.props.logout()
    }

    showDialog = (cat, id) =>
    {
        const rect = document.getElementById(id)?.getBoundingClientRect()
        const width = this.dialog.scrollWidth
        const left = rect.left + rect.width - width > 0 ? rect.left + rect.width + "px" : width + 10 + "px"
        const {showDialog} = this.state
        if (showDialog) this.setState({...this.state, showCat: cat, left})
        else this.openTimer = setTimeout(() => this.setState({...this.state, showDialog: true, showCat: cat, left}), 150)
    }

    closeDialog = () =>
    {
        clearTimeout(this.openTimer)
        this.setState({...this.state, showDialog: false})
    }

    render()
    {
        const {collapseSidebar, showCat, showDialog, left} = this.state
        const {user, toggleLoginModal, categories, logout} = this.props
        return (
            <div className="header-cont">
                <div className="header-cont-main">
                    <Material backgroundColor={!collapseSidebar ? "transparent" : "rgba(0,0,0,0.1)"} className={`header-hamburger-mobile-material ${!collapseSidebar ? "toggle" : ""}`}>
                        <Hamburger className="header-hamburger-mobile" collapse={collapseSidebar} onClick={collapseSidebar ? this.showSidebar : this.hideSidebar}/>
                    </Material>

                    <Link className="show-mobile" to="/"><h1 className="header-name">تک توپ</h1></Link>

                    <div className="header-sidebar-back" style={{opacity: "0", height: "0"}} ref={e => this.sidebarBack = e} onClick={this.hideSidebar}/>
                    <div className="header-sidebar-container" style={{transform: "translateX(100%)"}} ref={e => this.sidebar = e}>
                        <Link to="/" className="header-sidebar-link" onClick={this.hideSidebar}><Material className="header-sidebar-btn margin-top">خانه</Material></Link>
                        {
                            !user &&
                            <React.Fragment>
                                <NavLink to="/sign-up" activeClassName="active" className="header-sidebar-link" onClick={this.hideSidebar}><Material className="header-sidebar-btn">ثبت نام</Material></NavLink>
                                <Material className="header-sidebar-btn" onClick={this.toggleLoginModal}>ورود</Material>
                            </React.Fragment>
                        }
                        <NavLink to="/about-us" activeClassName="active" className="header-sidebar-link" onClick={this.hideSidebar}><Material className="header-sidebar-btn">درباره ما</Material></NavLink>
                        {
                            user?.role === "admin" &&
                            <NavLink to="/panel" activeClassName="active" className="header-sidebar-link" onClick={this.hideSidebar}><Material className="header-sidebar-btn">پنل اعضا</Material></NavLink>
                        }
                        {
                            Object.values(categories).filter(item => !item.parent_id).map(cat =>
                                <MobileCategory key={"mob-cat" + cat._id} childs={Object.values(categories).filter(item => item.parent_id === cat._id)} cat={cat} hideSidebar={this.hideSidebar}/>,
                            )
                        }
                        {user && <Material className="header-sidebar-btn logout" onClick={this.logout}>خروج از حساب</Material>}
                    </div>

                    <div className="header-section show-desktop">
                        <Link to="/"><h1 className="header-name">تک توپ</h1></Link>
                        {
                            !user &&
                            <React.Fragment>
                                <NavLink activeClassName="header-right-section-link-active" to="/sign-up"><Material className="header-right-section-link">ثبت نام</Material></NavLink>
                                <Material className="header-right-section-link" onClick={toggleLoginModal}>ورود</Material>
                            </React.Fragment>
                        }
                        <NavLink activeClassName="header-right-section-link-active" to="/about-us"><Material className="header-right-section-link">درباره ما</Material></NavLink>
                        {user && <Material className="header-right-section-link logout" onClick={logout}>خروج</Material>}
                    </div>
                    <div className="header-section">
                        {
                            user?.role === "admin" &&
                            <NavLink activeClassName="header-right-section-link-active" className="show-desktop" to="/panel"><Material className="header-right-section-link">پنل اعضا</Material></NavLink>
                        }
                        <Link to="/"><img src={Logo} alt="تک توپ" className="header-logo"/></Link>
                    </div>
                </div>

                <div className="header-categories-nav" onMouseLeave={this.closeDialog}>
                    {
                        Object.values(categories).filter(item => !item.parent_id).map(cat =>
                            <div key={cat._id} id={cat._id} className="header-categories-nav-item" onMouseEnter={() => this.showDialog(cat, cat._id)}>
                                {cat.title}
                                <SmoothArrowSvg className="header-categories-nav-arrow"/>
                            </div>,
                        )
                    }

                    <div className={`header-categories-dialog ${showDialog ? "show" : ""}`} ref={e => this.dialog = e} style={{left}}>
                        <div className="header-categories-dialog-child">
                            {
                                Object.values(categories).filter(item => item.parent_id === showCat?._id).map(cat =>
                                    <Link to={`/category/${cat._id}`} key={cat._id} className="header-categories-dialog-child-item">{cat.title}</Link>,
                                )
                            }
                        </div>
                        {
                            showCat?.menu_picture &&
                            <img className="header-categories-dialog-img" src={REST_URL + showCat.menu_picture} alt={showCat?.title}/>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default Header