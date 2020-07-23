import React, {PureComponent} from "react"
import {Route, Switch} from "react-router-dom"
import PanelSidebar from "./PanelSidebar"
import Categories from "./Categories"
import Posts from "./Posts"
import Links from "./Links"
import Admins from "./Admins"

class PanelMain extends PureComponent
{
    render()
    {
        const {user} = this.props
        return (
            <div className="panel-page-container">
                <PanelSidebar user={user}/>
                <div className="panel-page-content">
                    <Switch>
                        <Route path="/panel/categories" render={() => <Categories/>}/>
                        <Route path="/panel/posts" render={() => <Posts/>}/>
                        <Route path="/panel/links" render={() => <Links/>}/>
                        {user?.role === "system" && <Route path="/panel/admins" render={() => <Admins user={user}/>}/>}
                        <Route path="*" render={() => <div className="panel-welcome">سلام ادمین</div>}/>
                    </Switch>
                </div>
            </div>
        )
    }
}

export default PanelMain