import { Component, signal, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import confetti from "canvas-confetti"

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements AfterViewInit, OnDestroy {
  protected readonly title = signal('engagement-invitation-parents');

  @ViewChild('wreathTrigger') wreathTrigger!: ElementRef<HTMLDivElement>;
  @ViewChild('bgMusic') audioPlayer!: ElementRef<HTMLAudioElement>;

  currentLanguage = signal<'EN' | 'TE'>('EN');

  isAudioPlaying = true;
  isMusicOff = false;

  private observer: IntersectionObserver | null = null;
  private animated = false;
  private peacockColors = ["#ee9b00", "#005f73", "#0a9396", "#94d2bd", "#e9d8a6"];

  constructor(private cdr: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.tryPlayAudio();
    this.initScrollObserver();
  }

  @HostListener('document:click')
  @HostListener('document:touchstart')
  onUserInteraction() {
    if (!this.isAudioPlaying && !this.isMusicOff) {
      this.tryPlayAudio();
    }
  }

  private tryPlayAudio() {
    if (this.audioPlayer && this.audioPlayer.nativeElement) {
      const audio = this.audioPlayer.nativeElement;
      audio.volume = 0.4;

      audio.play()
        .then(() => {
          this.isAudioPlaying = true;
          this.cdr.detectChanges();
        })
        .catch(error => {
          this.isAudioPlaying = false;
          this.cdr.detectChanges();
          console.log('Autoplay deferred.', error);
        });
    }
  }


  toggleMusic(event: Event) {

    event.stopPropagation();

    if (this.audioPlayer && this.audioPlayer.nativeElement) {
      const audio = this.audioPlayer.nativeElement;

      if (this.isAudioPlaying) {
        audio.pause();
        this.isAudioPlaying = false;
        this.isMusicOff = true;
        this.cdr.detectChanges();
      } else {
        audio.play()
          .then(() => {
            this.isAudioPlaying = true;
            this.isMusicOff = false;
            this.cdr.detectChanges();
          })
          .catch(error => console.log('Playback error:', error));
      }
    }
  }

  private initScrollObserver(): void {
    const options: IntersectionObserverInit = { root: null, threshold: 0.4 };
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.triggerPartyPoppers();
          this.animated = true;
          // this.observer?.unobserve(entry.target);
        }
      });
    }, options);

    if (this.wreathTrigger?.nativeElement) {
      this.observer.observe(this.wreathTrigger.nativeElement);
    }
  }

  private triggerPartyPoppers(): void {
    confetti({ particleCount: 80, angle: 60, spread: 55, origin: { x: 0, y: 0.8 }, colors: this.peacockColors });
    confetti({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1, y: 0.8 }, colors: this.peacockColors });
  }

  toggleLanguage(event: Event) {
    event.stopPropagation();

    if (this.currentLanguage() === 'EN') {
      this.currentLanguage.set('TE');
    } else {
      this.currentLanguage.set('EN');
    }

    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.observer) this.observer.disconnect();
  }
}
