import React from 'react'
import { Link , Route } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import BookShelf from './BookShelf'
import BookSearch from './BookSearch'
import './App.css'


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
      BooksAPI.update(book, value).then(() => {
        book.shelf = value;
        this.setState(currentState => ({
        books: currentState.books.filter(b => b.id !== book.id).concat(book)
      }));
      })
    }
  }


  render() {
    return (
      <div className="app">
        <Route exact path= '/search' render={() =>(
        <BookSearch booksCurrentlyInShelves = {this.state.books} onChangeBookShelf = {this.ChangeBookShelf} />
        )} />
        <Route exact path='/' render={() => (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <BookShelf books ={ this.state.books.filter((book) => book.shelf ==='currentlyReading')} shelfTitle ="Currently Reading" onChangeBookShelf = {this.ChangeBookShelf}/>
                <BookShelf books ={ this.state.books.filter((book) => book.shelf ==='wantToRead')} shelfTitle ="Want to Read" onChangeBookShelf = {this.ChangeBookShelf}/>
                <BookShelf books ={ this.state.books.filter((book) => book.shelf ==='read')} shelfTitle ="Read" onChangeBookShelf = {this.ChangeBookShelf}/>
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
