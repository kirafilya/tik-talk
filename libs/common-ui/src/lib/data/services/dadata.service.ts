import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs';
import {DadataSuggestion} from '../unterfaces/dadata.interfaces';


@Injectable({
  providedIn: 'root',
})

export class DadataService {
  #apiUrl = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address'
  #http = inject(HttpClient)
  #DADATA_TOKEN = '9d7aeef06d58553bfac4226ee658e07af1d22beb';

  getSuggestion(query: string) {
    console.log('Token: ', this.#DADATA_TOKEN);

    return this.#http.post<{suggestions : DadataSuggestion[]}>(this.#apiUrl, {query}, {
      headers: {
        Authorization: `Token ${this.#DADATA_TOKEN}`
      }
    }).pipe(
       map(res => {
         return Array.from(
           new Set(
             res.suggestions.map(
              (suggestion: DadataSuggestion) => {
                 return suggestion.data.city
           }
         )))
       })
    )

  }

}

