import React, {PureComponent} from "react"
import MaterialInput from "../Components/MaterialInput"
import Material from "../Components/Material"
import CameraSvg from "../../Media/Svgs/Camera"
import PencilSvg from "../../Media/Svgs/Pencil"
import {NotificationManager} from "react-notifications"
import api, {REST_URL} from "../../Functions/api"
import compressImage from "../../Helpers/compressImage"

class CreateCategory extends PureComponent
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

    selectSlider = e =>
    {
        const img = e.target.files[0]
        this.slider = img
        const reader = new FileReader()
        reader.readAsDataURL(img)
        reader.onload = () => this.setState({...this.state, sliderPre: reader.result})
        e.target.value = ""
    }

    selectMenu = e =>
    {
        const img = e.target.files[0]
        this.menu = img
        const reader = new FileReader()
        reader.readAsDataURL(img)
        reader.onload = () => this.setState({...this.state, menuPre: reader.result})
        e.target.value = ""
    }

    submit = () =>
    {
        const title = this.title?.trim()
        const description = this.description?.trim()
        const address = this.address?.trim()
        const slider = this.slider
        const menu = this.menu

        if (title && slider && menu)
        {
            this.setState({...this.state, loading: true, loadingPercent: 0}, () =>
            {
                let form = new FormData()
                form.append("title", title)
                description && form.append("description", description)
                address && form.append("address", address)
                compressImage(slider).then(slider =>
                {
                    form.append("slider_picture", slider)
                    compressImage(menu).then(menu =>
                    {
                        form.append("menu_picture", menu)
                        api.post("category", form, "", e => this.setState({...this.state, loadingPercent: Math.floor((e.loaded * 100) / e.total)}))
                            .then(category =>
                            {
                                const {addOrUpdateCategory, toggleCreateModal} = this.props
                                NotificationManager.success("با موفقیت ایجاد شد!")
                                addOrUpdateCategory(category)
                                toggleCreateModal()
                            })
                            .catch(() => this.setState({...this.state, loading: false}, () => NotificationManager.error("مشکلی پیش آمد! کانکشن خود را چک کنید!")))
                    })
                })
            })
        }
        else
        {
            if (!title) NotificationManager.warning("لطفا عنوان را وارد کنید!")
            if (!slider) NotificationManager.warning("لطفا عکس اسلایدر را وارد کنید!")
            if (!menu) NotificationManager.warning("لطفا عکس منو را وارد کنید!")
        }
    }

    update = () =>
    {
        const title = this.title?.trim()
        const description = this.description?.trim()
        const address = this.address?.trim()
        const slider = this.slider
        const menu = this.menu
        if (title || description || address || slider || menu)
        {
            this.setState({...this.state, loading: true, loadingPercent: 0}, () =>
            {
                const {category} = this.props
                let form = new FormData()
                form.append("_id", category._id)
                title && form.append("title", title)
                description && form.append("description", description)
                address && form.append("address", address)
                compressImage(slider).then(slider =>
                {
                    slider && form.append("slider_picture", slider)
                    compressImage(menu).then(menu =>
                    {
                        menu && form.append("menu_picture", menu)
                        api.patch("category", form, "", e => this.setState({...this.state, loadingPercent: Math.floor((e.loaded * 100) / e.total)}))
                            .then(category =>
                            {
                                const {addOrUpdateCategory, toggleCreateModal} = this.props
                                NotificationManager.success("با موفقیت آپدیت شد!")
                                addOrUpdateCategory(category)
                                toggleCreateModal()
                            })
                            .catch(() => this.setState({...this.state, loading: false}, () => NotificationManager.error("مشکلی پیش آمد! کانکشن خود را چک کنید!")))
                    })
                })
            })
        }
        else NotificationManager.warning("تغییری ایجاد نکرده‌اید!")
    }

    render()
    {
        const {loading, sliderPre, menuPre, loadingPercent} = this.state
        const {toggleCreateModal, category} = this.props
        return (
            <React.Fragment>
                {
                    loading &&
                    <div className="sign-up-page-loading-cont override">
                        <div className="panel-upload-percent">{loadingPercent} %</div>
                    </div>
                }
                <div className="sign-up-page-loading-cont vertical-wide" onClick={loading ? null : toggleCreateModal}>
                    <div className="sign-up-page modal" onClick={e => e.stopPropagation()}>
                        <div className="sign-up-page-title">{category ? "ویرایش" : "ساخت"} دسته‌بندی</div>
                        <MaterialInput className="sign-up-page-field"
                                       backgroundColor="var(--background-color)"
                                       name="title"
                                       label={<span>عنوان <span className="sign-up-page-field-star">*</span></span>}
                                       getValue={this.setValue}
                                       onKeyDown={this.submitOnEnter}
                                       defaultValue={category?.title}
                        />
                        <MaterialInput className="sign-up-page-field"
                                       backgroundColor="var(--background-color)"
                                       name="description"
                                       label="توضیحات"
                                       getValue={this.setValue}
                                       onKeyDown={this.submitOnEnter}
                                       defaultValue={category?.description}
                        />
                        <label className="panel-image-upload">
                            <Material className="panel-image-upload-material">
                                <div className="panel-image-upload-label">عکس اسلایدر</div>
                                {
                                    sliderPre || category?.slider_picture ?
                                        <React.Fragment>
                                            <img className="panel-image-upload-img" src={sliderPre ? sliderPre : REST_URL + category.slider_picture} alt=""/>
                                            <PencilSvg className="panel-image-upload-edit"/>
                                        </React.Fragment>
                                        :
                                        <React.Fragment>
                                            <CameraSvg className="panel-image-upload-add"/>
                                            <span className="sign-up-page-field-star">*</span>
                                        </React.Fragment>
                                }
                                <input type="file" hidden accept="image/*" onChange={this.selectSlider}/>
                            </Material>
                        </label>
                        <MaterialInput className="sign-up-page-field"
                                       backgroundColor="var(--background-color)"
                                       name="address"
                                       label="آدرس اسلایدر"
                                       getValue={this.setValue}
                                       onKeyDown={this.submitOnEnter}
                                       defaultValue={category?.address}
                        />
                        <label className="panel-image-upload">
                            <Material className="panel-image-upload-material">
                                <div className="panel-image-upload-label">عکس دسته‌بندی</div>
                                {
                                    menuPre || category?.menu_picture ?
                                        <React.Fragment>
                                            <img className="panel-image-upload-img" src={menuPre ? menuPre : REST_URL + category.menu_picture} alt=""/>
                                            <PencilSvg className="panel-image-upload-edit"/>
                                        </React.Fragment>
                                        :
                                        <React.Fragment>
                                            <CameraSvg className="panel-image-upload-add"/>
                                            <span className="sign-up-page-field-star">*</span>
                                        </React.Fragment>
                                }
                                <input type="file" hidden accept="image/*" onChange={this.selectMenu}/>
                            </Material>
                        </label>
                        <Material className={`login-modal-submit ${loading ? "loading" : ""}`} onClick={loading ? null : category ? this.update : this.submit}>ثبت</Material>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default CreateCategory