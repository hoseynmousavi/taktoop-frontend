import React, {lazy, PureComponent, Suspense} from "react"
import {Route, Switch} from "react-router-dom"
import {NotificationContainer} from "react-notifications"
import Header from "./View/Components/Header"
import LoginModal from "./View/Components/LoginModal"

const HomePage = lazy(() => import("./View/Pages/HomePage"))
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
        }
    }

    componentDidMount()
    {
        window.scroll({top: 0})

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
        const {user, loginModal} = this.state
        return (
            <React.Fragment>
                <Header user={user} toggleLoginModal={this.toggleLoginModal} logout={this.logout}/>
                <main className="main">
                    <Suspense fallback={null}>
                        <Switch>
                            <Route path="/sign-up" render={() => <SignupPage setUser={this.setUser}/>}/>
                            <Route exact path="/" render={() => <HomePage/>}/>
                            <Route path="*" render={() => <NotFoundPage/>}/>
                        </Switch>
                    </Suspense>
                    <NotificationContainer/>
                </main>

                {loginModal && <LoginModal setUser={this.setUser} toggleLoginModal={this.toggleLoginModal}/>}

            </React.Fragment>
        )
    }
}

export default App