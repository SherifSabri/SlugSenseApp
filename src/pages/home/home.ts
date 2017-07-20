import {Component, ViewChild} from '@angular/core';
import {EChartsComponent} from "../../components/echart-component";
import * as nodeData from '../home/nodeData';
//import {EChartsComponent} from "../../components/echart-component";
import {timeBoxedData } from './nodeData';

import * as $ from 'jquery';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})



export class HomePage {

  token = null;
  base_url = "https://slugsense.herokuapp.com";
  nodeIds: number[] = [];
  nodeIndex = 0;
  //currentNid;

  message = "Hello"


  // Graph options //
  // Graph stuff should probably be moved to its own class later
  mode_day = true;



  constructor() {
    this.token = localStorage.getItem("token");
    if (this.token == null){
      console.log("token lost");
    }
    // Update the node IDs
    let nids = localStorage.getItem("nids");
    if (!nids) this.updateNodeIds;
    else this.nodeIds = JSON.parse(nids);
    //this.currentNid = this.nodeIds[0];
    //console.log(this.nodeIds);

    //this.updateNodeIds();

    //let test = new visual_obj(null,["humidity"]);
    //console.log(test);
    //this.getLatestAll().done(this.getNids);  }
  }


  /*
    Functions called via events on the home page
  */
  //---------------------------------------------------------------------//
  log24hrData(event){
    //let nid = (<HTMLInputElement>document.getElementById("nid")).value;
    let timestamp = (<HTMLInputElement>document.getElementById("timestamp")).value;
    this.get24hrData(this.currNid(),timestamp).done(this.handleData);
  }
  logLatestAll(event){
    this.getLatestAll().done(this.consoleLog);
  }
  logLatestNid(event){
    //let nid = (<HTMLInputElement>document.getElementById("nid")).value;
    this.getLatestNode(this.currNid()).done(this.consoleLog);
  }
  updateNodeIds(){
    this.getLatestAll().done(this._updateNodeIds);
  }
  test(){
    //let nid = (<HTMLInputElement>document.getElementById("nid")).value;
    let timestamp = (<HTMLInputElement>document.getElementById("timestamp")).value;
    this.get24hrData(this.currNid(), timestamp).done(this.handleData);
  }
  toggleDailyWeekly(){
    this.mode_day = !this.mode_day;
    // this.updateGraph() // -- implement in future
  }
  changeNid(){
    this.nodeIndex = (this.nodeIndex + 1) % this.nodeIds.length;
  }
  //---------------------------------------------------------------------//


/*
      HOW TO USE AJAX CALLS

    Ajax calls are asynchronous so they cannot change values of variables
    outside of its scope, including fields of the HomePage class itself.

    To use the data:
    *nameOfAjaxCall*(*params*).done(*nameOfDataHandlingFunction*);

    There is no need to specify the parameters of the data handle function,
    as the data from the ajax call will be passed automatically as the input.
    The done() function is called once the server responds with the data and
    the specified data handling function is called.

    Heres an example that simply prints any data from the call to the console:

      this.getLatestNode(51).done(this.consoleLog);

    Both involved functions are defined below.



*/


  /*
    Lists of ajax calls that returns data
  */
  //---------------------------------------------------------------------//
  get24hrData(nid, _timestamp){
    if (_timestamp){
      return $.ajax({
        type: "POST",
        dataType: "json",
        url: this.base_url+"/api/nodes/prev_24h/"+nid.toString(),
        data: {api_token: this.token, timestamp: _timestamp }
      });
    }
    return $.ajax({
      type: "POST",
      dataType: "json",
      url: this.base_url+"/api/nodes/prev_24h/"+nid.toString(),
      data: {api_token: this.token}
    });
  };

  getLatestNode(nid){
    return $.ajax({
      type: "POST",
      dataType: "json",
      url: this.base_url+"/api/nodes/"+nid.toString()+"/latest_reading",
      data: { api_token: this.token}
    });
  }

  getLatestAll() {
    return $.ajax({
      context: this,
      url: this.base_url + "/api/nodes/latest_readings/all",
      type:"POST",
      data: {api_token: this.token},
    })
  }

  getNodeReadings(nid){
    return $.ajax({
      type: "GET",
      dataType: "json",
      url: this.base_url+"/api/nodes/"+nid.toString(),
      data: {} //api_token: this.token}
    });
  }

  getUserInfo() {
    //return $.
  }
  //---------------------------------------------------------------------//


  /*
  Data handling functions

  Write functions that handle data recieved from ajax calls here
  */
  //---------------------------------------------------------------------//
  consoleLog(data){
    console.log(data);
  };

  _updateNodeIds(data: Object[]){
    let nids: number[] = [];
    for (let node of data){
      //console.log(node);
      if ("nodeId" in node)
        nids.push(node["nodeId"]);
    }
    this.nodeIds = nids;
    //localStorage.setItem("nids", JSON.stringify(nids))
  };

  //---------------------------------------------------------------------//


  /*
  Utility functions
  */
  //---------------------------------------------------------------------//
  printNodeIds(){
    console.log(this.nodeIds);
  };

  handleData(data) {
    //console.log(data);
    let box : timeBoxedData = new timeBoxedData(data, 24);
    console.log(box);
    console.log(box.getDataAsDict());
  }

  currNid(): number {
    return this.nodeIds[this.nodeIndex];
  }



 //end graph

}
