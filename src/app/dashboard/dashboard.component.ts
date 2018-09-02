import {Component, OnInit} from '@angular/core';
import {HeroService} from '../hero.service';
import {Hero} from '../hero';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    selectedHero:Hero;
    heroes:Hero[] = [];

    constructor(private heroService:HeroService) {
    }

    ngOnInit() {
        this.getHeroes();
    }

    getHeroes():void {
        this.heroService
            .getHeroes()
            .subscribe(heroes => this.heroes = heroes.slice(0));
    }

    onSelectHero(hero:Hero):void {
        this.selectedHero = hero;
    }

    add(name:string):void {
        name = name.trim();
        if (!name) {
            return;
        }
        this.heroService.addHero({name} as Hero)
            .subscribe(hero => {
                this.heroes.push(hero)
            });
    }

    deleteHero(hero:Hero):void {
        this.heroes = this.heroes.filter(_hero => _hero !== hero);
        this.heroService.deleteHero(hero).subscribe();
    }

}
