import React, {PureComponent} from "react"
import {ClipLoader} from "react-spinners"
import PencilSvg from "../../Media/Svgs/Pencil"
import api from "../../Functions/api"
import Material from "../Components/Material"
import CreateCategory from "./CreateCategory"
import {NotificationManager} from "react-notifications"

class SubCategory extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            addModal: false,
        }
    }

    toggleCreateModal = () =>
    {
        const addModal = !this.state.addModal
        this.setState({...this.state, addModal, category: addModal ? this.state.category : null})
    }

    openUpdate(category)
    {
        this.setState({...this.state, addModal: !this.state.addModal, category})
    }

    removeCategory = id =>
    {
        let result = window.confirm("از حذف مطمئنید؟")
        if (result)
        {
            api.del("category", {_id: id})
                .then(() =>
                {
                    const {removeCategoryFromState} = this.props
                    const {addModal} = this.state
                    NotificationManager.success("با موفقیت حذف شد!")
                    addModal && this.toggleCreateModal()
                    removeCategoryFromState(id)
                })
                .catch(() => NotificationManager.error("مشکلی پیش آمد! کانکشن خود را چک کنید!"))
        }
    }

    render()
    {
        const {addModal, category} = this.state
        const {error, isLoading, categories, _id, addOrUpdateCategory} = this.props
        return (
            <React.Fragment>
                <div className="panel-table-title">
                    دسته‌بندی‌ها
                </div>
                {
                    error ?
                        <div className="panel-table-err-loading">مشکلی پیش آمد! کانکشن خود را بررسی کنید!</div>
                        :
                        isLoading ?
                            <div className="panel-table-err-loading"><ClipLoader size={19} color="var(--primary-color)"/></div>
                            :
                            Object.values(categories).filter(cat => cat.parent_id === _id).length > 0 ?
                                <React.Fragment>
                                    <div className="panel-table-row-cont dont-gesture">
                                        <div className="panel-table-row title">
                                            <div className="panel-table-row-item">عنوان</div>
                                            <div className="panel-table-row-item">توضیحات</div>
                                            <div className="panel-table-row-item">ایجاد</div>
                                            <div className="panel-table-row-item">ویرایش</div>
                                        </div>
                                        {
                                            Object.values(categories).filter(cat => cat.parent_id === _id).map(category =>
                                                <div key={category._id} className="panel-table-row padding-mobile padding-desktop">
                                                    <div className="panel-table-row-item">{category.title}</div>
                                                    <div className="panel-table-row-item">{category.description}</div>
                                                    <div className="panel-table-row-item">{new Date(category.created_date).toLocaleDateString("fa-ir")}</div>
                                                    <div className="panel-table-row-item"><PencilSvg className="panel-table-row-item-arrow edit" onClick={() => this.openUpdate(category)}/></div>
                                                </div>,
                                            )
                                        }
                                    </div>
                                </React.Fragment>
                                :
                                <div className="panel-table-err-loading">دسته‌بندی پیدا نشد!</div>
                }

                <Material className="panel-add-item" backgroundColor="rgba(255,255,255,0.3)" onClick={this.toggleCreateModal}>+</Material>

                {addModal && <CreateCategory parent_id={_id} toggleCreateModal={this.toggleCreateModal} addOrUpdateCategory={addOrUpdateCategory} removeCategory={this.removeCategory} category={category}/>}
            </React.Fragment>
        )
    }
}

export default SubCategory