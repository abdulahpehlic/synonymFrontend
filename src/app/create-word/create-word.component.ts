import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { WordRequest } from '../core/word/model/word-request';
import { WordResponse } from '../core/word/model/word-response';
import { WordService } from '../core/word/service/word-service';

@Component({
  selector: 'app-create-word',
  templateUrl: './create-word.component.html',
  styleUrls: ['./create-word.component.css'],
})
export class CreateWordComponent implements OnInit {

  selectedSynonyms: string[] = [];
  possibleDescriptions: any[] = [];
  possibleSynonyms: any[] = [];
  suggestedSynonyms: any[] = [];
  synonymObjectArray: any[] = [];
  wordAddForm: FormGroup;
  synonymAddForm: FormGroup;
  isWordSubmitted: boolean = false;
  wordSelected: string;
  jsonDataThesaurus: any[] = [];
  selectedDefinition: string;
  existingSynonyms: string[] = [];
  isThereExistingSynonyms: boolean = false;
  wordAddRequest: any[] = [];
  existingSynonymGroup: number = -1;
  existingDefinition: string;
  wordAddResponseData: any;

  constructor(private wordService: WordService, private dialog: MatDialog,
    private snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
    this.initForms();
  }

  //Forms initalization
  initForms() {
    this.wordAddForm = new FormGroup({
      wordString: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(30), this.noWhitespaceValidator])
    })

    this.synonymAddForm = new FormGroup({
      wordString: new FormControl('', [Validators.maxLength(30)])
    })
  }
  //Method used for dispatching the add request to backend
  addSynonyms() {
    this.synonymAddForm.reset();
    this.buildSynonymsAddRequest();
    this.wordService.addWords(this.wordAddRequest).subscribe(
      (data: any) => {
        this.wordAddResponseData = data;
      },
      (err) => {
        this.openSnackBar('Something went wrong!', 'Close');
        console.error(JSON.stringify(err));
      },
      () => {
        this.openSnackBar('Synonyms added successfully! You can now find them in search', 'Close');
      }
    );
  }

  //Getting existing synonyms from the database to make sure that there are no duplicates
  getExistingSynonyms(description: string) {
    this.wordService.fetchWordsByDescription(description).subscribe(
      (data: WordResponse[]) => {
        if (data.length !== 0) {
          this.existingDefinition = data[0].description;
          this.existingSynonymGroup = data[0].synonymGroup;
          data.forEach((synonymObject: any) => {
            this.existingSynonyms.push(synonymObject.word);
          });
          this.existingSynonyms.splice(this.existingSynonyms.indexOf(this.wordSelected), 1)
          this.isThereExistingSynonyms = true;
          this.existingSynonyms.forEach((existingSynonym: any) => {
            this.suggestedSynonyms.forEach((suggestedSynonym: any, index) => {
              if (suggestedSynonym === existingSynonym) {
                this.suggestedSynonyms.splice(index, 1);
              }
            });
            this.possibleSynonyms.forEach((possibleSynonym: any, index) => {
              if (possibleSynonym === existingSynonym) {
                this.possibleSynonyms.splice(index, 1);
              }
            });
          });
        }
        else {
          this.isThereExistingSynonyms = false;
        }
      },
      (err) => {
        console.error(JSON.stringify(err));
      },
      () => {

      }
    );
  }

  //Method used to get possible descriptions when a user first submits a word
  getPossibleDescriptions(wordAddForm: any) {
    this.possibleDescriptions = [];
    this.wordService.fetchThesaurusResponse(wordAddForm.wordString).subscribe(
      (data: any) => {
        if (data.data === null) {
          this.openSnackBar('Invalid word, please try another one!', 'Close');
          return;
        }
        this.jsonDataThesaurus = data.data.definitionData.definitions;
        this.jsonDataThesaurus.forEach((definition: any) => {
          this.possibleDescriptions.push(definition.definition);
        });

        this.isWordSubmitted = true;
        this.wordSelected = wordAddForm.wordString.trim().toLowerCase();
      },
      (err) => {
        console.error(JSON.stringify(err));
      },
      () => {

      }
    );
  }

  //Method used to build the request body to be sent
  buildSynonymsAddRequest() {
    //If the definition selected already exists, use the existing synonym group from the database
    if (this.existingSynonymGroup !== -1 && this.existingDefinition === this.selectedDefinition) {
      this.selectedSynonyms.forEach((selectedSynonym: any) => {
        this.wordAddRequest.push({
          word: selectedSynonym,
          description: this.selectedDefinition,
          synonymGroup: this.existingSynonymGroup
        })
      });
      //Add the initial word entered before selecting definition
      if (this.existingSynonyms.indexOf(this.wordSelected) !== -1 || this.existingDefinition !== this.selectedDefinition) {
        const pivotWord = {
          word: this.wordSelected,
          description: this.selectedDefinition,
          synonymGroup: this.existingSynonymGroup
        }
        this.wordAddRequest.push(pivotWord);
      }
    }
    //If the definition does not exist, send an empty synonymGroup which will initialize the next synonym group in the database
    else {
      this.selectedSynonyms.forEach((selectedSynonym: any) => {
        this.wordAddRequest.push({
          word: selectedSynonym,
          description: this.selectedDefinition
        })
      });
      //Add the initial word entered before selecting definition
      if (this.existingSynonyms.indexOf(this.wordSelected) === -1) {
        const pivotWord: WordRequest = {
          word: this.wordSelected,
          description: this.selectedDefinition
        }
        this.wordAddRequest.push(pivotWord);
      }
    }
  }

  //Handle synonyms added through the input field
  addSynonymUsingInput(synonym: string) {
    //If the synonym is already selected alert the user
    if (this.selectedSynonyms.indexOf(synonym) !== -1 || this.wordSelected === synonym) {
      this.openSnackBar('Synonym already picked!', 'Close');
      return;
    }
    //If the synonym already exists in the database alert the user
    if (this.existingSynonyms.indexOf(synonym) !== -1) {
      this.openSnackBar('Synonym already exists in the database!', 'Close');
      return;
    }
    //If the synonym is valid, add it to the selected synonyms, remove from suggested ones
    if (this.possibleSynonyms.indexOf(synonym) !== -1) {
      this.handleSynonymSuggestionPick(synonym);
      return;
    }
    else {
      //If the word input is not a synonym to the initial word submitted, alert the user
      this.openSnackBar(synonym + ' is not a synonym! Please enter a word which is a synonym to ' + this.wordSelected, 'Close');
    }
  }

  //If a user selects a suggested synonym, it is added to the selected synonyms and removed from suggested ones
  handleSynonymSuggestionPick(synonym: string) {
    this.selectedSynonyms.push(synonym);
    this.suggestedSynonyms.forEach((element, index) => {
      if (element === synonym) {
        this.suggestedSynonyms.splice(index, 1);
      }
    });
    this.synonymAddForm.reset();
  }

  //If a user removes a selected synonym, it is added to the suggested synonyms and removed from selected ones
  handleSynonymSuggestionRemove(synonym: string) {
    this.synonymAddForm.reset();
    let hasSynonymMaxSimilarity;
    //If the synonym has 100 similarity to the original word, it is added to the suggested synonyms, if not it is removed from the view
    this.synonymObjectArray.forEach((element) => {
      if (element.similarity !== "100" && element.term === synonym) {
        this.selectedSynonyms.splice(this.selectedSynonyms.indexOf(synonym), 1);
        hasSynonymMaxSimilarity = false;
      }
    });
    if (hasSynonymMaxSimilarity === false) {
      return;
    }
    //Move the synonym to suggested synonyms
    this.suggestedSynonyms.push(synonym);
    this.selectedSynonyms.forEach((element, index) => {
      if (element === synonym) {
        this.selectedSynonyms.splice(index, 1);
      }
    });
  }

  //Getting potential synonyms to create suggestions for max similarity synonyms
  getPotentialSynonyms(description: string) {
    this.getExistingSynonyms(description);
    this.selectedDefinition = description;
    //Match the word definition provided in the parameter and get synonyms for that definition
    this.jsonDataThesaurus.forEach((definition: any) => {
      if (definition.definition === description) {
        this.synonymObjectArray = definition.synonyms;
      }
    });
    //If max similarity, add to suggested synonyms
    this.synonymObjectArray.forEach((synonym) => {
      this.possibleSynonyms.push(synonym.term);
      if (synonym.similarity === "100") {
        this.suggestedSynonyms.push(synonym.term);
      }
    });
  }

  //Method used to open a modal using a templateRef initialized in the HTML template
  openModal(templateRef: any) {
    let dialogRef = this.dialog.open(templateRef, {
      width: '350px',
      panelClass: 'modal',
    });
    //Resetting forms and data when the modal is closed
    dialogRef.afterClosed().subscribe(result => {
      this.synonymAddForm.reset();
      this.onCancelModal();
    });
  }

  //Resetting data when user closes the add synonyms modal
  onCancelModal() {
    this.selectedSynonyms = [];
    this.possibleSynonyms = [];
    this.suggestedSynonyms = [];
    this.existingSynonyms = [];
    this.wordAddRequest = [];
    this.existingSynonymGroup = -1;
    this.dialog.closeAll();
    this.synonymAddForm.reset();
  }

  //Method used to open the snackBar for alerts
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      panelClass: ['custom-snackbar'],
    });
  }

  //Method used to navigate through the app components using the Router
  navigate(url: string) {
    this.router.navigateByUrl(url);
  }

  //Validator method used for a specific case when user only enters whitespace
  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }
}
