import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
export interface OutputData {
  index?: number;
  end?: number;
  start?: number;
  A?: number;
  B?:number
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'rc-app';

  public mantisXmControl = new FormControl();
  public intervalXpControl = new FormControl();


  //data to display
  displayedColumns: string[] = ['index', 'middle', 'end', 'start', 'A', 'B'];
  public dataSource: any = [{}];
  public loadData: boolean = false;
  public loader: boolean = false;
  public mantisXm:number = 0;
  public intervalXm:number = 0;
  public intervalXp:number = 0;
  public Wmin:number = 0;
  public divMan:number = 0;
  public MaxError:number = 0;
  public recommendedIntervals:number = 0;
  ngOnInit(){
    
  }
  public getValues():void{
    this.mantisXm = +this.mantisXmControl.value;
    this.intervalXp = +this.intervalXpControl.value;
    this.recommendedIntervals = Math.pow(2,this.intervalXpControl.value);
    this.loader= true;
    setTimeout(()=>{

      this.calculateValues(this.mantisXm, this.intervalXp);

    },2000)
  }

  public calculateValues(mantis:number, interval:number): void {
    this.mantisXm = mantis;
    this.intervalXp = interval;
    this.loadData = true;
    this.divMan = 0;
    this.Wmin = Math.pow(2, -(this.mantisXm));
    console.log("Вага молодшого розряду:", this.Wmin);
    this.intervalXp = Math.pow(2, this.intervalXp);
    this.divMan = this.Wmin / 2;
    console.log("Половина молодшого розряду:", this.divMan)
    console.log("Кількість інтервалів:", this.intervalXp)


    let tempInterval = 0.5 / this.intervalXp;
    for (let i =0.5; i < 1; i += tempInterval, this.intervalXp--) {

      let midleD = (i + (tempInterval + i - this.Wmin)) / 2;
      let valueY = 1 / midleD;
      let valueDivY = -(1 / Math.pow(midleD, 2));
      let midleValue = valueDivY / 2; //х
      let valueB = -Math.abs(midleValue) - midleD;
      let valueA = -(Math.pow(midleValue, 2) - valueY);
      let j = 0;
      let diap = i;
      let endD = i + tempInterval - this.Wmin;
      let Y;
      let Z;
      let K;
      while (diap <= endD) {
        diap = i + this.Wmin * j;
        j++;
        Y = 1 / diap;
        Z = valueA + Math.pow((diap + valueB), 2);
        K = Math.abs(Y - Z);
        if (K >= this.MaxError) {
          this.MaxError = K;
        }
      }
      let deltaStart = 1 / i - Math.abs(valueA + Math.pow((i + valueB), 2));
      let deltaEnd = 1 / (tempInterval + i - this.Wmin) - Math.abs(valueA + Math.pow(((tempInterval + i - this.Wmin) + valueB), 2));
 
      this.dataSource  =  this.dataSource.concat([{
        index:i,
        midle: midleD,
        end:deltaEnd,
        start:deltaStart,
        B:valueB,
        A:valueA,
      }])
      this.loader = false;
    }

  }

}