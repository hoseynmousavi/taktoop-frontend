import React, {PureComponent} from "react"
import MaterialInput from "../Components/MaterialInput"
import Material from "../Components/Material"
import Constant from "../../Constant/Constant"
import api from "../../Functions/api"
import {MoonLoader} from "react-spinners"
import {NotificationManager} from "react-notifications"
import {Redirect} from "react-router-dom"
import {Helmet} from "react-helmet"

class SignupPage extends PureComponent
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
        this.emailValid = false
    }

    componentDidMount()
    {
        window.scroll({top: 0})
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
                    if (result.count === 0) this.setState({...this.state, serverError: false}, () => this.emailValid = true)
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

    submitOnEnter = e => e.keyCode === 13 && this.submit()

    submit = () =>
    {
        const {name, email, password} = this.state
        if (password.length >= 8 && name.trim().length > 0 && this.emailValid)
        {
            this.setState({...this.state, loading: true}, () =>
            {
                api.post("user/sign-up", {name: name.trim(), email: email.trim(), password})
                    .then(user =>
                    {
                        const {setUser} = this.props
                        setUser(user)
                        NotificationManager.success("ثبت نام با موفقیت انجام شد!")
                        this.setState({...this.state, redirect: true})
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
        const {nameErr, emailErr, passwordErr, emailErrText, passwordErrText, loading, redirect, serverError} = this.state
        return (
            <div className="sign-up-page-cont">

                <Helmet>
                    <title>مجله آنالیز فوتبال | ثبت نام</title>
                    <meta property="og:title" content="مجله آنالیز فوتبال | ثبت نام"/>
                    <meta name="twitter:title" content="مجله آنالیز فوتبال | ثبت نام"/>
                </Helmet>

                {redirect && <Redirect to="/"/>}

                {loading && <div className="sign-up-page-loading-cont"><MoonLoader color="var(--secondary-color)" size={40}/></div>}

                <div className="sign-up-page">
                    <div className="sign-up-page-title">ثبت نام</div>
                    <MaterialInput className="sign-up-page-field"
                                   backgroundColor="var(--header-background-color)"
                                   name="name"
                                   label={<span>نام و نام خانوادگی <span className="sign-up-page-field-star">*</span></span>}
                                   getValue={this.setName}
                                   borderColor={nameErr && "var(--error-color)"}
                                   onKeyDown={this.submitOnEnter}
                    />

                    <MaterialInput className="sign-up-page-field"
                                   backgroundColor="var(--header-background-color)"
                                   name="email"
                                   label={<span>ایمیل <span className="sign-up-page-field-star">*</span></span>}
                                   getValue={this.setEmail}
                                   onBlur={this.onEmailBlur}
                                   borderColor={emailErr && "var(--error-color)"}
                                   onKeyDown={this.submitOnEnter}
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
                                   onKeyDown={this.submitOnEnter}
                    />
                    <div className={`sign-up-page-field-err ${passwordErrText ? "show" : ""}`}>{passwordErrText}</div>

                    <div className={`sign-up-page-field-err ${serverError ? "show" : ""}`}>خطا در برقراری ارتباط!</div>

                    <Material className="sign-up-page-submit" onClick={this.submit}>ثبت</Material>
                </div>
            </div>
        )
    }
}

export default SignupPage