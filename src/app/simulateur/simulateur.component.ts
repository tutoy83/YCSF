import { Component, ViewChild, ElementRef } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';


interface Stage {
  nom: string;
  prix: number;
}

interface StageDemande {
  nom: string;
  prixPublic: number;
  prixRemise: number;
  remise: string;
}

interface optionDemande {
  nom: string;
  prixPublic: number;
}

@Component({
  selector: 'app-simulateur',
  templateUrl: './simulateur.component.html',
  styleUrls: ['./simulateur.component.css']
})
export class SimulateurComponent {

  stages: Stage[] = [
    { nom: 'Moussaillons', prix: 121 },
    { nom: 'OptiMouss', prix: 118},
    { nom: 'Optimist', prix: 118},
    { nom: 'Kayak', prix: 97},
    { nom: 'Planche Ados', prix: 135},
    { nom: 'Catamaran Ados', prix: 146},
    { nom: 'Catamaran Adultes', prix: 174},
    { nom: 'Planche Adultes', prix: 145},
    { nom: 'Deriveur (Vago/laser)', prix: 140},
    { nom: 'Multi-Activites', prix: 130},
  ];


  commande: { [nom: string]: number } = {};


  total: number = 0;
  caroleStatus: boolean = false;

  stagesDemandesArr: StageDemande[] = [];

  optionsDemandesArr: optionDemande[] = [];

  tabGood: number[] = [];

  ajouterStageDemande(stage: Stage): void {
    const nbStages = this.stagesDemandesArr.length;

    if (nbStages < 8){
      const stageDemande: StageDemande = {
        nom: stage.nom,
        prixPublic: stage.prix,
        prixRemise: stage.prix,
        remise: ""
      };

      this.stagesDemandesArr.push(stageDemande);
      for (let i = 0; i < this.stagesDemandesArr.length; i++) {
        for (let j = i + 1; j < this.stagesDemandesArr.length; j++) {
          if (this.stagesDemandesArr[i].prixPublic === this.stagesDemandesArr[j].prixPublic) {
            this.stagesDemandesArr[j].prixPublic += 0.000001 * (j - i);
          }
        }
      }
      this.remiseCalc();
    }else{
      alert("⚠️ Vous avez déjà 10 stages ");
    }
  }

  ajouterPassport():void{
    const optionDemande: optionDemande = {
      nom: "Passport Voile",
      prixPublic: 12
    };

    this.optionsDemandesArr.push(optionDemande);
    this.remiseCalc();
  }

  ajouterCotis():void{
    const optionDemande: optionDemande = {
      nom: "Cotisation YCSF",
      prixPublic: 19
    };

    this.optionsDemandesArr.push(optionDemande);
    this.remiseCalc();
  }

  editStage(stage: any) {
    const newPrice = prompt('Prix (avec remise) à appliquer:', stage.prixRemise);
    if (newPrice !== null) {
      stage.prixRemise = parseFloat(newPrice);
      stage.remise = '- ' + (100-(parseFloat(newPrice)*100/stage.prixPublic)).toFixed(1)+' %';
    }

    this.totalCalc();

  }

  editStageDiscount(stage: any) {
    const newDiscount = prompt('% remise à appliquer:', stage.prixRemise);
    if (newDiscount !== null) {
      if(parseFloat(newDiscount)<=100){
        stage.prixRemise = stage.prixPublic*(1-parseFloat(newDiscount)/100);
        stage.remise = " - " + parseFloat(newDiscount) + " %";
      }else{
        alert("⚠️ Erreur: remise max 100%");
      }

    }

    this.totalCalc();

  }

