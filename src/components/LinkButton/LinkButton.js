import React from "react";
import { Button } from "react-materialize";
import { Link } from "react-router-dom";

class LinkButton extends React.Component {
    render() {
        return (
            <Link to={this.props.path} >
                <Button type="button" className={this.props.buttonClasses}>
                    {this.props.buttonName}
                </Button>
            </Link>
        )
    }
}

export default LinkButton;