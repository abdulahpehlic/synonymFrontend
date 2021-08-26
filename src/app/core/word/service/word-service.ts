import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { WordResponse } from '../model/word-response';
import { WordRequest } from '../model/word-request';

@Injectable({
  providedIn: 'root'
})
export class WordService {
  private url = 'http://stormy-tor-83845.herokuapp.com/api/words/';

  private thesaurusUri = 'https://tuna.thesaurus.com/pageData/';

  constructor(private http: HttpClient) { }

  //Method used to dispatch a GET request for retrieving words by a word string
  fetchWords(word: String) {
    return this.http.get<WordResponse[]>(this.url + word).pipe(
      catchError(this.handleError)
    )
  }

  //Method used to dispatch a GET request for retrieving words by description
  fetchWordsByDescription(description: String) {
    return this.http.get<WordResponse[]>(this.url + "check/" + description).pipe(
      catchError(this.handleError)
    )
  }

  //Method used to dispatch a GET request for retrieving possible synonyms of a word
  //This is mostly used to make the app foolproof, disabling the user to enter random data
  fetchThesaurusResponse(word: String) {
    return this.http.get<any>(this.thesaurusUri + word).pipe(
      catchError(this.handleError)
    );
  }

  //Method used to dispatch a POST request for adding new words using an array of objects in request body
  addWords(request: any[]) {
    return this.http.post<any[]>(this.url + 'add', request).pipe(
      catchError(this.handleError)
    );
  }

  //Method used to handle potential errors when dispatching requests
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }
}
