import React, {PureComponent} from "react"
import api, {REST_URL} from "../../Functions/api"
import {ClipLoader} from "react-spinners"
import Material from "../Components/Material"
import CreateCategory from "./CreateCategory"
import ImageShow from "../Components/ImageShow"

class Categories extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            isLoading: true,
            error: false,
            categories: {},
            addModal: false,
        }
    }

    componentDidMount()
    {
        api.get("category")
            .then(categories => this.setState({...this.state, isLoading: false, categories: categories.reduce((sum, cat) => ({...sum, [cat._id]: cat}), {})}))
            .catch(() => this.setState({...this.state, isLoading: false, error: true}))
    }

    toggleCreateModal = () =>
    {
        const addModal = !this.state.addModal
        this.setState({...this.state, addModal, category: addModal ? this.state.category : null})
    }

    addOrUpdateCategory = category =>
    {
        const {categories} = this.state
        if (categories[category._id]) this.setState({...this.state, categories: {...categories, [category._id]: {...category}}})
        else this.setState({...this.state, categories: {[category._id]: {...category}, ...categories}})
    }

    removeCategory = id =>
    {
        const categories = {...this.state.categories}
        delete categories[id]
        this.setState({...this.state, categories})
    }

    openUpdate(category)
    {
        this.setState({...this.state, addModal: !this.state.addModal, category})
    }

    render()
    {
        const {category, addModal, categories, error, isLoading} = this.state
        return (
            <div className="panel-categories-cont">
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
                            Object.values(categories).length > 0 ?
                                <React.Fragment>
                                    <div className="panel-table-row-cont dont-gesture">
                                        <div className="panel-table-row title wide">
                                            <div className="panel-table-row-item">عنوان</div>
                                            <div className="panel-table-row-item">توضیحات</div>
                                            <div className="panel-table-row-item">آدرس</div>
                                            <div className="panel-table-row-item">ایجاد</div>
                                            <div className="panel-table-row-item">اسلایدر</div>
                                            <div className="panel-table-row-item">منو</div>
                                        </div>
                                        {
                                            Object.values(categories).map(category =>
                                                <div key={category._id} className="panel-table-row wide" onClick={() => this.openUpdate(category)}>
                                                    <div className="panel-table-row-item">{category.title}</div>
                                                    <div className="panel-table-row-item">{category.description}</div>
                                                    <div className="panel-table-row-item">{category.address}</div>
                                                    <div className="panel-table-row-item">{new Date(category.created_date).toLocaleDateString("fa-ir")}</div>
                                                    <div className="panel-table-row-item"><ImageShow className="panel-table-row-item-img" src={REST_URL + category.slider_picture} alt={category.title}/></div>
                                                    <div className="panel-table-row-item"><ImageShow className="panel-table-row-item-img" src={REST_URL + category.menu_picture} alt={category.title}/></div>
                                                </div>,
                                            )
                                        }
                                    </div>
                                </React.Fragment>
                                :
                                <div className="panel-table-err-loading">دسته‌بندی پیدا نشد!</div>
                }

                <Material className="panel-add-item" backgroundColor="rgba(255,255,255,0.3)" onClick={this.toggleCreateModal}>+</Material>

                {addModal && <CreateCategory toggleCreateModal={this.toggleCreateModal} addOrUpdateCategory={this.addOrUpdateCategory} removeCategory={this.removeCategory} category={category}/>}

            </div>
        )
    }
}

export default Categories