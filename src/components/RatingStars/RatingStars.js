import React from 'react';
import { Icon } from 'react-materialize';
import './RatingStars.css';

class RatingStars extends React.Component {
    render() {
        let stars = [];
        let i;
        let intStars = Math.floor(this.props.rating);

        for (i = 0; i < intStars; i++) {
            stars.push(<Icon key={i+this.props.bookTitle}>star</Icon>);
        }

        if((this.props.rating - intStars) >= 0.5){
            stars.push(<Icon key={stars.length+this.props.bookTitle}>star_half</Icon>);
        }

        for (i = stars.length; i < 5 ; i++) {
            stars.push(<Icon key={i+this.props.bookTitle}>star_border</Icon>);
        }

        return (
            <span className="ratingSpan">
                {stars}
            </span>
        );
    }
}

export default RatingStars;