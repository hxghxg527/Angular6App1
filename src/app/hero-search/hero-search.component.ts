import {Component, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';

import {Hero} from '../hero';
import {HeroService} from '../hero.service';

@Component({
    selector: 'app-hero-search',
    templateUrl: './hero-search.component.html',
    styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {

    // $是一个命名惯例，用来表明 heroes$ 是一个 Observable，而不是数组。
    heroes$:Observable<Hero[]>;

    private searchItems = new Subject<string>();

    constructor(private heroService:HeroService) {
    }

    ngOnInit() {

        // 借助 switchMap 操作符， 每个有效的击键事件都会触发一次 HttpClient.get() 方法调用。
        // 即使在每个请求之间都有至少 300ms 的间隔，仍然可能会同时存在多个尚未返回的 HTTP 请求。
        // switchMap() 会记住原始的请求顺序，只会返回最近一次 HTTP 方法调用的结果。 以前的那些请求都会被取消和舍弃。
        // 注意，取消前一个 searchHeroes() 可观察对象并不会中止尚未完成的 HTTP 请求。
        // 那些不想要的结果只会在它们抵达应用代码之前被舍弃。
        this.heroes$ = this.searchItems.pipe(
            // wait 300ms after each keystroke before considering the term
            debounceTime(300),
            // ignore new term if same as previous term
            distinctUntilChanged(),
            // switch to new search observable when each time the term changes
            switchMap((term:string) => this.heroService.searchHeroes(term))
        );
    }

    search(term:string):void {
        this.searchItems.next(term);
    }

}
