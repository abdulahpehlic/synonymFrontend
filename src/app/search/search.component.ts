import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { WordResponse } from '../core/word/model/word-response';
import { WordService } from '../core/word/service/word-service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredValues: any;
  words: WordResponse[];
  wordsGrouped: WordResponse[][];
  wordSearchForm: FormGroup;
  selectedWord: string;
  wordDescription: string;

  constructor (private wordService: WordService, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.initForms();
  }
  //Forms initalization
  initForms(){
    this.wordSearchForm = new FormGroup({
      wordString: new FormControl('', [Validators.required, Validators.minLength(1), this.noWhitespaceValidator])
    })
  }

  //Method used to retrieve synonyms for the word entered from the database and group them by their descriptions to multiple arrays
  getSynonyms(wordSearchFormValue: any){
    this.wordService.fetchWords(wordSearchFormValue.wordString.trim().toLowerCase()).subscribe(
      (data: any[]) => {
        if (data.length == 0) {
          this.openSnackBar('No synonyms found for this word!', 'Close');
          return;
        }
        this.words = data;
        this.wordsGrouped = this.groupSynonyms(this.words);
        this.wordsGrouped.forEach((group: any, index) => {
          if ((group == null) || (group.length == 0)) {
            this.wordsGrouped.splice(index, 1);
          }
          else {
            let tempGroup = this.wordsGrouped.splice(index ,1);
            this.wordsGrouped.unshift(tempGroup[0]);
          }
        });
        this.wordsGrouped.length = Object.keys(this.wordsGrouped).length;
        this.selectedWord = wordSearchFormValue.wordString.trim().toLowerCase();
        this.wordDescription = data[0].description;
      },
      (err) => {
        console.error(JSON.stringify(err));
        
      },
      () => {
        
      }
    );
  }

  //Method used to group words by their descriptions, to make it easier to display them
  groupSynonyms(words: WordResponse[]) {
    return words.reduce(function (r, a) {
      r[a.synonymGroup] = r[a.synonymGroup] || [];
      r[a.synonymGroup].push(a);
      return r;
    }, [Object.create([])]);
  }
  
  //Method used to navigate through the app components using the Router
  navigate(url: string){
    this.router.navigateByUrl(url);
  }
  
  //Method used to open the snackBar for alerts
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      panelClass: ['custom-snackbar'],
    });
  }

  //Validator method used for a specific case when user only enters whitespace
  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

}
