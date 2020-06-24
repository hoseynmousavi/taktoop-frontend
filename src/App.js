import React, {lazy, PureComponent, Suspense} from "react"
import {Route, Switch} from "react-router-dom"
import {NotificationContainer} from "react-notifications"
import Header from "./View/Components/Header"
import LoginModal from "./View/Components/LoginModal"
import api, {REST_URL} from "./Functions/api"

const PanelMain = lazy(() => import("./View/Panel/PanelMain"))
const CategoryPage = lazy(() => import("./View/Pages/CategoryPage"))
const HomePage = lazy(() => import("./View/Pages/HomePage"))
const PostPage = lazy(() => import("./View/Pages/PostPage"))
const SignupPage = lazy(() => import("./View/Pages/SignupPage"))
const NotFoundPage = lazy(() => import("./View/Pages/NotFoundPage"))

class App extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            user: null,
            loginModal: false,
            categories: {},
            catLoading: true,
        }
    }

    componentDidMount()
    {
        const {location} = this.props
        if (location.pathname.includes("/show-picture"))
        {
            let currentPath = location.pathname.replace("/show-picture", "")
            window.history.replaceState("", "", currentPath ? currentPath : "/")
            document.location.reload()
        }

        window.scroll({top: 0})

        api.get("category")
            .then(categories =>
            {
                this.setState({...this.state, catLoading: false, categories: categories.reduce((sum, cat) => ({...sum, [cat._id]: cat}), {})}, () =>
                {
                    categories.filter(item => !item.parent_id).forEach(item =>
                    {
                        let img = new Image()
                        img.src = REST_URL + item.menu_picture
                        img.onload = () => console.log("loaded img")
                    })
                })
            })
            .catch(() => this.setState({...this.state, catLoading: false, catError: true}))

        if (localStorage.hasOwnProperty("user"))
        {
            const user = JSON.parse(localStorage.getItem("user"))
            this.setState({...this.state, user})
        }
    }

    setUser = user =>
    {
        this.setState({...this.state, user}, () =>
            localStorage.setItem("user", JSON.stringify(user)),
        )
    }

    toggleLoginModal = () => this.setState({...this.state, loginModal: !this.state.loginModal})

    logout = () => this.setState({...this.state, user: null}, () => localStorage.removeItem("user"))

    render()
    {
        const {user, loginModal, categories} = this.state
        return (
            <React.Fragment>

                <Header user={user} categories={categories} toggleLoginModal={this.toggleLoginModal} logout={this.logout}/>

                <main className="main">
                    <Suspense fallback={null}>
                        <Switch>
                            <Route path="/sign-up" render={() => <SignupPage setUser={this.setUser}/>}/>
                            <Route path="/category/:id" render={route => <CategoryPage key={route.match.params.id} category={categories[route.match.params.id]} parent={categories[categories[route.match.params.id]?.parent_id]}/>}/>
                            <Route path="/post/:title" render={route => <PostPage title={route.match.params.title}/>}/>
                            {user?.role === "admin" && <Route path="/panel" render={() => <PanelMain/>}/>}
                            <Route exact path="/" render={() => <HomePage categories={categories}/>}/>
                            <Route path="*" render={() => <NotFoundPage/>}/>
                        </Switch>
                    </Suspense>
                </main>

                <NotificationContainer/>

                {loginModal && <LoginModal setUser={this.setUser} toggleLoginModal={this.toggleLoginModal}/>}

            </React.Fragment>
        )
    }
}

export default App