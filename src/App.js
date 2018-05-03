import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import BookShelf from './BookShelf'
import { Link , Route } from 'react-router-dom'

class BooksApp extends React.Component {
  state = {
    books:[]
  }

  componentDidMount()
  {
    BooksAPI.getAll().then(
      ((bookObjects) => {
        this.setState({books: bookObjects });
      })
    )
  }

  ChangeBookShelf = (id, value)=>
  {
    let currentState = this.state.books;
    let bookToUpdate = currentState.findIndex((book) => book.id ===id);
    currentState[bookToUpdate].shelf = value;
    BooksAPI.update(currentState[bookToUpdate], value).then(
      () => this.setState({books: currentState})
    )
  }

  render() {
    return (
      <div className="app">
      <Route exact path= '/search' render={() =>(
          <div className="search-books">
            <div className="search-books-bar">

              <a className="close-search" onClick={() => this.setState({ showSearchPage: false })}>Close</a>
              <div className="search-books-input-wrapper">
                {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                <input type="text" placeholder="Search by title or author"/>

              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid"></ol>
            </div>
          </div>
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
             <div class="open-search">
              <Link to='/search'>Add a Book</Link>
            </div>
          </div>
          )}
        />
      </div>
    )
  }
}

export default BooksApp
