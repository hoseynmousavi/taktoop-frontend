import React, {PureComponent} from "react"
import MaterialInput from "./MaterialInput"
import Material from "./Material"
import Constant from "../../Constant/Constant"
import {NotificationManager} from "react-notifications"
import api from "../../Functions/api"
import {Link} from "react-router-dom"

class LoginModal extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            loading: false,
            serverError: false,
        }
        this.password = ""
        this.email = ""
    }

    submitOnEnter = e => e.keyCode === 13 && this.submit()

    setValue = e =>
    {
        const {value, name} = e.target
        this[name] = value
    }

    submit = () =>
    {
        const {email, password} = this
        if (Constant.email_regex.test(email.trim()) && password.length >= 8)
        {
            this.setState({...this.state, loading: true}, () =>
            {
                api.post("user/login", {email: email.trim(), password})
                    .then(user =>
                    {
                        const {setUser, toggleLoginModal} = this.props
                        setUser(user)
                        toggleLoginModal()
                        NotificationManager.success("ورود با موفقیت انجام شد!")
                    })
                    .catch(e =>
                    {
                        if (e?.response.status === 404 || e?.response.status === 401) this.setState({...this.state, serverError: false, loading: false}, () => NotificationManager.error("کاربری با اطلاعات وارد شده یافت نشد!"))
                        else this.setState({...this.state, serverError: true, loading: false})
                    })
            })
        }
        else
        {
            if (!(Constant.email_regex.test(email.trim()))) NotificationManager.warning("ایمیل وارد شده معتبر نیست!")
            if (!(password.length >= 8)) NotificationManager.warning("پسورد وارد شده معتبر نیست!")
        }
    }

    render()
    {
        const {serverError, loading} = this.state
        const {toggleLoginModal} = this.props
        return (
            <div className="sign-up-page-loading-cont" onClick={toggleLoginModal}>
                <div className="sign-up-page modal" onClick={e => e.stopPropagation()}>
                    <div className="sign-up-page-title">ورود</div>
                    <MaterialInput className="sign-up-page-field"
                                   backgroundColor="var(--header-background-color)"
                                   name="email"
                                   label="ایمیل"
                                   getValue={this.setValue}
                                   onKeyDown={this.submitOnEnter}
                    />
                    <MaterialInput className="sign-up-page-field"
                                   backgroundColor="var(--header-background-color)"
                                   type="password"
                                   name="password"
                                   label="رمز عبور"
                                   getValue={this.setValue}
                                   onKeyDown={this.submitOnEnter}
                    />
                    <div className={`sign-up-page-field-err ${serverError ? "show" : ""}`}>خطا در برقراری ارتباط!</div>
                    <Material className={`login-modal-submit ${loading ? "loading" : ""}`} onClick={loading ? null : this.submit}>ثبت</Material>
                    <Link to="/sign-up" onClick={toggleLoginModal}><Material className="login-modal-sign-up">اکانت ندارید؟ ثبت نام کنید!</Material></Link>
                </div>
            </div>
        )
    }
}

export default LoginModal