  remiseCalc(): number {
    const nbStages = this.stagesDemandesArr.length;

    if (nbStages === 0) {
      return 0;
    } else if (nbStages === 2) {
      this.goodFinder();
      const stagesSortedByPrice = this.stagesDemandesArr.sort((a, b) => a.prixPublic - b.prixPublic);
      if(this.tabGood.length === 1){
        this.stagesDemandesArr[this.tabGood[0]].prixRemise = this.stagesDemandesArr[this.tabGood[0]].prixPublic * 0.95;
        this.stagesDemandesArr[this.tabGood[0]].remise = " - 5%";
      }
      if(this.tabGood.length === 2){
        //Si les deux ne sont pas interdits, appliquer reduc sur le plus cher
        this.stagesDemandesArr[this.tabGood[1]].prixRemise = this.stagesDemandesArr[this.tabGood[1]].prixPublic * 0.95;
        this.stagesDemandesArr[this.tabGood[1]].remise = " - 5%";
      }

    }
    else if (nbStages >= 3) {
      this.goodFinder();
      this.totalCalc();
      const stagesSortedByPrice = this.stagesDemandesArr.sort((a, b) => a.prixPublic - b.prixPublic);
      if(this.tabGood.length === 1){
        console.log("TEST0");
        this.stagesDemandesArr[this.tabGood[0]].prixRemise = this.stagesDemandesArr[this.tabGood[0]].prixPublic * 0.9;
        this.stagesDemandesArr[this.tabGood[0]].remise = " - 10%";

      }else{
        if(this.tabGood.length === nbStages){
          console.log("TEST1");
          this.stagesDemandesArr[this.tabGood[1]].prixRemise = this.stagesDemandesArr[this.tabGood[1]].prixPublic*0.95;
          this.stagesDemandesArr[this.tabGood[1]].remise = " - 5%";
          for(let j=2; this.tabGood.length; j++){
            this.stagesDemandesArr[this.tabGood[j]].prixRemise =this.stagesDemandesArr[this.tabGood[j]].prixPublic*0.9;
            this.stagesDemandesArr[this.tabGood[j]].remise = " - 10%";
          }
        }else{
          if(this.tabGood.length === nbStages-2){

              for(let j=0; this.tabGood.length; j++){
                this.stagesDemandesArr[this.tabGood[j]].prixRemise =this.stagesDemandesArr[this.tabGood[j]].prixPublic*0.9;
                this.stagesDemandesArr[this.tabGood[j]].remise = " - 10%";
              }
          }else{

            this.stagesDemandesArr[this.tabGood[0]].prixRemise =this.stagesDemandesArr[this.tabGood[0]].prixPublic*0.95;
            this.stagesDemandesArr[this.tabGood[0]].remise = " - 5%";

            for(let j=1; this.tabGood.length; j++){
              this.stagesDemandesArr[this.tabGood[j]].prixRemise =this.stagesDemandesArr[this.tabGood[j]].prixPublic*0.9;
              this.stagesDemandesArr[this.tabGood[j]].remise = " - 10%";
            }
          }



        }

      }
  }

    console.log("Fin total", this.stagesDemandesArr);
    this.totalCalc();
    return this.total;
  }

  totalCalc(): any{
    this.total = 0;
    //GESTION STAGE
    for (let i = 0; i < this.stagesDemandesArr.length; i++) {
      this.total += this.stagesDemandesArr[i].prixRemise; // Ajoute le prixPublic de l'élément i à la variable total
    }

    //GESTION OPTION
    for (let i = 0; i < this.optionsDemandesArr.length; i++) {
      this.total += this.optionsDemandesArr[i].prixPublic; // Ajoute le prixPublic de l'élément i à la variable total
    }
  }

  goodFinder(): void {
    const stagesSortedByPrice = this.stagesDemandesArr.sort((a, b) => a.prixPublic - b.prixPublic);
    this.tabGood= [];
    for (let i = 0; i < this.stagesDemandesArr.length; i++) {
      const stage = this.stagesDemandesArr[i];
      if (stage.nom !== 'Moussaillons' && stage.nom !== 'Kayak') {
        this.tabGood.push(i);
      }
    }
    console.log("Indice dans tabStages des choses autorisees:", this.tabGood);
    // Do something with tabGood here
  }

  @ViewChild('tableRecap') table!: ElementRef;


  sendEmail() {
    const email = (document.getElementById('mailDest') as HTMLInputElement).value;
    const subject = 'Devis stages';
    let body = 'Bonjour,\n\nVous trouverez ci-joint les informations demandees sur les stages.\n\n';
    let inscriptionText = 'Pour realiser une inscription, vous pouvez remplir les documents sur notre site http://ycsixfours.com/les-activites/stages-de-voile/ et nous les transmettre par mail.\nNous restons évidemment à votre disposition pour toute question.\n\nCordialement, \n\n';
    let totalPrinted = '\n\nTOTAL = ' + this.total.toFixed(2) + ' euros\n'
    for (const stageDemande of this.stagesDemandesArr) {
      body += `- ${stageDemande.nom} ${stageDemande.remise}, soit ${stageDemande.prixRemise.toFixed(2)} euros\n`;
    }

    for (const optionDemande of this.optionsDemandesArr) {
      body += `- ${optionDemande.nom}, soit ${optionDemande.prixPublic} euros\n`;
    }

    const mailtoLink = 'mailto:' + email + '?subject=' + subject + '&body=' + encodeURIComponent(body) + totalPrinted + inscriptionText;
    window.location.href = mailtoLink;
  }

