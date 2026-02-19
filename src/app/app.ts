import { Component, signal } from '@angular/core';
import { Header } from './components/header/header'
import { Home } from './home/home';

@Component({
  selector: 'app-root',
  imports: [Header, Home],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

}
