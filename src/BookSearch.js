import React, { Component } from 'react'
import * as BooksAPI from './BooksAPI'
import Book from './Book'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'


class BookSearch extends Component
{
  state ={
    searchResult:[]
  }
/*
@description: Switches bookshelf for books currently in the search result. Also uses the prop function to update the bookshelves with the new value to keep everything in sync
*/
  OnSwitchingBookShelf = (book,value)=>
  {
    let currentSearchResult = this.state.searchResult;
    let bookToUpdate = currentSearchResult.find(everyBook => everyBook.id === book.id);

    this.props.onChangeBookShelf(bookToUpdate,value);
    bookToUpdate.shelf = value;
    this.setState(()=>({searchResult:currentSearchResult}));
  }
  /*
  @description: Gets books from the search API according to the search term and updates the shelves value of the SearchResult using the props.
  */
  getBooks = (searchTerm)=>{

    if(!searchTerm)
    {
      this.setState((prevState)=> ({ searchResult: [] }));
      return;
    }
    BooksAPI.search(searchTerm).then((bookObjects)=>
    {
      if(!bookObjects || bookObjects.error)
      {
        this.setState((prevState)=> ({ searchResult: [] }));
        return;
      }
      bookObjects = bookObjects.map((book) =>
      {
        let bookInShelf = this.props.booksCurrentlyInShelves.find(bookInShelf => bookInShelf.id === book.id);
        book.shelf= bookInShelf ? bookInShelf.shelf : 'none';
        return book;
      });
      this.setState((prevState)=>({ searchResult:bookObjects }));
    })
  }

  render(){
    return(
    <div className="search-books">
      <div className="search-books-bar">
        <Link className="close-search" to="/">Close</Link>
        <div className="search-books-input-wrapper">
          <input type="text" placeholder="Search by title or author" onInput={(event) => this.getBooks(event.target.value)}/>
        </div>
      </div>
      <div className="search-books-results">
        <ol className="books-grid">
          {this.state.searchResult && this.state.searchResult.map((book) => book &&
            (
              <li key ={book.id}>
              <Book book={book} OnChangeBookShelf= {this.OnSwitchingBookShelf} />
              </li>
            ))}
        </ol>
      </div>
    </div>
  );
}
}
BookSearch.propTypes = {
  booksCurrentlyInShelves: PropTypes.array.isRequired,
  onChangeBookShelf: PropTypes.func.isRequired,
}
export default BookSearch
