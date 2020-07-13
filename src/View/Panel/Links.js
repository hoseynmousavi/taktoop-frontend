import React, {PureComponent} from "react"
import {ClipLoader} from "react-spinners"
import GarbageSvg from "../../Media/Svgs/GarbageSvg"
import api from "../../Functions/api"
import {NotificationManager} from "react-notifications"
import Material from "../Components/Material"
import CreateLinkModal from "./CreateLinkModal"

class Links extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            isLoading: true,
            links: {},
        }
    }

    componentDidMount()
    {
        api.get("link", "?all=true")
            .then(links => this.setState({...this.state, isLoading: false, links: links.reduce((sum, item) => ({...sum, [item._id]: item}), {})}))
            .catch(() => this.setState({...this.state, isLoading: false, error: true}))
    }

    removeLink = id =>
    {
        let result = window.confirm("از حذف مطمئنید؟")
        if (result)
        {
            api.del("link", {_id: id})
                .then(() =>
                {
                    NotificationManager.success("با موفقیت حذف شد!")
                    const links = {...this.state.links}
                    delete links[id]
                    this.setState({...this.state, links})
                })
                .catch(() => NotificationManager.error("مشکلی پیش آمد! کانکشن خود را چک کنید!"))
        }
    }

    toggleCreateModal = () =>
    {
        const addModal = !this.state.addModal
        this.setState({...this.state, addModal})
    }

    addLink = link =>
    {
        const {links} = this.state
        this.setState({...this.state, links: {[link._id]: {...link}, ...links}})
    }

    render()
    {
        const {error, isLoading, links, addModal} = this.state || {}
        return (
            <div className="panel-categories-cont">
                <div className="panel-table-title">
                    لینک‌ها
                </div>
                {
                    error ?
                        <div className="panel-table-err-loading">مشکلی پیش آمد! کانکشن خود را بررسی کنید!</div>
                        :
                        isLoading ?
                            <div className="panel-table-err-loading"><ClipLoader size={19} color="var(--primary-color)"/></div>
                            :
                            links && Object.values(links).length > 0 ?
                                <React.Fragment>
                                    <div className="panel-table-row-cont dont-gesture">
                                        <div className="panel-table-row title wide">
                                            <div className="panel-table-row-item grow">عنوان</div>
                                            <div className="panel-table-row-item grow">آدرس</div>
                                        </div>
                                        {
                                            Object.values(links).map(link =>
                                                <div key={link._id} className="panel-table-row padding-mobile wide">
                                                    <GarbageSvg className="panel-table-row-edit delete-right" onClick={() => this.removeLink(link._id)}/>
                                                    <div className="panel-table-row-item grow">{link.text}</div>
                                                    <div className="panel-table-row-item grow">{link.link}</div>
                                                </div>,
                                            )
                                        }
                                    </div>
                                </React.Fragment>
                                :
                                <div className="panel-table-err-loading">لینکی پیدا نشد!</div>
                }

                <Material className="panel-add-item" backgroundColor="rgba(255,255,255,0.3)" onClick={this.toggleCreateModal}>+</Material>

                {addModal && <CreateLinkModal toggleCreateModal={this.toggleCreateModal} addLink={this.addLink}/>}


            </div>
        )
    }
}

export default Links