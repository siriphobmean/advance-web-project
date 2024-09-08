import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Event } from '../../interfaces/event.model';
import { Participant } from '../../interfaces/participant.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-event-info',
  templateUrl: './event-info.component.html',
  styleUrl: './event-info.component.css',
  providers: [DatePipe]
})
export class EventInfoComponent implements OnInit {

  event: Event[] = [];
  selectedEvent?: Event;
  isJoined: boolean = false;
  member: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient, private datePipe: DatePipe) { }

  ngOnInit(): void {
    const eventId = Number(this.route.snapshot.paramMap.get('id'));
    
    if (eventId) {
      this.http.get<Event>(`http://localhost:3000/event/${eventId}`).subscribe({
        next: (data) => {
          this.selectedEvent = data;
          // console.log('Event data:', this.selectedEvent);
        },
        error: (err) => {
          console.error('Error fetching event:', err);
        },
      });
    }
    this.member = localStorage.getItem('username') || '';
    if (this.member) {
      this.http.get<Participant>(`http://localhost:3000/participant?member=${this.member}&eventId=${eventId}`).subscribe({
        next: (participant) => {
          if (participant) {
            this.isJoined = participant.status === 'เข้าร่วมแล้ว';
          }
        },
        error: (err) => {
          console.error('Error checking participant status:', err);
        }
      });
    }
  }

  formatDate(date: string): string {
    const dateObj = new Date(date);
    const yearBuddhist = dateObj.getFullYear() + 543;
    const months = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    const monthName = months[dateObj.getMonth()];
    return `${dateObj.getDate()} ${monthName} ${yearBuddhist} เวลา ${this.datePipe.transform(dateObj, 'HH:mm')} น.`;
  }

  onJoinEvent(): void {
    const eventId = Number(this.route.snapshot.paramMap.get('id'));
    if (eventId && this.member) {
      if (this.isJoined) {
        this.http.delete(`http://localhost:3000/participant?member=${this.member}&eventId=${eventId}`).subscribe({
          next: () => {
            // console.log('Successfully left the event.');
            this.isJoined = false;
          },
          error: (error) => {
            console.error('Error leaving the event:', error);
          }
        });
      } else {
        const participantData: Participant = {
          participantId: 0,
          member: this.member,
          eventId: eventId,
          status: 'เข้าร่วมแล้ว'
        };

        this.http.post('http://localhost:3000/participant', participantData).subscribe({
          next: (response) => {
            // console.log('Successfully joined the event:', response);
            this.isJoined = true;
          },
          error: (error) => {
            console.error('Error joining the event:', error);
          }
        });
      }
    }
  }
}