import React, {PureComponent} from "react"
import {ClipLoader} from "react-spinners"
import api from "../../Functions/api"
import {NotificationManager} from "react-notifications"

class Admins extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            isLoading: true,
            users: {},
        }
    }

    componentDidMount()
    {
        api.get("admin/users")
            .then(users => this.setState({...this.state, isLoading: false, users: users.reduce((sum, item) => ({...sum, [item._id]: item}), {})}))
            .catch(() => this.setState({...this.state, isLoading: false, error: true}))
    }

    changeRole(e, user)
    {
        const role = e.target.value
        if (user.role !== role)
        {
            api.post("admin/change-role", {user_id: user._id, role})
                .then(() => NotificationManager.success("انجام شد"))
                .catch(() => NotificationManager.error("مشکلی پیش آمد، نت خود را بررسی کنید."))
        }
    }

    render()
    {
        const {user} = this.props
        const {error, isLoading, users} = this.state || {}
        return (
            <div className="panel-categories-cont">
                <div className="panel-table-title">
                    کاربران
                </div>
                {
                    error ?
                        <div className="panel-table-err-loading">مشکلی پیش آمد! کانکشن خود را بررسی کنید!</div>
                        :
                        isLoading ?
                            <div className="panel-table-err-loading"><ClipLoader size={19} color="var(--primary-color)"/></div>
                            :
                            users && Object.values(users).length > 0 ?
                                <React.Fragment>
                                    <div className="panel-table-row-cont dont-gesture">
                                        <div className="panel-table-row title wide">
                                            <div className="panel-table-row-item grow">نام</div>
                                            <div className="panel-table-row-item grow">نقش</div>
                                        </div>
                                        {
                                            Object.values(users).filter(item => item._id !== user._id).map(user =>
                                                <div key={user._id} className="panel-table-row wide">
                                                    <div className="panel-table-row-item grow">{user.name}</div>
                                                    <div className="panel-table-row-item grow">
                                                        <select disabled={user.role === "system"} defaultValue={user.role} className="panel-table-row-item-select" onChange={e => this.changeRole(e, user)}>
                                                            <option value="user">کاربر</option>
                                                            <option value="admin">ادمین</option>
                                                            <option disabled={true} value="system">مدیر</option>
                                                        </select>
                                                    </div>
                                                </div>,
                                            )
                                        }
                                    </div>
                                </React.Fragment>
                                :
                                <div className="panel-table-err-loading">لینکی پیدا نشد!</div>
                }

            </div>
        )
    }
}

export default Admins