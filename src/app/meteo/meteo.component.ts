import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-meteo',
  templateUrl: './meteo.component.html',
  styleUrls: ['./meteo.component.css']
})
export class MeteoComponent implements OnInit {

  constructor() { }

  loadWindGuruLiveScript(): void {
    var arg = ["spot=944","uid=wglive_944_1681658679676","direct=0","wj=knots","tj=c","avg_min=0","gsize=400","msize=400","m=3","show=c"];
    var script = document.createElement("script");
    var tag = document.getElementsByTagName("script")[0];
    if (tag?.parentNode) {
      script.src = "https://www.windguru.cz/js/wglive.php?"+(arg.join("&"));
      tag.parentNode.insertBefore(script, tag);
    }
  }


  ngOnInit(): void {
    this.loadWindGuruLiveScript();
  }

}
