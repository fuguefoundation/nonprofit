import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventsService } from '../../services/services'
import { Event } from './event';
declare var window: any;

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit, OnDestroy {

	events: Event[];
  eventsArray = new Array();
	eventData = new Array();
  objectKeys = Object.keys;
  contractSelected: any;
	web3: any;
  contract: string;

  constructor(private eventsService: EventsService) {

  }

  ngOnInit(){
  	this.eventsService.getEvents().subscribe(events => {
  		this.events = events;
  	});
  }

  onContractSelected(c){
    this.contract = c;
    this.eventsArray = [];
    let eventsArray: Array<Event> = [];

    for (var i = 0; i < this.events.length; i++) {
      if (this.events[i].contract == c) {
        eventsArray.push(this.events[i]);
      }
    }
    this.eventsArray = eventsArray;
    console.log(this.eventsArray);
  }

  onEventSelected(e){
    let data : Array<string> = [this.eventsArray[e].fromBlock, this.eventsArray[e].address, this.eventsArray[e].topic];
  	if(this.eventData.length == 0){
	  	this.eventsService.getEventData(data).subscribe(events => {
        switch (this.eventsArray[e].name) {
          case "Beneficiary Added":
            this.eventData = this.eventsService.processBeneficiaryAdded(events);
            break;
          case "Donor Added":
            this.eventData = this.eventsService.processDonorAdded(events);
            break;
          case "Donation Added":
            this.eventData = this.eventsService.processDonationAdded(events);
            break;
          case "Proposal Added":
            this.eventData = this.eventsService.processProposalAdded(events);
            break;
          case "Voting Rules Changed":
            this.eventData = this.eventsService.processVotingRulesChanged(events);
            break;
          case "Member Added":
            this.eventData = this.eventsService.processMemberAdded(events);
            break;
          case "Voted":
            this.eventData = this.eventsService.processVoteCast(events);
            break;
          case "Transfer":
            this.eventData = this.eventsService.processTokenTransfer(events);
            break;
          default:
            console.log('error processing event data');
            break;
        }
	  		console.log(this.eventData);
	  	});
  	}
  }

  clearEvents(){
    this.eventData = [];
  }

  ngOnDestroy(){
  	this.eventData = [];
  }

}
