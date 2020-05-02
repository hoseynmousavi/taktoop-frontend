import React, {PureComponent} from "react"

class HomePage extends PureComponent
{
    componentDidMount()
    {
        window.scroll({top: 0})
    }

    render()
    {
        return (
            <div className="home-page-cont">
                صفحه اصلی
            </div>
        )
    }
}

export default HomePage