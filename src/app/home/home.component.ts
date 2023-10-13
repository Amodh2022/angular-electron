import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval } from 'rxjs';
import { DatePipe } from '@angular/common';
const readXlsxFile = require('read-excel-file/node');
const xlsx = require('xlsx');
const fs = require("fs");
const readLastLines = require('read-last-lines');
const { parse } = require("csv-parse");


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  alterdiv: any;

  currentDate: Date = new Date();
  public now: any = new Date();
  currentTime: Date = new Date();
  hours: any = this.currentTime.getHours();
  currentDay: any;
  amPm: any;
  data: any;
  myph: any;
  temp: any;
  Do: any;
  tempMod: any;
  phMod: any;
  // array: Array;
  // open connection to a tcp line

  csvData: any = [];

  constructor(private router: Router, private datePipe: DatePipe) {
    setInterval(() => {
      this.currentTime = new Date();
      this.currentDate = new Date();
      this.currentDay = this.datePipe.transform(this.currentDate, 'EEEE');
      this.amPm = this.hours >= 12 ? 'PM' : 'AM';
    }, 1);
  }

  dayTranslations: { [key: string]: string } = {
    Sunday: 'ಭಾನುವಾರ',
    Monday: 'ಸೋಮವಾರ',
    Tuesday: 'ಮಂಗಳವಾರ',
    Wednesday: 'ಬುಧವಾರ',
    Thursday: 'ಗುರುವಾರ',
    Friday: 'ಶುಕ್ರವಾರ',
    Saturday: 'ಶನಿವಾರ'
  };

  trueFunction() {
    this.alterdiv = true;
  }

  falseFunction() {
    this.alterdiv = false;
  }



  _readExcel() {

    let lastRow: any = null;

    fs.createReadStream("D:/Excel/Dologfile.csv")
      .pipe(parse({ delimiter: ",", from_line: 2 }))
      .on("data", (row: any) => {
        lastRow = row;
      })
      .on("end", () => {
        if (lastRow !== null) {
          this.Do = lastRow[3];
        } else {
          console.log("CSV is empty");
        }
      });

    readLastLines.read('D:/Excel/logfile.txt', 1)
      .then((lines: any) => {

        const split: string[] = lines.split(/\s{2,8}/);
        this.phMod = split[3];
        this.myph = this.phMod / 100;
        console.log(this.myph);
      });

  }
  async ngOnInit() {

    await setInterval(() => {
      this._readExcel();
    }, 1000);

    interval(15 * 60 * 60).subscribe(x => {
      this.falseFunction();
    });
    interval(15 * 60 * 60).subscribe(x => {
      this.trueFunction();
    });

  }
}
