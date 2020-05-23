import React, {PureComponent} from "react"
import MaterialInput from "../Components/MaterialInput"
import Material from "../Components/Material"
import PencilSvg from "../../Media/Svgs/Pencil"
import CameraSvg from "../../Media/Svgs/Camera"
import {NotificationManager} from "react-notifications"
import compressImage from "../../Helpers/compressImage"
import api from "../../Functions/api"

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

    submit = () =>
    {
        const title = this.title?.trim()
        const short_description = this.short_description?.trim()
        const category_id = this.category_id?.trim()
        const picture = this.picture

        if (title && title.length >= 5 && short_description && short_description.length >= 10 && category_id && category_id !== "0" && picture)
        {
            const form = new FormData()
            form.append("title", title)
            form.append("short_description", short_description)
            form.append("category_id", category_id)
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
        const {loading, loadingPercent, picturePreview} = this.state
        const {toggleCreateModal, categories} = this.props
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
                        <div className="sign-up-page-title">ساخت پست</div>
                        <MaterialInput className="sign-up-page-field"
                                       backgroundColor="var(--background-color)"
                                       name="title"
                                       maxLength={80}
                                       label={<span>عنوان <span className="sign-up-page-field-star">*</span></span>}
                                       getValue={this.setValue}
                                       onKeyDown={this.submitOnEnter}
                        />
                        <MaterialInput className="sign-up-page-area"
                                       isTextArea={true}
                                       backgroundColor="var(--background-color)"
                                       name="short_description"
                                       maxLength={250}
                                       label={<span>توضیحات کوتاه <span className="sign-up-page-field-star">*</span></span>}
                                       getValue={this.setValue}
                        />

                        <select className="panel-select-box" onChange={this.categorySelect}>
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
                                    picturePreview ?
                                        <React.Fragment>
                                            <img className="panel-image-upload-img" src={picturePreview} alt=""/>
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

                        <Material className={`login-modal-submit ${loading ? "loading" : ""}`} onClick={loading ? null : this.submit}>ثبت</Material>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default CreatePostModal