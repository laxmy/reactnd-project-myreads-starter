import React, { Component } from 'react'
import * as BooksAPI from './BooksAPI'
import Book from './Book'
import {Link} from 'react-router-dom'

class BookSearch extends Component
{
  state ={
    searchResult:[]
  }

  OnSwitchingBookShelf = (book,value)=>
  {
    let currentSearchResult = this.state.searchResult;
    let bookToUpdate = currentSearchResult.find(everyBook => everyBook.id === book.id);

    this.props.OnChangeBookShelf(bookToUpdate,value);
    bookToUpdate.shelf = value;
    this.setState(()=>({searchResult:currentSearchResult}));
  }

  getBooks = (searchTerm)=>{

    if(!searchTerm)
    {
      console.log("Empty search Term:"+searchTerm);
      this.setState(()=> ({ searchResult: [] }));
      return;
    }
    BooksAPI.search(searchTerm).then((bookObjects)=>
    {
      if(!bookObjects || bookObjects.error)
      {
        this.setState(()=> ({ searchResult: [] }));
        return;
      }
      bookObjects = bookObjects.map((book) =>
      {
        let bookInShelf = this.props.BooksCurrentlyInShelves.find(bookInShelf => bookInShelf.id === book.id);
        book.shelf= bookInShelf ? bookInShelf.shelf : 'none';
        return book;
      });
      this.setState(()=>({ searchResult:bookObjects }));
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
export default BookSearch
