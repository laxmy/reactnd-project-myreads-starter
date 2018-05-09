import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import {DebounceInput} from 'react-debounce-input'
import * as BooksAPI from './BooksAPI'
import Book from './Book'


class BookSearch extends Component
{
  state ={
    searchResult:[],
    searchQuery:''
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
  @description: Gets books from the search API according to the search query and updates the shelves value of the SearchResult using the props.On every response checks the current state of searchQuery before updating the Response
  */
  getBooks = () =>{
    if(!this.state.searchQuery)
    {
      this.setState((prevState)=> ({ searchResult: [] }));
      return;
    }

    BooksAPI.search(this.state.searchQuery).then((bookObjects)=>
    {
      if(!bookObjects || !bookObjects.length || !this.state.searchQuery)
      {
        this.setState((prevState)=> ({ searchResult: [] }));
        return;
      }
      const bookResults = bookObjects.map((book) =>
      {
        const bookInShelf = this.props.booksCurrentlyInShelves.find(bookInShelf => bookInShelf.id === book.id);
        book.shelf= bookInShelf ? bookInShelf.shelf : 'none';
        return book;
      });
      this.setState((prevState)=>({ searchResult: bookResults }));
    })
  }

  updateSearchQuery = (query) =>{
    this.setState(()=>({searchQuery: query}));
    this.getBooks(query);
  }

  render(){
    return(
    <div className="search-books">
      <div className="search-books-bar">
        <Link className="close-search" to="/">Close</Link>
        <div className="search-books-input-wrapper">
        <DebounceInput minLength={0} debounceTimeout={200} placeholder="Search by title or author" onChange={(event) => this.updateSearchQuery(event.target.value)}/>
        </div>
      </div>
      <div className="search-books-results">
        <ol className="books-grid">
          {this.state.searchResult && this.state.searchResult.map((book) => book &&
            (
              <li key ={book.id}>
              <Book book={book} onChangeBookShelf= {this.OnSwitchingBookShelf} />
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
