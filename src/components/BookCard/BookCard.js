import React from 'react';
import {
    Card, CardTitle
} from 'react-materialize';

import Utils from '../../Utils';

class BookCard extends React.Component {
    render() {
        return (
            <Card
                title={this.props.book.title}
                actions={this.props.actions}
                horizontal
                header={<CardTitle image={Utils.backend + '/files/' + this.props.book.thumbnail} />}>
                Por {this.props.book.author}<br />
            </Card>
        )
    }
}

export default BookCard;