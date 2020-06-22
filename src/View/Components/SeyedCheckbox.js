import React, {PureComponent} from "react"
import * as PropTypes from "prop-types"
import Material from "./Material"

class SeyedCheckbox extends PureComponent
{
    static propTypes = {
        className: PropTypes.string,
        label: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
    }

    componentDidMount()
    {
        const {defaultValue} = this.props
        if (defaultValue) this.setState({...this.state, is_on: true})
    }

    toggle = () =>
    {
        const {onChange} = this.props
        const is_on = !this.state?.is_on
        this.setState({...this.state, is_on}, () => onChange(is_on))
    }

    render()
    {
        const {label, className} = this.props
        const {is_on} = this.state || {}
        return (
            <Material className={`seyed-checkbox-cont ${className}`} onClick={this.toggle}>
                <div className={`seyed-checkbox ${is_on ? "" : "hide"}`}/>
                {label}
            </Material>
        )
    }
}

export default SeyedCheckbox