import React from 'react';
class StringInput extends React.Component {
    render() {
        return (
            <label>
                {this.props.label}: <input type={this.props.type} value={this.props.value} name={this.props.name}/>
            </label>
        );
    }
}

export default StringInput;