  genererPDF(): void {
    const doc = new jsPDF();
    const clientDest = (document.getElementById('clientDest') as HTMLInputElement).value;

    const imgWidth = 74;
    const imgHeight = 30;
    const margin = doc.internal.pageSize.getWidth() / 2 - imgWidth / 2;

    // Add the image centered
    doc.addImage('../../assets/YachtClub_v3.png', 'PNG', margin, 10, imgWidth, imgHeight);

    // Add the title
    const titleY = 60;
    doc.setFontSize(22);
    doc.text('Devis', doc.internal.pageSize.getWidth() / 2, titleY, { align: 'center' });

    // Add the date
    const nowPDF = new Date();
    const nowPDFDateFormated = nowPDF.toLocaleString('fr-FR', { timeZone: 'Europe/Paris', dateStyle: 'short', timeStyle: 'short' }).slice(0,10);
    const detailsY = titleY + 20;
    doc.setFontSize(12);
    doc.text('Fait à Six-Fours, le '+nowPDFDateFormated, doc.internal.pageSize.getWidth()-15, detailsY, { align: 'right' });

    // Add the client
    let clientY = 0;
    if(clientDest!==''){
      clientY = detailsY + 15;
      doc.text('Stagiaire(s) : ' + clientDest , 15, clientY, { align: 'left' });
    }

    // Add the table
    const columns = ['Intitulé', 'Prix brut', 'Réduction', 'Prix remisé'];
    const data = <any>[];

    this.stagesDemandesArr.forEach((stage) => {
      data.push([stage.nom, stage.prixPublic.toFixed(2), stage.remise, stage.prixRemise.toFixed(2)]);
    });

    this.optionsDemandesArr.forEach((option) => {
      data.push([option.nom, option.prixPublic.toFixed(2), '', option.prixPublic.toFixed(2)]);
    });

    const startY = detailsY + 25;

    autoTable(doc, {
      headStyles: { fillColor: [46, 42, 91] },
      head: [columns],
      body: data,
      startY: startY,
      theme: 'grid',

    });

    // Add the total
    doc.setFontSize(12);
    let totalY = startY + (data.length + 1) * 10;
    if(totalY<20){
      totalY = 20;
    }
    doc.text('TOTAL = ' + this.total.toFixed(2) + ' €', 155, totalY);

    // Add the text
    doc.setFontSize(10);

    const text = "Le Yacht Club de Six-Fours est une association type loi 1901 (SIRET : 37983153000017) située à l'adresse: Base nautique du Brusc - 104 corniche des îles 83140 Six-Fours\nCe document n'est pas un bon de commande, pour réaliser une inscription, merci de visiter notre site ycsixfours.com/les-activites/stages-de-voile/ et contacter le secrétariat (04 94 34 18 50 / ycsixfours@free.fr)";
    const maxWidth = 180; // adjust the width to fit the text in the PDF
    const lines = doc.splitTextToSize(text, maxWidth);
    const textY = doc.internal.pageSize.getHeight() * 0.9; // 10% from the bottom
    doc.text(lines, 15, textY);

    const now = new Date();
    const fileName = `recapitulatif_${now.toLocaleString('fr-FR', { timeZone: 'Europe/Paris', dateStyle: 'short', timeStyle: 'short' }).replace(/[/:\s]/g, '-')}.pdf`;
    doc.save(fileName);
  }


  genererExcel(): void {
    // Create a workbook
    const workbook = XLSX.utils.book_new();

    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet([
      // Add the header row
      ['Intitulé', 'Prix brut', 'Réduction', 'Prix remisé'],

      // STAGES

      ...this.stagesDemandesArr.map(stage => [stage.nom, stage.prixPublic.toFixed(2), stage.remise, stage.prixRemise.toFixed(2)]),

      // OPTIONS
      ...this.optionsDemandesArr.map(option => [option.nom, option.prixPublic.toFixed(2), '', option.prixPublic.toFixed(2)]),

      // Ajouter ligne total
      ['TOTAL', '', '', this.total.toFixed(2)]
    ]);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Devis');

    // Save the workbook as a file
    const fileName = `recapitulatif_Stages.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }


  reset(): void{
    this.stagesDemandesArr = [];
    this.optionsDemandesArr = [];
    this.total = 0;
  }

  carole(): void {
    let doc = document.getElementsByClassName('stageItem') as HTMLCollectionOf<HTMLElement>;
    let btnDoc = document.getElementsByClassName('btn-primary') as HTMLCollectionOf<HTMLElement>;
    let totalDoc = document.getElementsByClassName('total') as HTMLCollectionOf<HTMLElement>;

    this.caroleStatus = !this.caroleStatus;

      if (this.caroleStatus) {
        document.body.style.background = "linear-gradient(90deg, rgba(232,106,2,1) 16%, rgba(246,231,7,0.9979342078628326) 53%, rgba(14,153,4,1) 91%)";

        for (let i = 0; i < doc.length; i++) {
          doc[i].style.background = "linear-gradient(to right, #f83600 0%, #f9d423 100%)";
          btnDoc[i].style.background = "#05cc4bc9";
        }

        totalDoc[0].style.background = "linear-gradient(90deg, rgb(232, 106, 2) 16%, rgba(246, 231, 7, 0.996) 53%, rgb(14, 153, 4) 91%)";

      } else {
        document.body.style.background = "linear-gradient(90deg, #1CB5E0 0%, #000851 100%)";

        for (let i = 0; i < doc.length; i++) {
          doc[i].style.background = "linear-gradient(30deg, #00d2ff 0%, #3a47d5 100%";
          btnDoc[i].style.background = "#0565cc";
        }
        totalDoc[0].style.background = "lightblue";


      }

  }

}

