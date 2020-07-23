import React, {PureComponent} from "react"
import {Helmet} from "react-helmet"
import MaterialInput from "../Components/MaterialInput"
import Material from "../Components/Material"
import Constant from "../../Constant/Constant"
import api from "../../Functions/api"
import {NotificationManager} from "react-notifications"

class ProfilePage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            loading: false,
            nameErr: false,
            emailErr: false,
            passwordErr: false,
            name: "",
            email: "",
            password: "",
            emailErrText: "",
            passwordErrText: "",
            serverError: false,
        }
        this.emailValid = true
    }

    componentDidMount()
    {
        window.scroll({top: 0})

        const {user} = this.props
        this.setState({name: user.name, email: user.email})
    }

    setName = e =>
    {
        const {value} = e.target
        let nameErr = false
        if (value.trim().length === 0) nameErr = true
        this.setState({...this.state, nameErr, name: value})
    }

    setEmail = e =>
    {
        const {emailErr, emailErrText} = this.state
        const {value} = e.target
        let error = true
        this.emailValid = false
        if (Constant.email_regex.test(value.trim())) error = false
        this.setState({...this.state, emailErr: error ? emailErr : false, emailErrText: error ? emailErrText : "", email: value})
    }

    onEmailBlur = e =>
    {
        const {value} = e.target
        if (Constant.email_regex.test(value.trim()))
        {
            api.post("user/email-check", {email: value.trim()})
                .then(result =>
                {
                    const {user} = this.props
                    if (result.count === 0 || user.email === value.trim()) this.setState({...this.state, serverError: false}, () => this.emailValid = true)
                    else this.setState({...this.state, serverError: false, emailErr: true, emailErrText: "ایمیل وارد شده تکراری است!"})
                })
                .catch(() => this.setState({...this.state, serverError: true}))
        }
        else this.setState({...this.state, emailErr: true, emailErrText: "ایمیل وارد شده معتبر نیست!"})
    }

    setPassword = e =>
    {
        const {passwordErr, passwordErrText} = this.state
        const {value} = e.target
        let error = true
        if (value.trim().length >= 8) error = false
        this.setState({...this.state, passwordErr: error ? passwordErr : false, passwordErrText: error ? passwordErrText : "", password: value})
    }

    onPasswordBlur = e =>
    {
        const {value} = e.target
        if (value.length < 8) this.setState({...this.state, passwordErr: true, passwordErrText: "رمز عبور باید حداقل 8 کاراکتر باشد!"})
    }

    submit = () =>
    {
        const {name, email, password} = this.state
        if (((password && password.length >= 8) || !password) && name.trim().length > 0 && this.emailValid)
        {
            this.setState({...this.state, loading: true}, () =>
            {
                let form = {name: name.trim(), email: email.trim()}
                if (password) form.password = password
                api.post("user/sign-up", form)
                    .then(user =>
                    {
                        const {setUser} = this.props
                        setUser(user)
                        NotificationManager.success("ویرایش با موفقیت انجام شد!")
                        this.setState({...this.state, loading: false})
                    })
                    .catch(() => this.setState({...this.state, serverError: true, loading: false}))
            })
        }
        else
        {
            if (password.length < 8) NotificationManager.warning("پسورد وارد شده معتبر نیست!")
            if (name.trim().length === 0) NotificationManager.warning("لطفا نام خود را وارد کنید!")
            if (!this.emailValid) NotificationManager.warning("ایمیل وارد شده معتبر نیست!")
        }
    }

    render()
    {
        const {loading, nameErr, emailErrText, emailErr, passwordErr, passwordErrText, serverError} = this.state || {}
        const {user} = this.props
        return (
            <div className="profile-page-cont">

                <Helmet>
                    <title>تک توپ | پروفایل</title>
                    <meta property="og:title" content="تک توپ | پروفایل"/>
                    <meta name="twitter:title" content="تک توپ | پروفایل"/>
                </Helmet>

                <div className="panel-table-title regular">پروفایل</div>
                <div className="profile-content">
                    <MaterialInput className="sign-up-page-field no-top"
                                   backgroundColor="var(--header-background-color)"
                                   name="name"
                                   label={<span>نام و نام خانوادگی <span className="sign-up-page-field-star">*</span></span>}
                                   getValue={this.setName}
                                   borderColor={nameErr && "var(--error-color)"}
                                   defaultValue={user.name}
                    />

                    <MaterialInput className="sign-up-page-field"
                                   backgroundColor="var(--header-background-color)"
                                   name="email"
                                   label={<span>ایمیل <span className="sign-up-page-field-star">*</span></span>}
                                   getValue={this.setEmail}
                                   onBlur={this.onEmailBlur}
                                   borderColor={emailErr && "var(--error-color)"}
                                   defaultValue={user.email}
                    />
                    <div className={`sign-up-page-field-err ${emailErrText ? "show" : ""}`}>{emailErrText}</div>

                    <MaterialInput className="sign-up-page-field"
                                   backgroundColor="var(--header-background-color)"
                                   type="password"
                                   name="password"
                                   label={<span>رمز عبور <span className="sign-up-page-field-star">*</span></span>}
                                   getValue={this.setPassword}
                                   onBlur={this.onPasswordBlur}
                                   borderColor={passwordErr && "var(--error-color)"}
                    />
                    <div className={`sign-up-page-field-err ${passwordErrText ? "show" : ""}`}>{passwordErrText}</div>

                    <div className={`sign-up-page-field-err ${serverError ? "show" : ""}`}>خطا در برقراری ارتباط!</div>

                    <Material className={`login-modal-submit margin-top-only ${loading ? "loading" : ""}`} onClick={loading ? null : this.submit}>ثبت</Material>
                </div>

            </div>
        )
    }
}

export default ProfilePage