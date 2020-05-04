import React, {PureComponent} from "react"
import {Route, Switch} from "react-router-dom"
import PanelSidebar from "./PanelSidebar"
import Categories from "./Categories"
import Posts from "./Posts"

class PanelMain extends PureComponent
{
    render()
    {
        return (
            <div className="panel-page-container">
                <PanelSidebar/>
                <div className="panel-page-content">
                    <Switch>
                        <Route path="/panel/categories" render={() => <Categories/>}/>
                        <Route path="/panel/posts" render={() => <Posts/>}/>
                        <Route path="*" render={() => <div className="panel-welcome">سلام ادمین</div>}/>
                    </Switch>
                </div>
            </div>
        )
    }
}

export default PanelMain