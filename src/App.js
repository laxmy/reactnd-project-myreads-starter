import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import BookShelf from './BookShelf'
import BookSearch from './BookSearch'
import { Link , Route } from 'react-router-dom'

class BooksApp extends React.Component {
  state = {
    books:[]
  }

  componentDidMount()
  {
    BooksAPI.getAll().then(
      ((bookObjects) => {
        this.setState(() =>({books: bookObjects }));
      })
    )
  }

  ChangeBookShelf = (book, value)=>
  {
    if(book.shelf !== value){
      //update : if value is none and book already present in shelf, remove
      //if value = anything else update it, if already in shelf or add the book to shelf
      BooksAPI.update(book, value).then(() => {
          let currentState = this.state.books;
          if (value ==='none')
          {
            currentState = currentState.filter(eachBook => eachBook.id !== book.id);
          }
          else
          {
             let bookToUpdate = currentState.find(bookinShelf =>bookinShelf.id === book.id);
             book.shelf = value;
             bookToUpdate ? bookToUpdate.shelf = value : currentState.push(book);
          }
          this.setState(()=> ({books: currentState}));
        })

    }
  }


  render() {
    return (
      <div className="app">
        <Route exact path= '/search' render={() =>(
        <BookSearch BooksCurrentlyInShelves = {this.state.books} OnChangeBookShelf = {this.ChangeBookShelf} />
        )} />
        <Route exact path='/' render={() => (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <BookShelf Books ={ this.state.books.filter((book) => book.shelf ==='currentlyReading')} ShelfTitle ="Currently Reading" OnChangeBookShelf = {this.ChangeBookShelf}/>
                <BookShelf Books ={ this.state.books.filter((book) => book.shelf ==='wantToRead')} ShelfTitle ="Want to Read" OnChangeBookShelf = {this.ChangeBookShelf}/>
                <BookShelf Books ={ this.state.books.filter((book) => book.shelf ==='read')} ShelfTitle ="Read" OnChangeBookShelf = {this.ChangeBookShelf}/>
              </div>
            </div>
            <div className="open-search">
              <Link to='/search'>Add a Book</Link>
            </div>
          </div>
        )} />
      </div>
    )
  }
}

export default BooksApp
