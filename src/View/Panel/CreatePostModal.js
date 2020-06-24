import React, {PureComponent} from "react"
import MaterialInput from "../Components/MaterialInput"
import Material from "../Components/Material"
import PencilSvg from "../../Media/Svgs/Pencil"
import CameraSvg from "../../Media/Svgs/Camera"
import {NotificationManager} from "react-notifications"
import compressImage from "../../Helpers/compressImage"
import api, {REST_URL} from "../../Functions/api"
import SeyedCheckbox from "../Components/SeyedCheckbox"
import JDate from "jalali-date"

class CreatePostModal extends PureComponent
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

    categorySelect = e => this.category_id = e.target.value

    selectPicture = e =>
    {
        const img = e.target.files[0]
        this.picture = img
        const reader = new FileReader()
        reader.readAsDataURL(img)
        reader.onload = () => this.setState({...this.state, picturePreview: reader.result})
        e.target.value = ""
    }

    changeBold = value => this.is_bold = value

    changePredict = value => this.setState({...this.state, is_predict: value})

    update = () =>
    {
        const {update} = this.props
        const title = this.title?.trim()
        const short_description = this.short_description?.trim()
        const category_id = this.category_id?.trim()
        const picture = this.picture
        const is_bold = this.is_bold
        const is_predict = this.state?.is_predict

        if (title || short_description || (category_id && category_id !== "0") || picture || is_bold !== undefined || is_predict !== undefined)
        {
            const form = new FormData()
            if (title)
            {
                if (title.length >= 5) form.append("title", title)
                else
                {
                    NotificationManager.warning("عنوانی وارد کنید که حداقل 5 کاراکتر باشد!")
                    return
                }
            }
            if (short_description)
            {
                if (short_description.length >= 10) form.append("short_description", short_description)
                else
                {
                    NotificationManager.warning("توضیحاتی وارد کنید که حداقل 10 کاراکتر باشد!")
                    return
                }
            }
            if (category_id && category_id !== "0") form.append("category_id", category_id)
            if (is_bold !== undefined) form.append("is_bold", is_bold)
            if (is_predict !== undefined)
            {
                if (is_predict === false) form.append("is_predict", null)
                else
                {
                    const date = this.date?.value
                    const time = this.time?.value

                    const dateArray = date.split("/")
                    if (dateArray.length === 3)
                    {
                        const year = dateArray[0]
                        const month = dateArray[1]
                        const day = dateArray[2]
                        if (!isNaN(parseInt(year)) && !isNaN(parseInt(month)) && !isNaN(parseInt(day)))
                        {
                            const dateField = JDate.toGregorian(parseInt(year), parseInt(month), parseInt(day))
                            const timeArray = time.split(":")
                            if (timeArray.length === 2)
                            {
                                const hour = timeArray[0]
                                const min = timeArray[1]
                                if (!isNaN(parseInt(hour)) && !isNaN(parseInt(min)))
                                {
                                    dateField.setHours(parseInt(hour), parseInt(min))
                                    form.append("is_predict", dateField)
                                }
                                else
                                {
                                    NotificationManager.error("ساعت وارد شده غلط است!")
                                    return false
                                }
                            }
                            else
                            {
                                NotificationManager.error("ساعت وارد شده غلط است!")
                                return false
                            }
                        }
                        else
                        {
                            NotificationManager.error("تاریخ وارد شده غلط است!")
                            return false
                        }
                    }
                    else
                    {
                        NotificationManager.error("تاریخ وارد شده غلط است!")
                        return false
                    }
                }
            }
            compressImage(picture).then(picture =>
            {
                picture && form.append("picture", picture)
                form.append("_id", update._id)
                api.patch("post", form, "", e => this.setState({...this.state, loadingPercent: Math.floor((e.loaded * 100) / e.total)}))
                    .then(post =>
                    {
                        const {addOrUpdatePost, toggleCreateModal} = this.props
                        NotificationManager.success("با موفقیت ویرایش شد!")
                        addOrUpdatePost(post)
                        toggleCreateModal()
                    })
                    .catch(e =>
                    {
                        if (e?.response?.data?.keyPattern?.title) this.setState({...this.state, loading: false}, () => NotificationManager.error("عنوان وارد شده تکراری است!"))
                        else this.setState({...this.state, loading: false}, () => NotificationManager.error("مشکلی پیش آمد! کانکشن خود را چک کنید!"))
                    })
            })
        }
        else NotificationManager.warning("تغییری ایجاد نکرده اید!")
    }

    submit = () =>
    {
        const title = this.title?.trim()
        const short_description = this.short_description?.trim()
        const category_id = this.category_id?.trim()
        const picture = this.picture
        const is_bold = this.is_bold
        const is_predict = this.state?.is_predict

        if (title && title.length >= 5 && short_description && short_description.length >= 10 && category_id && category_id !== "0" && picture)
        {
            const form = new FormData()
            form.append("title", title)
            form.append("short_description", short_description)
            form.append("category_id", category_id)
            is_bold && form.append("is_bold", is_bold)
            if (is_predict)
            {
                const date = this.date?.value
                const time = this.time?.value

                const dateArray = date.split("/")
                if (dateArray.length === 3)
                {
                    const year = dateArray[0]
                    const month = dateArray[1]
                    const day = dateArray[2]
                    if (!isNaN(parseInt(year)) && !isNaN(parseInt(month)) && !isNaN(parseInt(day)))
                    {
                        const dateField = JDate.toGregorian(parseInt(year), parseInt(month), parseInt(day))
                        const timeArray = time.split(":")
                        if (timeArray.length === 2)
                        {
                            const hour = timeArray[0]
                            const min = timeArray[1]
                            if (!isNaN(parseInt(hour)) && !isNaN(parseInt(min)))
                            {
                                dateField.setHours(parseInt(hour), parseInt(min))
                                form.append("is_predict", dateField)
                            }
                            else
                            {
                                NotificationManager.error("ساعت وارد شده غلط است!")
                                return false
                            }
                        }
                        else
                        {
                            NotificationManager.error("ساعت وارد شده غلط است!")
                            return false
                        }
                    }
                    else
                    {
                        NotificationManager.error("تاریخ وارد شده غلط است!")
                        return false
                    }
                }
                else
                {
                    NotificationManager.error("تاریخ وارد شده غلط است!")
                    return false
                }
            }
            compressImage(picture).then(picture =>
            {
                form.append("picture", picture)
                api.post("post", form, "", e => this.setState({...this.state, loadingPercent: Math.floor((e.loaded * 100) / e.total)}))
                    .then(category =>
                    {
                        const {addOrUpdatePost, toggleCreateModal} = this.props
                        NotificationManager.success("با موفقیت ایجاد شد!")
                        addOrUpdatePost(category)
                        toggleCreateModal()
                    })
                    .catch(e =>
                    {
                        if (e?.response?.data?.keyPattern?.title) this.setState({...this.state, loading: false}, () => NotificationManager.error("عنوان وارد شده تکراری است!"))
                        else this.setState({...this.state, loading: false}, () => NotificationManager.error("مشکلی پیش آمد! کانکشن خود را چک کنید!"))
                    })
            })
        }
        else
        {
            if (!(title && title.length >= 5)) NotificationManager.warning("عنوانی وارد کنید که حداقل 5 کاراکتر باشد!")
            if (!(short_description && short_description.length >= 10)) NotificationManager.warning("توضیحاتی وارد کنید که حداقل 10 کاراکتر باشد!")
            if (!(category_id && category_id !== "0")) NotificationManager.warning("دسته بندی را انتخاب کنید!")
            if (!(picture)) NotificationManager.warning("عکس را انتخاب کنید!")
        }
    }

    render()
    {
        const {loading, loadingPercent, picturePreview, is_predict} = this.state
        const {toggleCreateModal, categories, update} = this.props
        return (
            <React.Fragment>
                {
                    loading &&
                    <div className="sign-up-page-loading-cont override">
                        <div className="panel-upload-percent">{loadingPercent} %</div>
                    </div>
                }
                <div className="sign-up-page-loading-cont" onClick={loading ? null : toggleCreateModal}>
                    <div className="sign-up-page modal" onClick={e => e.stopPropagation()}>
                        <div className="sign-up-page-title">{update ? "ویرایش" : "ساخت"} پست</div>
                        <MaterialInput className="sign-up-page-field"
                                       backgroundColor="var(--header-background-color)"
                                       name="title"
                                       maxLength={80}
                                       label={<span>عنوان <span className="sign-up-page-field-star">*</span></span>}
                                       getValue={this.setValue}
                                       onKeyDown={this.submitOnEnter}
                                       defaultValue={update?.title}
                        />
                        <MaterialInput className="sign-up-page-area"
                                       isTextArea={true}
                                       backgroundColor="var(--header-background-color)"
                                       name="short_description"
                                       maxLength={250}
                                       label={<span>توضیحات کوتاه <span className="sign-up-page-field-star">*</span></span>}
                                       getValue={this.setValue}
                                       defaultValue={update?.short_description}
                        />

                        <select className="panel-select-box" onChange={this.categorySelect} defaultValue={update?.category_id}>
                            <option value="0">انتخاب دسته بندی *</option>
                            {
                                Object.values(categories).filter(cat => cat.parent_id).map(item =>
                                    <option key={item._id} value={item._id}>{categories[item.parent_id].title} 🠘 {item.title}</option>,
                                )
                            }
                        </select>

                        <label className="panel-image-upload">
                            <Material className="panel-image-upload-material">
                                <div className="panel-image-upload-label">عکس اصلی</div>
                                {
                                    picturePreview || update ?
                                        <React.Fragment>
                                            <img className="panel-image-upload-img" src={picturePreview ? picturePreview : REST_URL + update.picture} alt=""/>
                                            <PencilSvg className="panel-image-upload-edit"/>
                                        </React.Fragment>
                                        :
                                        <React.Fragment>
                                            <CameraSvg className="panel-image-upload-add"/>
                                            <span className="sign-up-page-field-star">*</span>
                                        </React.Fragment>
                                }
                                <input type="file" hidden accept="image/*" onChange={this.selectPicture}/>
                            </Material>
                        </label>

                        <SeyedCheckbox className="panel-checkbox" label="بولد" defaultValue={update.is_bold} onChange={this.changeBold}/>

                        <div className="panel-checkbox-pre-cont">
                            <SeyedCheckbox className="panel-checkbox-pre" label="پیشبینی" defaultValue={update.is_predict} onChange={this.changePredict}/>
                            {
                                (is_predict || update.is_predict) &&
                                <div className="panel-checkbox-pre-inputs">
                                    <input placeholder="19:30" ref={e => this.time = e} maxLength={5} className="panel-checkbox-pre-time"/>
                                    <input placeholder="1399/4/4" ref={e => this.date = e} maxLength={10} className="panel-checkbox-pre-date"/>
                                </div>
                            }
                        </div>

                        <Material className={`login-modal-submit ${loading ? "loading" : ""}`} onClick={loading ? null : update ? this.update : this.submit}>ثبت</Material>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default CreatePostModal