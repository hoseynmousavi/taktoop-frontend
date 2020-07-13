import React, {PureComponent} from "react"
import MaterialInput from "../Components/MaterialInput"
import Material from "../Components/Material"
import {NotificationManager} from "react-notifications"
import api from "../../Functions/api"
import {ClipLoader} from "react-spinners"

class CreateLinkModal extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {}
    }

    submitOnEnter = e => e.keyCode === 13 && this.submit()

    setValue = e =>
    {
        const {value, name} = e.target
        this[name] = value
    }

    submit = () =>
    {
        const text = this.text?.trim()
        const link = this.link?.trim()

        if (text && link)
        {
            this.setState({...this.state, loading: true}, () =>
            {
                api.post("link", {link, text})
                    .then(link =>
                    {
                        const {addLink, toggleCreateModal} = this.props
                        NotificationManager.success("با موفقیت ایجاد شد!")
                        addLink(link)
                        toggleCreateModal()
                    })
                    .catch(() => this.setState({...this.state, loading: false}, () => NotificationManager.error("مشکلی پیش آمد! کانکشن خود را چک کنید!")))
            })
        }
        else
        {
            if (!text) NotificationManager.warning("لطفا عنوان را وارد کنید!")
            if (!link) NotificationManager.warning("لطفا آدرس لینک را وارد کنید!")
        }
    }

    render()
    {
        const {loading} = this.state
        const {toggleCreateModal} = this.props
        return (
            <React.Fragment>
                {
                    loading &&
                    <div className="sign-up-page-loading-cont override">
                        <div className="panel-upload-percent clip-loader">
                            <div className="loading-cont"><ClipLoader color="var(--primary-color)" size={20}/></div>
                        </div>
                    </div>
                }
                <div className="sign-up-page-loading-cont" onClick={loading ? null : toggleCreateModal}>
                    <div className="sign-up-page modal" onClick={e => e.stopPropagation()}>
                        <div className="sign-up-page-title">ساخت لینک</div>
                        <MaterialInput className="sign-up-page-field"
                                       backgroundColor="var(--header-background-color)"
                                       name="text"
                                       label={<span>عنوان <span className="sign-up-page-field-star">*</span></span>}
                                       getValue={this.setValue}
                                       onKeyDown={this.submitOnEnter}
                        />
                        <MaterialInput className="sign-up-page-field"
                                       backgroundColor="var(--header-background-color)"
                                       name="link"
                                       label={<span>آدرس <span className="sign-up-page-field-star">*</span></span>}
                                       getValue={this.setValue}
                                       onKeyDown={this.submitOnEnter}
                        />
                        <Material className={`login-modal-submit ${loading ? "loading" : ""}`} onClick={loading ? null : this.submit}>ثبت</Material>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default CreateLinkModal