import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {Hero} from './hero';
import {HEROES} from './mock-heroes';
import {MessageService} from './message.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({
    providedIn: 'root'
})
export class HeroService {

    private heroesUrl = 'api/heroes';

    constructor(private messageService:MessageService,
                private httpClient:HttpClient) {
    }

    getHeroes():Observable<Hero[]> {
        // this.log('start fetched heroes');
        // return of(HEROES);
        return this.httpClient
            .get<Hero[]>(this.heroesUrl)
            .pipe(
                tap(heroes => this.log('fetched heroes')),
                catchError(this.handleError('getHeroes', []))
            );
    }

    // getHero(id:number):Observable<Hero> {
    //     this.log(`fetched hero id=${id}`);
    //     return of(HEROES.find(hero => hero.id === id));
    // }

    getHero(id:number):Observable<Hero> {
        return this.httpClient
            .get<Hero>(`${this.heroesUrl}/${id}`)
            .pipe(
                tap(_ => this.log(`fetched hero id=${id}`)),
                catchError(this.handleError<Hero>(`getHero id=${id}`))
            );
    }

    updateHero(hero:Hero):Observable<any> {
        return this.httpClient
            .put(this.heroesUrl, hero, httpOptions)
            .pipe(
                tap(_ => this.log(`updated hero id=${hero.id}`)),
                catchError(this.handleError<any>(`updateHero`))
            );
    }

    addHero(hero:Hero):Observable<Hero> {
        return this.httpClient
            .post(this.heroesUrl, hero, httpOptions)
            .pipe(
                tap((hero:Hero) => this.log(`added hero w/ id=${hero.id}`)),
                catchError(this.handleError<Hero>(`addHero`))
            );
    }

    deleteHero(hero:Hero | number):Observable<any> {
        const id = typeof hero === "number" ? hero : hero.id;
        console.log(this.httpClient);
        return this.httpClient
            .delete<Hero>(`${this.heroesUrl}/${id}`, httpOptions)
            .pipe(
                tap(_ => this.log(`deleted hero id=${id}`)),
                catchError(this.handleError<Hero>(`deleteHero`))
            );
    }

    searchHeroes(term:string):Observable<Hero[]> {
        let term = term.trim();
        if (!term) {
            return of([]);
        }

        return this.httpClient
            .get<Hero[]>(`${this.heroesUrl}/?name=${term}`)
            .pipe(
                tap(_ => this.log(`search heroes matching "${term}"`)),
                catchError(this.handleError<Hero[]>(`searchHeroes`, []))
            );
    }

    private log(message:string):void {
        this.messageService
            .add(`HeroService: ${message}`);
    }

    private handleError<T>(operation = 'operation', result?:T) {
        return (error:any):Observable<T> => {
            console.log(error);
            this.log(`${operation} failed: ${error.message}`);
            return of(result as T);
        }
    }
}
