import {
  Component,
  inject,
  ViewChild,
  ViewContainerRef,
  AfterViewInit,
} from '@angular/core';
import { Header }               from './components/header/header';
import { Home }                 from './home/home';
import { DynamicLoaderService } from './services/dynamic-loader';

@Component({
  selector:    'app-root',
  imports:     [Header, Home],
  templateUrl: './app.html',
  styleUrl:    './app.scss',
})
export class App implements AfterViewInit {

  private loader = inject(DynamicLoaderService);

  @ViewChild('dynamicHost', { read: ViewContainerRef })
  private dynamicHost!: ViewContainerRef;

  ngAfterViewInit(): void {
    this.loader.register(this.dynamicHost);
  }
}