import React from 'react';

class FileInput extends React.Component {
    render() {
        return (
            <div className="file-field input-field">
                <div className="btn">
                    <span>Procurar</span>
                    <input required={this.props.required} type="file" name={this.props.name} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" placeholder="Carregar arquivo" />
                </div>                
            </div>
        )
    }
}

export default FileInput;

