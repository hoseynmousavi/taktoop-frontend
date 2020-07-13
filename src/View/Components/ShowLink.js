import React, {PureComponent} from "react"
import api from "../../Functions/api"

class ShowLink extends PureComponent
{
    componentDidMount()
    {
        api.get("link")
            .then(link => this.setState({...this.state, link}))
    }

    render()
    {
        const {link} = this.state || {}
        if (link)
        {
            return <a className="show-link" href={link.link.includes("http") ? link.link : "http://" + link.link}>{link.text}</a>
        }
        else return null
    }
}

export default ShowLink