import React, {PureComponent} from "react"
import MaterialInput from "../Components/MaterialInput"
import Material from "../Components/Material"
import {NotificationManager} from "react-notifications"
import api from "../../Functions/api"

class AddDescription extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {}
    }

    setValue = e =>
    {
        const {value, name} = e.target
        this[name] = value
    }

    toggleAddDescription = () =>
    {
        const {toggleAddDescription} = this.props
        const description = this.description?.trim()
        if (description)
        {
            const confirm = window.confirm("اطلاعات وارد شده حذف میشوند، مطئمنید؟")
            confirm && toggleAddDescription()
        }
        else toggleAddDescription()
    }

    submit = () =>
    {
        const {update} = this.props

        const description = this.description?.trim()

        if (description)
        {
            this.setState({...this.state, loading: true}, () =>
            {
                const {post_id, order, isBold, addPostDescription, toggleAddDescription} = this.props
                if (update)
                {
                    api.patch("post-description", {_id: update._id, content: description, type: isBold ? "bold" : "description"})
                        .then(created =>
                        {
                            addPostDescription(created)
                            toggleAddDescription()
                        })
                }
                else
                {
                    api.post("post-description", {content: description, post_id, order, type: isBold ? "bold" : "description"})
                        .then(created =>
                        {
                            addPostDescription(created)
                            toggleAddDescription()
                        })
                }
            })
        }
        else
        {
            if (update) NotificationManager.error("تغییری ایجاد نشده!")
            else NotificationManager.error("توضیحات را وارد کنید!")
        }
    }

    render()
    {
        const {update, isBold} = this.props
        const {loading} = this.state
        return (
            <div className="sign-up-page-loading-cont" onClick={loading ? null : this.toggleAddDescription}>
                <div className="sign-up-page modal" onClick={e => e.stopPropagation()}>
                    <div className="sign-up-page-title">{update ? "ویرایش" : "ساخت"} توضیحات</div>
                    <MaterialInput className={`sign-up-page-area add-desc ${isBold ? "bold" : ""}`}
                                   isTextArea={true}
                                   backgroundColor="var(--header-background-color)"
                                   name="description"
                                   label={<span>توضیحات <span className="sign-up-page-field-star">*</span></span>}
                                   getValue={this.setValue}
                                   defaultValue={update?.content}
                    />
                    <Material className={`login-modal-submit ${loading ? "loading" : ""}`} onClick={loading ? null : this.submit}>ثبت</Material>
                </div>
            </div>
        )
    }
}

export default AddDescription