import React, { Component } from 'react'
import Book from './Book'
import PropTypes from 'prop-types'


class BookShelf extends Component
{
  render(){
    return(
    <div className="bookshelf">
      <h2 className="bookshelf-title">{ this.props.shelfTitle}</h2>
        <div className="bookshelf-books">
          <ol className="books-grid">
          { this.props.books.map((book) =>
            (
              <li key ={book.id}>
              <Book book={book} onChangeBookShelf= {this.props.onChangeBookShelf}/>
              </li>
            ))}
            </ol>
          </div>
        </div>
      );
  }
}
BookShelf.propTypes = {
  books: PropTypes.array.isRequired,
  shelfTitle: PropTypes.array.isRequired,
  onChangeBookShelf: PropTypes.func.isRequired,
}
export default BookShelf
